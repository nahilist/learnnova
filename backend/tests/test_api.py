from fastapi.testclient import TestClient
from app.main import app

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
