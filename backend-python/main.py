import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import Optional
from dotenv import load_dotenv
import os

# サービスとスキーマのインポート
from app.services.presentation_service import generate_presentation_from_text, get_presentation_by_id, generate_powerpoint_file
from app.schemas.presentation import PresentationRequest, Presentation

# 環境変数の読み込み
load_dotenv()

app = FastAPI(
    title="テキストからプレゼンテーション自動生成API",
    description="テキストからプレゼンテーション資料を自動生成するAPI",
    version="0.1.0"
)

# CORS設定
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# APIヘルスチェック
@app.get("/api/health")
def health_check():
    return {"status": "OK", "message": "Server is running"}

# プレゼンテーション生成API
@app.post("/api/presentations/generate", response_model=Presentation)
async def create_presentation(request: PresentationRequest):
    try:
        presentation = await generate_presentation_from_text(request.text, request.options)
        return presentation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# プレゼンテーションの詳細取得API
@app.get("/api/presentations/{presentation_id}", response_model=Presentation)
def get_presentation(presentation_id: str):
    presentation = get_presentation_by_id(presentation_id)
    if not presentation:
        raise HTTPException(status_code=404, detail="プレゼンテーションが見つかりません")
    return presentation

# プレゼンテーションのダウンロードAPI
@app.get("/api/presentations/{presentation_id}/download")
async def download_presentation(presentation_id: str):
    presentation = get_presentation_by_id(presentation_id)
    if not presentation:
        raise HTTPException(status_code=404, detail="プレゼンテーションが見つかりません")
    
    # PowerPointファイルの生成
    file_path = await generate_powerpoint_file(presentation)
    
    # ファイルの送信
    return FileResponse(
        path=file_path,
        filename=f"presentation-{presentation_id}.pptx",
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3001, reload=True)
