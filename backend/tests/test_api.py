import time
import hmac
import hashlib
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.services.document_service import document_service

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "version" in data


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["docs"] == "/docs"


def test_chat_fallback():
    response = client.post("/api/chat/ask", json={"message": "Hello"})
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "citations" in data
    assert "grounded" in data


def test_flashcards_generation():
    response = client.post(
        "/api/study/flashcards",
        json={"content": "Mitochondria is the powerhouse of the cell.", "count": 2},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["flashcards"]) > 0


def test_quiz_generation():
    response = client.post(
        "/api/study/quiz",
        json={"content": "DNA is composed of four nucleotide bases: A, T, C, and G.", "count": 1},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["questions"]) > 0


def test_quiz_server_grading():
    # 1. Generate quiz
    gen_res = client.post(
        "/api/study/quiz",
        json={"content": "Photosynthesis converts carbon dioxide and water into glucose and oxygen.", "count": 1, "documentId": "test-doc-1"},
    )
    assert gen_res.status_code == 200
    q = gen_res.json()["questions"][0]

    # 2. Submit correct answer
    submit_res = client.post(
        "/api/study/quiz/submit",
        json={
            "documentId": "test-doc-1",
            "answers": {str(q["id"]): q["correctIndex"]},
            "questions": [q],
        },
    )
    assert submit_res.status_code == 200
    result = submit_res.json()
    assert result["score"] == 1
    assert result["percentage"] == 100.0
    assert result["passed"] is True
    assert result["results"][0]["isCorrect"] is True

    # 3. Submit wrong answer
    wrong_ans = (q["correctIndex"] + 1) % 4
    submit_wrong = client.post(
        "/api/study/quiz/submit",
        json={
            "documentId": "test-doc-1",
            "answers": {str(q["id"]): wrong_ans},
            "questions": [q],
        },
    )
    assert submit_wrong.status_code == 200
    assert submit_wrong.json()["score"] == 0
    assert submit_wrong.json()["results"][0]["isCorrect"] is False


def test_document_chunks_and_scoped_retrieval():
    pages = [
        {"page_number": 1, "text": "Ribosomes synthesize proteins by translating messenger RNA sequences into amino acid polypeptide chains."},
        {"page_number": 2, "text": "The Krebs cycle occurs in the mitochondrial matrix and generates electron carriers NADH and FADH2."},
    ]
    chunks = document_service.create_chunks(pages, target_chunk_chars=500)
    assert len(chunks) == 2
    assert chunks[0]["page_number"] == 1
    assert chunks[1]["page_number"] == 2

    retrieved = document_service.retrieve_relevant_chunks("ribosomes and protein synthesis", chunks, top_k=1)
    assert len(retrieved) == 1
    assert retrieved[0]["page_number"] == 1


def test_hmac_authentication_verification():
    user_id = "test-student-123"
    timestamp = int(time.time())
    secret = settings.BACKEND_SECRET.encode("utf-8")
    payload = f"{user_id}:{timestamp}".encode("utf-8")
    signature = hmac.new(secret, payload, hashlib.sha256).hexdigest()

    headers = {
        "X-User-Id": user_id,
        "X-Timestamp": str(timestamp),
        "X-Signature": signature,
    }

    res = client.post("/api/chat/ask", json={"message": "What is mitochondria?"}, headers=headers)
    assert res.status_code == 200

    # Bad signature
    bad_headers = {
        "X-User-Id": user_id,
        "X-Timestamp": str(timestamp),
        "X-Signature": "invalid-hex-signature-12345",
    }
    bad_res = client.post("/api/chat/ask", json={"message": "test"}, headers=bad_headers)
    assert bad_res.status_code == 401
