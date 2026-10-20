from pydantic import BaseModel, Field
from typing import List, Optional, Dict


class FlashcardItem(BaseModel):
    id: Optional[int] = None
    front: str = Field(description="Question, concept, or term on the front of the flashcard")
    back: str = Field(description="Answer, explanation, or definition on the back of the flashcard")
    sourceRef: Optional[str] = Field(default=None, description="Page or chapter reference")
    mastery: Optional[int] = Field(default=0, description="0=new, 1=learning, 2=mastered")


class QuizQuestionItem(BaseModel):
    id: int
    question: str = Field(description="The multiple-choice question")
    options: List[str] = Field(description="List of 4 plausible answer options")
    correctIndex: int = Field(description="0-based index of the correct option (0, 1, 2, or 3)")
    explanation: str = Field(description="Detailed explanation of why the answer is correct")


class QuizQuestionClientItem(BaseModel):
    """Client-facing representation: hides correctIndex and explanation until submitted."""
    id: int
    question: str
    options: List[str]


class GenerateFlashcardsRequest(BaseModel):
    content: str = Field(min_length=5, description="Text content to generate flashcards from")
    count: int = Field(default=5, ge=1, le=25, description="Number of flashcards to generate")
    documentId: Optional[str] = None


class GenerateFlashcardsResponse(BaseModel):
    flashcards: List[FlashcardItem]


class GenerateQuizRequest(BaseModel):
    content: str = Field(min_length=5, description="Text content to generate quiz from")
    count: int = Field(default=4, ge=1, le=15, description="Number of questions to generate")
    difficulty: Optional[str] = Field(default="medium", description="'easy', 'medium', or 'hard'")
    documentId: Optional[str] = None


class GenerateQuizResponse(BaseModel):
    questions: List[QuizQuestionItem]
    clientQuestions: Optional[List[QuizQuestionClientItem]] = None


class QuizSubmitRequest(BaseModel):
    quizId: Optional[str] = None
    documentId: Optional[str] = None
    answers: Dict[str, int] = Field(description="Map of question id string -> selected option index")
    # For in-memory verification fallback:
    questions: Optional[List[QuizQuestionItem]] = None


class QuizGradedQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    userAnswer: Optional[int]
    correctAnswer: int
    isCorrect: bool
    explanation: str


class QuizSubmitResponse(BaseModel):
    score: int
    totalQuestions: int
    percentage: float
    passed: bool
    results: List[QuizGradedQuestion]
