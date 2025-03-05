import pytest
from fastapi.testclient import TestClient
import json
from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "OK"


# プレゼンテーション生成APIのモックテスト
def test_generate_presentation(monkeypatch):
    # 実際のOpenAI呼び出しをモック化
    from app.services.presentation_service import generate_presentation_from_text
    
    async def mock_generate(*args, **kwargs):
        from app.schemas.presentation import Presentation, Slide
        import uuid
        from datetime import datetime
        
        presentation_id = str(uuid.uuid4())
        return Presentation(
            id=presentation_id,
            slides=[
                Slide(
                    title="テストスライド",
                    content=["テストコンテンツ1", "テストコンテンツ2"]
                )
            ],
            theme="modern",
            created_at=datetime.now().isoformat(),
            download_url=f"/api/presentations/{presentation_id}/download"
        )
    
    # モック関数を使用
    monkeypatch.setattr("app.services.presentation_service.generate_presentation_from_text", mock_generate)
    
    response = client.post(
        "/api/presentations/generate",
        json={
            "text": "テストテキスト",
            "options": {
                "theme": "modern",
                "slide_count": 5,
                "include_images": False
            }
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "slides" in data
    assert len(data["slides"]) > 0
    assert data["slides"][0]["title"] == "テストスライド"


def test_generate_presentation_missing_text():
    response = client.post(
        "/api/presentations/generate",
        json={
            "text": "",
            "options": {
                "theme": "modern",
                "slide_count": 5
            }
        }
    )
    
    assert response.status_code == 400
