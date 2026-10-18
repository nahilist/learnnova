from pydantic import BaseModel
from typing import List
from app.schemas.study import FlashcardItem, QuizQuestionItem


class DocumentProcessResponse(BaseModel):
    title: str
    pageCount: int
    charCount: int
    summary: str
    keyTakeaways: List[str]
    flashcards: List[FlashcardItem]
    quizQuestions: List[QuizQuestionItem]
