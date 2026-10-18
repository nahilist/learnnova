from pydantic import BaseModel, Field
from typing import List, Optional
from app.schemas.study import FlashcardItem, QuizQuestionItem


class ChapterItem(BaseModel):
    time: str = Field(description="Timestamp in format MM:SS or HH:MM:SS")
    title: str = Field(description="Chapter title")
    summary: str = Field(description="Short summary of what is covered in this chapter")


class YouTubeSummarizeRequest(BaseModel):
    url: str = Field(description="YouTube video URL or Video ID")
    generate_study_tools: bool = Field(default=True, description="Whether to also generate flashcards and quiz")


class YouTubeSummarizeResponse(BaseModel):
    id: str
    youtubeId: str
    title: str
    channel: str
    duration: str
    url: str
    summary: str
    keyTakeaways: List[str]
    chapters: List[ChapterItem]
    quizQuestions: List[QuizQuestionItem]
    flashcards: List[FlashcardItem]
