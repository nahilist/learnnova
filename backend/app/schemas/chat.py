from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class ChatMessage(BaseModel):
    sender: str = Field(description="'user' or 'ai'")
    text: str = Field(description="Message content")


class CitationItem(BaseModel):
    pageNumber: int
    excerpt: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, description="User question or prompt")
    context: Optional[str] = Field(default="", description="Optional study material / document context")
    chunks: Optional[List[Dict[str, Any]]] = Field(default=None, description="Document chunks for grounded retrieval")
    history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Previous messages in chat")


class ChatResponse(BaseModel):
    reply: str
    citations: List[CitationItem] = []
    grounded: bool = True
