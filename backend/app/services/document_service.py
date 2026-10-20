import io
import re
import logging
from typing import List, Dict, Any, Tuple
from pypdf import PdfReader

logger = logging.getLogger(__name__)

MAX_ALLOWED_PAGES = 100
MAX_EXTRACTED_CHARS = 250_000


class DocumentService:
    @staticmethod
    def extract_text_from_pdf(file_bytes: bytes) -> Tuple[str, int, int, List[Dict[str, Any]]]:
        """
        Extracts plain text and structured page chunks from raw PDF file bytes.
        Returns: (full_text, page_count, character_count, pages_data)
        """
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
        except Exception as e:
            logger.error(f"Corrupt or unreadable PDF: {e}")
            raise ValueError("The uploaded file is not a valid or readable PDF document.")

        if reader.is_encrypted:
            raise ValueError("This PDF is password-protected or encrypted. Please remove the password before uploading.")

        page_count = len(reader.pages)
        if page_count == 0:
            raise ValueError("The PDF document is completely empty.")

        if page_count > MAX_ALLOWED_PAGES:
            raise ValueError(f"Document exceeds the {MAX_ALLOWED_PAGES}-page limit ({page_count} pages found).")

        pages_data: List[Dict[str, Any]] = []
        full_text_parts: List[str] = []
        total_chars = 0

        for i, page in enumerate(reader.pages):
            page_num = i + 1
            try:
                page_text = page.extract_text() or ""
            except Exception as e:
                logger.warning(f"Failed extracting text on page {page_num}: {e}")
                page_text = ""

            clean_text = page_text.strip()
            total_chars += len(clean_text)

            if clean_text:
                full_text_parts.append(f"--- Page {page_num} ---\n{clean_text}")
                pages_data.append({
                    "page_number": page_num,
                    "text": clean_text
                })

        full_text = "\n\n".join(full_text_parts)

        # Detect scanned PDFs (pages exist but virtually zero machine-readable text)
        if total_chars < 50:
            raise ValueError(
                "No machine-readable text was detected in this PDF. It appears to consist of scanned images or rasterized pages, which requires OCR processing."
            )

        return full_text, page_count, total_chars, pages_data

    @staticmethod
    def extract_text_from_raw(text_bytes: bytes, filename: str) -> Tuple[str, int, int, List[Dict[str, Any]]]:
        """
        Extracts text from UTF-8/plain text or markdown files.
        """
        try:
            text = text_bytes.decode("utf-8", errors="replace").strip()
        except Exception as e:
            raise ValueError(f"Could not read text file: {e}")

        if not text:
            raise ValueError("The uploaded text file is empty.")

        # Estimate pages based on ~2000 characters per standard page
        char_count = len(text)
        est_pages = max(1, (char_count + 1999) // 2000)

        # Split into paragraph blocks
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        pages_data: List[Dict[str, Any]] = []
        
        current_page = 1
        current_page_text: List[str] = []
        current_len = 0

        for para in paragraphs:
            current_page_text.append(para)
            current_len += len(para)
            if current_len >= 2000:
                pages_data.append({
                    "page_number": current_page,
                    "text": "\n\n".join(current_page_text)
                })
                current_page += 1
                current_page_text = []
                current_len = 0

        if current_page_text:
            pages_data.append({
                "page_number": current_page,
                "text": "\n\n".join(current_page_text)
            })

        return text, len(pages_data), char_count, pages_data

    @staticmethod
    def create_chunks(pages_data: List[Dict[str, Any]], target_chunk_chars: int = 800, overlap_chars: int = 150) -> List[Dict[str, Any]]:
        """
        Splits page text into discrete overlapping chunks annotated with exact page metadata.
        """
        chunks: List[Dict[str, Any]] = []
        chunk_idx = 0

        for page in pages_data:
            page_num = page["page_number"]
            text = page["text"]

            if len(text) <= target_chunk_chars:
                chunks.append({
                    "page_number": page_num,
                    "chunk_index": chunk_idx,
                    "content": text,
                    "token_count": len(text.split())
                })
                chunk_idx += 1
            else:
                # Sliding window chunking
                start = 0
                while start < len(text):
                    end = start + target_chunk_chars
                    chunk_slice = text[start:end]

                    # Break at closest sentence or word boundary if possible
                    if end < len(text):
                        last_period = chunk_slice.rfind(". ")
                        if last_period > target_chunk_chars // 2:
                            end = start + last_period + 1
                            chunk_slice = text[start:end]

                    clean_slice = chunk_slice.strip()
                    if clean_slice:
                        chunks.append({
                            "page_number": page_num,
                            "chunk_index": chunk_idx,
                            "content": clean_slice,
                            "token_count": len(clean_slice.split())
                        })
                        chunk_idx += 1

                    start = end - overlap_chars
                    if start >= len(text) - overlap_chars:
                        break

        return chunks

    @staticmethod
    def retrieve_relevant_chunks(query: str, chunks: List[Dict[str, Any]], top_k: int = 4) -> List[Dict[str, Any]]:
        """
        Scores and retrieves the top-k most relevant chunks for a question.
        Uses BM25-style term-frequency with bonus for exact phrase matching.
        """
        if not chunks:
            return []

        words = [w.lower() for w in re.findall(r"\w+", query) if len(w) > 2]
        if not words:
            return chunks[:top_k]

        scored_chunks = []
        lower_query = query.lower()

        for chunk in chunks:
            content = chunk.get("content", "")
            lower_content = content.lower()
            score = 0.0

            # 1. Exact phrase bonus
            if lower_query in lower_content:
                score += 5.0

            # 2. Term frequency matching
            for word in words:
                count = lower_content.count(word)
                if count > 0:
                    score += 1.0 + (count * 0.2)

            if score > 0:
                scored_chunks.append((score, chunk))

        # Sort descending by score
        scored_chunks.sort(key=lambda x: x[0], reverse=True)

        if scored_chunks:
            return [item[1] for item in scored_chunks[:top_k]]
        
        # Fallback to first few chunks if no lexical matches
        return chunks[:top_k]


document_service = DocumentService()
