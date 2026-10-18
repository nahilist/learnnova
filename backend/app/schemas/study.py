from pydantic import BaseModel, Field
from typing import List, Optional


class FlashcardItem(BaseModel):
    id: Optional[int] = None
    front: str = Field(description="Question, concept, or term on the front of the flashcard")
    back: str = Field(description="Answer, explanation, or definition on the back of the flashcard")


class QuizQuestionItem(BaseModel):
    id: Optional[int] = None
    question: str = Field(description="The multiple-choice question")
    options: List[str] = Field(description="List of 4 plausible answer options")
    correctIndex: int = Field(description="0-based index of the correct option (0, 1, 2, or 3)")
    explanation: str = Field(description="Detailed explanation of why the answer is correct")


class GenerateFlashcardsRequest(BaseModel):
    content: str = Field(min_length=10, description="Text content to generate flashcards from")
    count: int = Field(default=6, ge=1, le=25, description="Number of flashcards to generate")


class GenerateFlashcardsResponse(BaseModel):
    flashcards: List[FlashcardItem]


class GenerateQuizRequest(BaseModel):
    content: str = Field(min_length=10, description="Text content to generate quiz from")
    count: int = Field(default=5, ge=1, le=20, description="Number of questions to generate")


class GenerateQuizResponse(BaseModel):
    questions: List[QuizQuestionItem]
