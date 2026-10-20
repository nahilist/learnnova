import uuid
import logging
from fastapi import APIRouter, HTTPException
from app.schemas.youtube import YouTubeSummarizeRequest, YouTubeSummarizeResponse, ChapterItem
from app.schemas.study import FlashcardItem, QuizQuestionItem
from app.services.youtube_service import youtube_service
from app.services.ai_service import ai_service

from app.core.auth import get_verified_user_id
from fastapi import Depends

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/youtube", tags=["YouTube Summarizer"])


@router.post("/summarize", response_model=YouTubeSummarizeResponse)
async def summarize_youtube_video(
    payload: YouTubeSummarizeRequest,
    user_id: str = Depends(get_verified_user_id)
):
    video_id = youtube_service.extract_video_id(payload.url)
    if not video_id:
        raise HTTPException(
            status_code=400,
            detail="Invalid YouTube URL. Please provide a valid youtube.com or youtu.be link.",
        )

    # 1. Fetch metadata (Title, Channel, Description, Duration)
    metadata = await youtube_service.get_video_metadata(video_id)

    # 2. Fetch transcript (resilient: returns None if closed captions disabled or restricted by YouTube)
    try:
        full_transcript, raw_entries, duration_sec = youtube_service.get_transcript(video_id)
    except Exception as e:
        logger.warning(f"Non-critical transcript warning for {video_id}: {e}")
        full_transcript, raw_entries, duration_sec = None, [], 0.0

    if duration_sec <= 0.0 and metadata.get("duration_sec", 0.0) > 0:
        duration_sec = metadata["duration_sec"]

    duration_str = youtube_service.format_duration(duration_sec)

    # 3. AI Analysis with Groq / DeepSeek / Gemini
    if ai_service.is_configured():
        if full_transcript:
            prompt = f"""
You are LearnNova's master AI educator. Analyze this YouTube lecture transcript and extract comprehensive study materials.

Video Title: {metadata['title']}
Channel: {metadata['channel']}
Transcript:
{full_transcript[:25000]}

Respond ONLY with valid JSON with this exact structure:
{{
  "summary": "Clear, in-depth academic summary (2-3 paragraphs)",
  "keyTakeaways": [
    "Key takeaway 1 with deep context",
    "Key takeaway 2 with deep context",
    "Key takeaway 3 with deep context",
    "Key takeaway 4 with deep context"
  ],
  "chapters": [
    {{ "time": "00:00", "title": "Introduction to Topic", "summary": "Overview and primary problem definition." }},
    {{ "time": "04:30", "title": "Core Mechanism", "summary": "Detailed exploration of primary concept." }}
  ],
  "quizQuestions": [
    {{
      "question": "What is the primary concept discussed?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why Option A is correct."
    }}
  ],
  "flashcards": [
    {{
      "front": "Concept or Term",
      "back": "Detailed definition and importance."
    }}
  ]
}}
"""
        else:
            # Fallback to rich video title, author, and description when subtitles are restricted on YouTube
            desc_sample = (metadata.get("description") or "")[:4000]
            prompt = f"""
You are LearnNova's master AI educator. A student wants to study the following educational lecture.
Subtitles/closed captions were not published or were restricted for this video on YouTube.
Based on the video title, lecturer, and detailed course overview below, generate an exhaustive, high-yield academic study guide.

Video Title: {metadata['title']}
Channel / Instructor: {metadata['channel']}
Lecture Description / Outline:
{desc_sample if desc_sample else metadata['title']}

Respond ONLY with valid JSON with this exact structure:
{{
  "summary": "Clear, in-depth academic summary and conceptual overview of the topics covered in this lecture (2-3 paragraphs)",
  "keyTakeaways": [
    "Key conceptual takeaway 1 with deep context",
    "Key conceptual takeaway 2 with deep context",
    "Key conceptual takeaway 3 with deep context",
    "Key conceptual takeaway 4 with deep context"
  ],
  "chapters": [
    {{ "time": "00:00", "title": "Lecture Premise & Foundation", "summary": "Introduction to core themes and historical or analytical background." }},
    {{ "time": "15:00", "title": "Central Discourse & Arguments", "summary": "In-depth examination of the primary subject matter." }},
    {{ "time": "45:00", "title": "Philosophical & Practical Implications", "summary": "Synthesis and critical conclusions." }}
  ],
  "quizQuestions": [
    {{
      "question": "A conceptual multiple-choice question testing understanding of the topic",
      "options": ["Correct Answer Option", "Plausible Distractor A", "Plausible Distractor B", "Plausible Distractor C"],
      "correctIndex": 0,
      "explanation": "Clear educational explanation of why this answer is correct."
    }},
    {{
      "question": "A second question analyzing a key argument or concept in the lecture",
      "options": ["Correct Answer Option", "Distractor A", "Distractor B", "Distractor C"],
      "correctIndex": 0,
      "explanation": "Clear explanation of the concept."
    }}
  ],
  "flashcards": [
    {{
      "front": "Core Concept / Term",
      "back": "Exhaustive definition and intellectual importance according to the lecture."
    }},
    {{
      "front": "Key Argument or Distinction",
      "back": "The distinction explained clearly with nuance."
    }}
  ]
}}
"""

        try:
            data = ai_service.generate_json(prompt)
            summary_text = data.get("summary", "Summary generated by LearnNova AI.")
            if not full_transcript:
                summary_text += "\n\n*(Note: Synthesized from lecture syllabus & curriculum because YouTube subtitles were restricted or disabled for this video).* "

            return YouTubeSummarizeResponse(
                id=str(uuid.uuid4()),
                youtubeId=video_id,
                title=metadata["title"],
                channel=metadata["channel"],
                duration=duration_str,
                url=f"https://www.youtube.com/watch?v={video_id}",
                summary=summary_text,
                keyTakeaways=data.get("keyTakeaways", ["Key takeaway synthesized by LearnNova AI."]),
                chapters=[ChapterItem(**c) for c in data.get("chapters", [])] if data.get("chapters") else [
                    ChapterItem(time="00:00", title="Lecture Overview", summary="Introduction and conceptual foundation.")
                ],
                quizQuestions=[QuizQuestionItem(id=i+1, **q) for i, q in enumerate(data.get("quizQuestions", []))],
                flashcards=[FlashcardItem(id=i+1, **f) for i, f in enumerate(data.get("flashcards", []))],
            )
        except Exception as e:
            logger.error(f"AI summarization error: {e}")

    # Fallback response if AI provider key is not yet configured on server
    if full_transcript:
        preview_text = full_transcript[:350] + "..." if len(full_transcript) > 350 else full_transcript
        summary_msg = f"Transcript extracted successfully ({len(full_transcript.split())} words).\n\n{preview_text}\n\nNote: Add your GROQ_API_KEY in backend/.env for automated AI summarization, quizzes, and flashcards."
        takeaways = [
            "Transcript successfully parsed from YouTube closed captions.",
            f"Total duration: {duration_str}.",
            "Configure GROQ_API_KEY in backend/.env for instant automated AI insights.",
        ]
    else:
        desc_preview = (metadata.get("description") or "")[:350] + "..."
        summary_msg = f"Video lecture loaded: '{metadata['title']}' by {metadata['channel']}.\n\n{desc_preview}\n\nNote: Subtitles were not available on YouTube for this video. Add your GROQ_API_KEY in backend/.env to enable automated AI syllabus & study card generation."
        takeaways = [
            f"Lecture topic: {metadata['title']}",
            f"Presented by: {metadata['channel']}",
            "Configure GROQ_API_KEY in backend/.env to unlock automated AI quizzes and notes.",
        ]

    return YouTubeSummarizeResponse(
        id=str(uuid.uuid4()),
        youtubeId=video_id,
        title=metadata["title"],
        channel=metadata["channel"],
        duration=duration_str,
        url=f"https://www.youtube.com/watch?v={video_id}",
        summary=summary_msg,
        keyTakeaways=takeaways,
        chapters=[
            ChapterItem(time="00:00", title="Lecture Introduction", summary="Initial premise and primary discussion."),
            ChapterItem(time="05:00", title="Core Discussion", summary="Main concepts and discussion points."),
        ],
        quizQuestions=[
            QuizQuestionItem(
                id=1,
                question=f"What is the main topic of '{metadata['title']}'?",
                options=[metadata['title'], "Random topic", "Not mentioned", "None of the above"],
                correctIndex=0,
                explanation="The video title indicates the core topic.",
            )
        ],
        flashcards=[
            FlashcardItem(id=1, front=metadata['title'], back=f"Video lecture by {metadata['channel']}.")
        ],
    )
