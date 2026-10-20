from pydantic import BaseModel
from typing import List, Optional
from app.schemas.study import FlashcardItem, QuizQuestionItem


class DocumentChunkItem(BaseModel):
    pageNumber: int
    chunkIndex: int
    content: str


class DocumentProcessResponse(BaseModel):
    title: str
    pageCount: int
    charCount: int
    summary: str
    keyTakeaways: List[str]
    flashcards: List[FlashcardItem]
    quizQuestions: List[QuizQuestionItem]
    chunks: Optional[List[DocumentChunkItem]] = []
