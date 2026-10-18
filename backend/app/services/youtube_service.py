import re
import logging
from typing import Dict, List, Optional, Tuple
from youtube_transcript_api import YouTubeTranscriptApi
import httpx

logger = logging.getLogger(__name__)


class YouTubeService:
    def __init__(self):
        self._api = YouTubeTranscriptApi()

    @staticmethod
    def extract_video_id(url_or_id: str) -> Optional[str]:
        clean_input = url_or_id.strip()
        if len(clean_input) == 11 and re.match(r"^[a-zA-Z0-9_-]{11}$", clean_input):
            return clean_input

        patterns = [
            r"(?:v=|\/v\/|youtu\.be\/|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})",
            r"[?&]v=([a-zA-Z0-9_-]{11})",
        ]
        for pattern in patterns:
            match = re.search(pattern, clean_input)
            if match:
                return match.group(1)
        return None

    @staticmethod
    async def get_video_metadata(video_id: str) -> Dict[str, str]:
        """Fetch title & author via YouTube's public oEmbed API without needing YouTube Data API key"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(
                    f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
                )
                if res.status_code == 200:
                    data = res.json()
                    return {
                        "title": data.get("title", f"YouTube Lecture ({video_id})"),
                        "channel": data.get("author_name", "YouTube Creator"),
                    }
        except Exception as e:
            logger.warning(f"Failed to fetch oEmbed metadata for {video_id}: {e}")

        return {
            "title": f"YouTube Video ({video_id})",
            "channel": "YouTube Education",
        }

    def get_transcript(self, video_id: str) -> Tuple[str, List[Dict[str, any]], float]:
        """
        Fetches transcript entries and returns:
        (full_text, entries_with_timestamps, total_duration_seconds)
        """
        transcript_snippets = None
        try:
            transcript_snippets = self._api.fetch(video_id, languages=["en", "en-US", "hi", "es"])
        except Exception:
            try:
                transcript_list = self._api.list(video_id)
                # Try finding any manual or auto-generated transcript
                transcript = None
                for t in transcript_list:
                    transcript = t
                    break
                if transcript:
                    transcript_snippets = transcript.fetch()
            except Exception as e:
                logger.error(f"Failed to get transcript for {video_id}: {e}")
                raise ValueError(
                    f"Could not retrieve transcripts for this video ({video_id}). "
                    "Please ensure the video has closed captions/subtitles enabled."
                )

        if not transcript_snippets:
            raise ValueError(f"No transcripts found for video {video_id}.")

        full_text_parts = []
        raw_entries = []
        total_duration = 0.0

        for snippet in transcript_snippets:
            text = getattr(snippet, "text", "") or ""
            start = getattr(snippet, "start", 0.0) or 0.0
            duration = getattr(snippet, "duration", 0.0) or 0.0
            total_duration = max(total_duration, start + duration)
            if text.strip():
                full_text_parts.append(text.strip())
                raw_entries.append({"text": text.strip(), "start": start, "duration": duration})

        full_text = " ".join(full_text_parts)
        return full_text, raw_entries, total_duration

    @staticmethod
    def format_duration(seconds: float) -> str:
        mins = int(seconds // 60)
        secs = int(seconds % 60)
        hrs = mins // 60
        mins = mins % 60
        if hrs > 0:
            return f"{hrs:02d}:{mins:02d}:{secs:02d}"
        return f"{mins:02d}:{secs:02d}"


youtube_service = YouTubeService()
