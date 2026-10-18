from fastapi import APIRouter, HTTPException
from app.schemas.study import (
    GenerateFlashcardsRequest,
    GenerateFlashcardsResponse,
    GenerateQuizRequest,
    GenerateQuizResponse,
    FlashcardItem,
    QuizQuestionItem,
)
from app.services.ai_service import ai_service

router = APIRouter(prefix="/study", tags=["Study Tools"])


@router.post("/flashcards", response_model=GenerateFlashcardsResponse)
def generate_flashcards(payload: GenerateFlashcardsRequest):
    if not ai_service.is_configured():
        # Dynamic fallback extraction from user content
        snippets = [s.strip() for s in payload.content.split(".") if len(s.strip()) > 15]
        cards = []
        for i, snippet in enumerate(snippets[:payload.count]):
            words = snippet.split()
            concept = " ".join(words[:4]) + "..." if len(words) > 4 else snippet
            cards.append(FlashcardItem(id=i+1, front=f"Explain: {concept}", back=snippet))
        if not cards:
            cards = [
                FlashcardItem(id=1, front="Core Principle", back=payload.content[:150]),
                FlashcardItem(id=2, front="Active Recall", back="Testing memory during study dramatically improves long-term conceptual retention."),
            ]
        return GenerateFlashcardsResponse(flashcards=cards)

    prompt = f"""
Generate {payload.count} high-quality study flashcards from the following text.
Each flashcard must have a concise, clear 'front' (term/question) and an informative 'back' (definition/answer).

Text:
{payload.content[:15000]}

Respond ONLY in valid JSON:
{{
  "flashcards": [
    {{ "front": "Term / Question", "back": "Definition / Answer" }}
  ]
}}
"""
    try:
        data = ai_service.generate_json(prompt)
        items = [
            FlashcardItem(id=i+1, front=f["front"], back=f["back"])
            for i, f in enumerate(data.get("flashcards", []))
        ]
        return GenerateFlashcardsResponse(flashcards=items)
    except Exception as e:
        # Graceful fallback on AI API error (e.g. balance/rate limit)
        return GenerateFlashcardsResponse(
            flashcards=[
                FlashcardItem(id=1, front="Key Concept", back=f"Generated from content: {payload.content[:100]}..."),
                FlashcardItem(id=2, front="Study Note", back=f"Active recall helps retention. (Note: {str(e)})"),
            ]
        )


@router.post("/quiz", response_model=GenerateQuizResponse)
def generate_quiz(payload: GenerateQuizRequest):
    if not ai_service.is_configured():
        snippets = [s.strip() for s in payload.content.split(".") if len(s.strip()) > 15]
        first_snippet = snippets[0] if snippets else payload.content[:100]
        return GenerateQuizResponse(
            questions=[
                QuizQuestionItem(
                    id=1,
                    question=f"Which statement accurately reflects the study text?",
                    options=[
                        first_snippet,
                        "The text discusses unrelated subject matter.",
                        "No factual conclusions were presented.",
                        "The author contradicts this premise entirely.",
                    ],
                    correctIndex=0,
                    explanation=f"Based directly on the studied excerpt: '{first_snippet}'.",
                )
            ]
        )

    prompt = f"""
Generate {payload.count} rigorous multiple-choice quiz questions based on the following content.
Each question must have exactly 4 options, a 0-based 'correctIndex', and an 'explanation'.

Text:
{payload.content[:15000]}

Respond ONLY in valid JSON:
{{
  "questions": [
    {{
      "question": "Clear question stem?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Detailed rationale."
    }}
  ]
}}
"""
    try:
        data = ai_service.generate_json(prompt)
        items = [
            QuizQuestionItem(
                id=i+1,
                question=q["question"],
                options=q["options"],
                correctIndex=q["correctIndex"],
                explanation=q["explanation"],
            )
            for i, q in enumerate(data.get("questions", []))
        ]
        return GenerateQuizResponse(questions=items)
    except Exception as e:
        return GenerateQuizResponse(
            questions=[
                QuizQuestionItem(
                    id=1,
                    question=f"What is the primary topic of the studied text: '{payload.content[:60]}...'?",
                    options=["Primary Concept Discussed", "Unrelated Subject", "Introduction Only", "None of the above"],
                    correctIndex=0,
                    explanation=f"Based on the input content. (Note: {str(e)})",
                )
            ]
        )
