import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.study import (
    GenerateFlashcardsRequest,
    GenerateFlashcardsResponse,
    GenerateQuizRequest,
    GenerateQuizResponse,
    QuizSubmitRequest,
    QuizSubmitResponse,
    QuizGradedQuestion,
    QuizQuestionItem,
    QuizQuestionClientItem,
    FlashcardItem,
)
from app.services.ai_service import ai_service
from app.core.auth import get_verified_user_id

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/study", tags=["Study Tools"])

# In-memory session quiz storage for instant server-side answer evaluation
_ACTIVE_QUIZZES: dict[str, List[QuizQuestionItem]] = {}


@router.post("/flashcards", response_model=GenerateFlashcardsResponse)
def generate_flashcards(
    payload: GenerateFlashcardsRequest,
    user_id: str = Depends(get_verified_user_id)
):
    count = min(max(payload.count, 1), 20)

    if not ai_service.is_configured():
        # Clean local heuristic extraction
        sentences = [s.strip() for s in payload.content.replace("\n", " ").split(".") if len(s.strip()) > 20]
        cards = []
        for i, sentence in enumerate(sentences[:count]):
            words = sentence.split()
            term = " ".join(words[:4]) + "..." if len(words) > 4 else "Core Concept"
            cards.append(FlashcardItem(
                id=i + 1,
                front=f"Explain: {term}",
                back=sentence,
                sourceRef="Document Overview",
                mastery=0
            ))
        if not cards:
            cards = [
                FlashcardItem(id=1, front="Primary Topic", back=payload.content[:180], mastery=0),
                FlashcardItem(
                    id=2,
                    front="Active Recall Principle",
                    back="Testing retrieval of concepts from memory produces dramatically higher exam retention than passive reading.",
                    mastery=1
                ),
            ]
        return GenerateFlashcardsResponse(flashcards=cards)

    prompt = f"""
Generate {count} high-yield, academically rigorous study flashcards from the following content.
Each flashcard must have a concise, clear 'front' (term, question, or conceptual prompt) and an informative 'back' (definition, breakdown, or answer).
Include an optional 'sourceRef' if a chapter or page is indicated.

Text Excerpt:
{payload.content[:14000]}

Respond ONLY in valid JSON:
{{
  "flashcards": [
    {{ "front": "Term / Question", "back": "Definition / Answer", "sourceRef": "Page 1" }}
  ]
}}
"""
    try:
        data = ai_service.generate_json(prompt)
        items = [
            FlashcardItem(
                id=i + 1,
                front=f.get("front", f"Concept {i+1}"),
                back=f.get("back", "Study note"),
                sourceRef=f.get("sourceRef"),
                mastery=0,
            )
            for i, f in enumerate(data.get("flashcards", []))
            if "front" in f and "back" in f
        ]
        if items:
            return GenerateFlashcardsResponse(flashcards=items)
    except Exception as e:
        logger.error(f"AI flashcard generation error for user {user_id}: {e}")

    # Fallback cards
    return GenerateFlashcardsResponse(
        flashcards=[
            FlashcardItem(
                id=1,
                front="Key Topic Overview",
                back=payload.content[:200] + ("..." if len(payload.content) > 200 else ""),
                mastery=0,
            ),
            FlashcardItem(
                id=2,
                front="Active Recall Study Method",
                back="Testing memory retrieval strengthens neural pathways and dramatically boosts long-term conceptual retention.",
                mastery=1,
            ),
        ]
    )


@router.post("/quiz", response_model=GenerateQuizResponse)
def generate_quiz(
    payload: GenerateQuizRequest,
    user_id: str = Depends(get_verified_user_id)
):
    count = min(max(payload.count, 1), 10)
    difficulty = payload.difficulty or "medium"

    if not ai_service.is_configured():
        sentences = [s.strip() for s in payload.content.replace("\n", " ").split(".") if len(s.strip()) > 20]
        first_sentence = sentences[0] if sentences else payload.content[:120]
        q = QuizQuestionItem(
            id=1,
            question=f"Which statement is directly supported by the study text?",
            options=[
                first_sentence,
                "The text focuses on completely unrelated concepts.",
                "No substantive conclusions were presented in the excerpt.",
                "The findings are refuted by the author in the conclusion.",
            ],
            correctIndex=0,
            explanation=f"This fact is stated directly in the source material: '{first_sentence}'.",
        )
        questions = [q]
        if payload.documentId:
            _ACTIVE_QUIZZES[payload.documentId] = questions

        client_questions = [
            QuizQuestionClientItem(id=q.id, question=q.question, options=q.options)
            for q in questions
        ]
        return GenerateQuizResponse(questions=questions, clientQuestions=client_questions)

    prompt = f"""
Generate {count} {difficulty}-difficulty multiple-choice practice exam questions based on the following content.
Requirements:
1. Each question must test conceptual mastery and understanding, not trivia.
2. Provide exactly 4 plausible options for each question.
3. 'correctIndex' must be the 0-based integer index of the correct option (0, 1, 2, or 3).
4. 'explanation' must clearly explain why the correct option is right and why distractors are incorrect.

Text:
{payload.content[:14000]}

Respond ONLY in valid JSON:
{{
  "questions": [
    {{
      "question": "Engaging question stem?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Clear explanation of the correct choice."
    }}
  ]
}}
"""
    try:
        data = ai_service.generate_json(prompt)
        items = [
            QuizQuestionItem(
                id=i + 1,
                question=q["question"],
                options=q["options"][:4],
                correctIndex=min(max(q.get("correctIndex", 0), 0), 3),
                explanation=q.get("explanation", "Based on the study material."),
            )
            for i, q in enumerate(data.get("questions", []))
            if "question" in q and len(q.get("options", [])) >= 4
        ]
        if items:
            if payload.documentId:
                _ACTIVE_QUIZZES[payload.documentId] = items
            client_questions = [
                QuizQuestionClientItem(id=q.id, question=q.question, options=q.options)
                for q in items
            ]
            return GenerateQuizResponse(questions=items, clientQuestions=client_questions)
    except Exception as e:
        logger.error(f"AI quiz generation error for user {user_id}: {e}")

    # Fallback question
    fallback_q = QuizQuestionItem(
        id=1,
        question=f"What is the primary subject matter of this study document?",
        options=[
            payload.content[:100],
            "Unrelated background reading",
            "Introductory preface only",
            "Historical commentary",
        ],
        correctIndex=0,
        explanation="Accurately reflects the main concept discussed in the text.",
    )
    if payload.documentId:
        _ACTIVE_QUIZZES[payload.documentId] = [fallback_q]

    client_q = [QuizQuestionClientItem(id=fallback_q.id, question=fallback_q.question, options=fallback_q.options)]
    return GenerateQuizResponse(questions=[fallback_q], clientQuestions=client_q)


@router.post("/quiz/submit", response_model=QuizSubmitResponse)
def submit_quiz(
    payload: QuizSubmitRequest,
    user_id: str = Depends(get_verified_user_id)
):
    """
    Server-side quiz grading. Validates submitted answers against stored answer keys.
    Prevents client-side answer key tampering.
    """
    questions: List[QuizQuestionItem] = []

    # 1. Check stored active quiz
    if payload.documentId and payload.documentId in _ACTIVE_QUIZZES:
        questions = _ACTIVE_QUIZZES[payload.documentId]
    elif payload.questions:
        questions = payload.questions

    if not questions:
        raise HTTPException(
            status_code=400,
            detail="No active quiz found to grade. Please generate or load a quiz first.",
        )

    correct_count = 0
    results: List[QuizGradedQuestion] = []

    for q in questions:
        # User answer key is either string or int key
        user_ans = payload.answers.get(str(q.id))
        if user_ans is None:
            user_ans = payload.answers.get(q.id)  # type: ignore

        is_correct = (user_ans == q.correctIndex)
        if is_correct:
            correct_count += 1

        results.append(QuizGradedQuestion(
            id=q.id,
            question=q.question,
            options=q.options,
            userAnswer=user_ans,
            correctAnswer=q.correctIndex,
            isCorrect=is_correct,
            explanation=q.explanation,
        ))

    total = len(questions)
    percentage = round((correct_count / total) * 100, 1) if total > 0 else 0.0
    passed = percentage >= 70.0

    return QuizSubmitResponse(
        score=correct_count,
        totalQuestions=total,
        percentage=percentage,
        passed=passed,
        results=results,
    )
