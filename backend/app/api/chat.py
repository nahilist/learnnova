from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_service import ai_service

router = APIRouter(prefix="/chat", tags=["AI Tutor Chat"])

SYSTEM_INSTRUCTION = """
You are LearnNova's 24/7 AI Tutor. Your mission is to help students learn deeply and master their study materials.
Guidelines:
- If study material context is provided, prioritize facts from the material and explain clearly.
- If asked to quiz the user, provide an engaging question and evaluate their response.
- Use clean formatting, bullet points, and code or formulas when relevant.
- Keep tone encouraging, patient, and intellectually rigorous.
"""


@router.post("/ask", response_model=ChatResponse)
def ask_ai_tutor(payload: ChatRequest):
    prompt_parts = []
    
    if payload.context:
        prompt_parts.append(f"--- Study Material Context ---\n{payload.context[:10000]}\n--- End Context ---\n")

    if payload.history:
        prompt_parts.append("--- Conversation History ---")
        for msg in payload.history[-6:]:
            role = "Student" if msg.sender == "user" else "LearnNova AI"
            prompt_parts.append(f"{role}: {msg.text}")
        prompt_parts.append("--- End History ---\n")

    prompt_parts.append(f"Student: {payload.message}\nLearnNova AI:")
    full_prompt = "\n".join(prompt_parts)

    reply = ai_service.generate_text(full_prompt, system_instruction=SYSTEM_INSTRUCTION)
    return ChatResponse(reply=reply)
