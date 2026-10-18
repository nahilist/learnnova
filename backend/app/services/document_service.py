import io
import logging
from typing import Dict, Tuple
from pypdf import PdfReader

logger = logging.getLogger(__name__)


class DocumentService:
    @staticmethod
    def extract_text_from_pdf(file_bytes: bytes) -> Tuple[str, int, int]:
        """
        Extracts plain text from raw PDF file bytes.
        Returns: (full_text, page_count, character_count)
        """
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            page_count = len(reader.pages)
            extracted_pages = []

            for i, page in enumerate(reader.pages):
                page_text = page.extract_text() or ""
                clean_text = page_text.strip()
                if clean_text:
                    extracted_pages.append(f"--- Page {i+1} ---\n{clean_text}")

            full_text = "\n\n".join(extracted_pages)
            return full_text, page_count, len(full_text)
        except Exception as e:
            logger.error(f"PDF extraction error: {e}")
            raise ValueError(f"Could not read PDF file: {str(e)}")


document_service = DocumentService()
