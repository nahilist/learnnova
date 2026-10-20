import logging
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from app.schemas.documents import DocumentProcessResponse, DocumentChunkItem
from app.schemas.study import FlashcardItem, QuizQuestionItem
from app.services.document_service import document_service
from app.services.ai_service import ai_service
from app.core.auth import get_verified_user_id

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/process-pdf", response_model=DocumentProcessResponse)
async def process_pdf_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_verified_user_id)
):
    filename = file.filename or "Document.pdf"
    lower_name = filename.lower()
    is_pdf = lower_name.endswith(".pdf")
    is_txt = lower_name.endswith(".txt") or lower_name.endswith(".md")

    if not is_pdf and not is_txt:
        raise HTTPException(status_code=400, detail="Only PDF, TXT, and Markdown files are supported.")

    try:
        content_bytes = await file.read()
        if is_pdf:
            extracted_text, page_count, char_count, pages_data = document_service.extract_text_from_pdf(content_bytes)
        else:
            extracted_text, page_count, char_count, pages_data = document_service.extract_text_from_raw(content_bytes, filename)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Error reading file for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to parse uploaded document.")

    title = filename.rsplit(".", 1)[0].replace("-", " ").replace("_", " ").title()
    chunks = document_service.create_chunks(pages_data)
    chunk_items = [
        DocumentChunkItem(
            pageNumber=c["page_number"],
            chunkIndex=c["chunk_index"],
            content=c["content"],
        )
        for c in chunks
    ]

    if ai_service.is_configured():
        prompt = f"""
Analyze this uploaded textbook chapter or lecture notes titled '{title}'.

Text Content Excerpt:
{extracted_text[:18000]}

Respond ONLY in valid JSON:
{{
  "summary": "Concise, structured 2-3 paragraph academic synthesis of the document with key principles.",
  "keyTakeaways": [
    "High-yield takeaway 1",
    "High-yield takeaway 2",
    "High-yield takeaway 3"
  ],
  "flashcards": [
    {{ "front": "Core Concept / Question", "back": "Precise Definition / Answer" }},
    {{ "front": "Key Term / Mechanism", "back": "Detailed Explanation" }}
  ],
  "quizQuestions": [
    {{
      "question": "Engaging multiple choice question testing conceptual understanding?",
      "options": ["Accurate Option A", "Plausible Distractor B", "Plausible Distractor C", "Plausible Distractor D"],
      "correctIndex": 0,
      "explanation": "Why Option A is correct according to the material."
    }}
  ]
}}
"""
        try:
            data = ai_service.generate_json(prompt)
            flashcards = [
                FlashcardItem(id=i + 1, **f)
                for i, f in enumerate(data.get("flashcards", []))
                if "front" in f and "back" in f
            ]
            quiz_questions = [
                QuizQuestionItem(id=i + 1, **q)
                for i, q in enumerate(data.get("quizQuestions", []))
                if "question" in q and "options" in q
            ]

            return DocumentProcessResponse(
                title=title,
                pageCount=page_count,
                charCount=char_count,
                summary=data.get("summary", "Summary extracted by LearnNova AI."),
                keyTakeaways=data.get("keyTakeaways", []),
                flashcards=flashcards if flashcards else [
                    FlashcardItem(id=1, front=f"{title} Overview", back=extracted_text[:200])
                ],
                quizQuestions=quiz_questions if quiz_questions else [
                    QuizQuestionItem(
                        id=1,
                        question=f"What is the focus of {title}?",
                        options=[title, "Unrelated material", "Introduction", "General reading"],
                        correctIndex=0,
                        explanation=f"Based on the studied document {title}.",
                    )
                ],
                chunks=chunk_items,
            )
        except Exception as e:
            logger.error(f"AI synthesis error for user {user_id}: {e}")

    # Educational fallback synthesis when AI provider is unconfigured or rate limited
    sample_text = extracted_text[:300].strip()
    return DocumentProcessResponse(
        title=title,
        pageCount=page_count,
        charCount=char_count,
        summary=f"Extracted {char_count} characters across {page_count} pages from '{filename}'.\n\nOverview excerpt:\n{sample_text}...",
        keyTakeaways=[
            f"Parsed {page_count} pages with {len(chunks)} discrete study chunks.",
            f"Document Title: {title}",
            "Ready for source-grounded AI tutoring and active recall practice.",
        ],
        flashcards=[
            FlashcardItem(
                id=1,
                front=f"{title} (Core Topic)",
                back=chunks[0]["content"][:180] if chunks else f"Study material from {filename}",
            ),
            FlashcardItem(
                id=2,
                front="Active Recall Practice",
                back="Testing memory retention against study materials provides proven long-term academic gains.",
            ),
        ],
        quizQuestions=[
            QuizQuestionItem(
                id=1,
                question=f"How many pages were processed from '{filename}'?",
                options=[str(page_count), str(page_count + 3), str(max(1, page_count - 1)), "None"],
                correctIndex=0,
                explanation=f"The uploaded document contains {page_count} parsed pages.",
            )
        ],
        chunks=chunk_items,
    )
