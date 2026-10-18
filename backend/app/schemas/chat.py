from pydantic import BaseModel, Field
from typing import List, Optional


class ChatMessage(BaseModel):
    sender: str = Field(description="'user' or 'ai'")
    text: str = Field(description="Message content")


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, description="User question or prompt")
    context: Optional[str] = Field(default="", description="Optional study material / document context")
    history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Previous messages in chat")


class ChatResponse(BaseModel):
    reply: str
