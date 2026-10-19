import re
import json
import logging
from typing import Any, Dict, List, Optional, Tuple
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    IpBlocked,
    RequestBlocked,
    PoTokenRequired,
    AgeRestricted,
    VideoUnavailable,
    YouTubeTranscriptApiException,
)
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
    async def get_video_metadata(video_id: str) -> Dict[str, Any]:
        """
        Fetch rich title, channel, description, and duration.
        Attempts YouTube public page first, with fallback to public oEmbed.
        """
        title = f"YouTube Lecture ({video_id})"
        channel = "YouTube Creator"
        description = ""
        duration_sec = 0.0

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
        }

        try:
            async with httpx.AsyncClient(timeout=8.0, headers=headers, follow_redirects=True) as client:
                # 1. Fetch public watch page to parse ytInitialPlayerResponse
                res = await client.get(f"https://www.youtube.com/watch?v={video_id}")
                if res.status_code == 200:
                    match = re.search(r"ytInitialPlayerResponse\s*=\s*({.+?});", res.text)
                    if match:
                        try:
                            data = json.loads(match.group(1))
                            vd = data.get("videoDetails", {})
                            if vd.get("title"):
                                title = vd.get("title")
                            if vd.get("author"):
                                channel = vd.get("author")
                            if vd.get("shortDescription"):
                                description = vd.get("shortDescription")
                            if vd.get("lengthSeconds"):
                                duration_sec = float(vd.get("lengthSeconds"))
                        except Exception as json_err:
                            logger.debug(f"ytInitialPlayerResponse JSON parse notice: {json_err}")

                # 2. Fallback to oEmbed if title is still default
                if title.startswith("YouTube Lecture ("):
                    oembed_res = await client.get(
                        f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
                    )
                    if oembed_res.status_code == 200:
                        data = oembed_res.json()
                        title = data.get("title", title)
                        channel = data.get("author_name", channel)
        except Exception as e:
            logger.warning(f"Failed to fetch metadata for {video_id}: {e}")

        return {
            "title": title,
            "channel": channel,
            "description": description,
            "duration_sec": duration_sec,
        }

    def get_transcript(self, video_id: str) -> Tuple[Optional[str], List[Dict[str, Any]], float]:
        """
        Attempts to fetch transcript entries.
        Returns: (full_text_or_none, raw_entries, total_duration_seconds)
        Does not crash on unavailable or restricted transcripts.
        """
        preferred_languages = [
            "en", "en-US", "en-GB", "hi", "es", "fr", "de", "pt", "ru", "ja", "ko", "it"
        ]
        transcript_snippets = None

        # Attempt 1: Fetch via transcript list with language preference
        try:
            transcript_list = self._api.list(video_id)
            # Try manual first
            try:
                transcript = transcript_list.find_manually_created_transcript(preferred_languages)
                transcript_snippets = transcript.fetch()
            except Exception:
                # Try auto-generated
                try:
                    transcript = transcript_list.find_generated_transcript(preferred_languages)
                    transcript_snippets = transcript.fetch()
                except Exception:
                    # Try any available transcript
                    for t in transcript_list:
                        try:
                            transcript_snippets = t.fetch()
                            if transcript_snippets:
                                break
                        except Exception:
                            continue
        except (TranscriptsDisabled, NoTranscriptFound) as e:
            logger.info(f"No transcripts found for video {video_id}: {e}")
        except (IpBlocked, RequestBlocked, PoTokenRequired) as e:
            logger.warning(f"YouTube anti-bot/PoToken restriction for video {video_id}: {e}")
        except Exception as e:
            logger.warning(f"Transcript list fetch warning for video {video_id}: {type(e).__name__} - {e}")

        # Attempt 2: Direct fetch fallback
        if not transcript_snippets:
            try:
                transcript_snippets = self._api.fetch(video_id, languages=preferred_languages)
            except Exception as e:
                logger.debug(f"Direct fetch fallback also bypassed for {video_id}: {e}")

        # If no transcript could be retrieved, return None gracefully
        if not transcript_snippets:
            return None, [], 0.0

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
        return (full_text if full_text.strip() else None), raw_entries, total_duration

    @staticmethod
    def format_duration(seconds: float) -> str:
        if seconds <= 0:
            return "Lecture"
        mins = int(seconds // 60)
        secs = int(seconds % 60)
        hrs = mins // 60
        mins = mins % 60
        if hrs > 0:
            return f"{hrs:02d}:{mins:02d}:{secs:02d}"
        return f"{mins:02d}:{secs:02d}"


youtube_service = YouTubeService()
