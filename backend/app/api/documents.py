import logging
from fastapi import APIRouter, File, UploadFile, HTTPException
from app.schemas.documents import DocumentProcessResponse
from app.schemas.study import FlashcardItem, QuizQuestionItem
from app.services.document_service import document_service
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/process-pdf", response_model=DocumentProcessResponse)
async def process_pdf_document(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        content_bytes = await file.read()
        extracted_text, page_count, char_count = document_service.extract_text_from_pdf(content_bytes)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Error reading file: {e}")
        raise HTTPException(status_code=500, detail="Failed to read uploaded PDF file.")

    if not extracted_text.strip():
        raise HTTPException(status_code=422, detail="No readable text found in the PDF. It might be scanned images.")

    title = file.filename.rsplit(".", 1)[0].replace("-", " ").replace("_", " ").title()

    if ai_service.is_configured():
        prompt = f"""
Analyze this uploaded textbook chapter or lecture notes PDF titled '{title}'.

Text Content:
{extracted_text[:20000]}

Respond ONLY in valid JSON:
{{
  "summary": "Concise 2-3 paragraph academic summary of the document",
  "keyTakeaways": [
    "Key takeaway 1",
    "Key takeaway 2",
    "Key takeaway 3"
  ],
  "flashcards": [
    {{ "front": "Concept 1", "back": "Definition 1" }},
    {{ "front": "Concept 2", "back": "Definition 2" }}
  ],
  "quizQuestions": [
    {{
      "question": "Question about core concept?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why Option A is correct."
    }}
  ]
}}
"""
        try:
            data = ai_service.generate_json(prompt)
            return DocumentProcessResponse(
                title=title,
                pageCount=page_count,
                charCount=char_count,
                summary=data.get("summary", "Summary extracted by LearnNova AI."),
                keyTakeaways=data.get("keyTakeaways", []),
                flashcards=[FlashcardItem(id=i+1, **f) for i, f in enumerate(data.get("flashcards", []))],
                quizQuestions=[QuizQuestionItem(id=i+1, **q) for i, q in enumerate(data.get("quizQuestions", []))],
            )
        except Exception as e:
            logger.error(f"Gemini PDF analysis error: {e}")

    # Fallback if key not set
    return DocumentProcessResponse(
        title=title,
        pageCount=page_count,
        charCount=char_count,
        summary=f"Successfully extracted {char_count} characters across {page_count} pages from '{file.filename}'. Add GEMINI_API_KEY in backend/.env for full AI study synthesis.",
        keyTakeaways=[
            f"Extracted {page_count} pages of text.",
            f"Document title: {title}",
            "Ready for study and AI tutoring.",
        ],
        flashcards=[
            FlashcardItem(id=1, front=f"{title} (Overview)", back=f"Document with {page_count} pages processed by LearnNova.")
        ],
        quizQuestions=[
            QuizQuestionItem(
                id=1,
                question=f"How many pages are in '{file.filename}'?",
                options=[str(page_count), str(page_count + 5), str(max(1, page_count - 2)), "None"],
                correctIndex=0,
                explanation=f"The uploaded document contains {page_count} pages.",
            )
        ],
    )
