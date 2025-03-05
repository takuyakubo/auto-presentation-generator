import uvicorn
import logging
import sys
import os
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from typing import Optional
from dotenv import load_dotenv
import time

# サービスとスキーマのインポート
from app.services.presentation_service import generate_presentation_from_text, get_presentation_by_id, generate_powerpoint_file
from app.schemas.presentation import PresentationRequest, Presentation

# 環境変数の読み込み
load_dotenv()

# ロギング設定
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=getattr(logging, log_level),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="テキストからプレゼンテーション自動生成API",
    description="テキストからプレゼンテーション資料を自動生成するAPI",
    version="0.1.0"
)

# CORS設定を完全に許可
logger.info("CORSを完全に許可")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンを許可
    allow_credentials=True,
    allow_methods=["*"],  # すべてのメソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)

# リクエストログミドルウェア
@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = f"{time.time()}-{id(request)}"
    logger.info(f"Request [{request_id}] - {request.method} {request.url.path}")
    
    # リクエストボディのログ
    try:
        body = await request.body()
        if body:
            body_str = body.decode("utf-8")
            logger.debug(f"Request body [{request_id}]: {body_str[:1000]}{'...' if len(body_str) > 1000 else ''}")
            # ボディを再設定（FastAPIの制限により必要）
            request._body = body
    except Exception as e:
        logger.warning(f"Failed to log request body [{request_id}]: {str(e)}")
    
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(f"Response [{request_id}] - Status: {response.status_code} - Time: {process_time:.4f}s")
    return response

# 例外ハンドラ
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"},
    )

# APIヘルスチェック
@app.get("/api/health")
def health_check():
    logger.info("ヘルスチェックAPI呼び出し")
    return {"status": "OK", "message": "Server is running"}

# プレゼンテーション生成API
@app.post("/api/presentations/generate", response_model=Presentation)
async def create_presentation(request: PresentationRequest):
    logger.info(f"プレゼンテーション生成APIが呼び出されました。テキスト長: {len(request.text)}")
    logger.debug(f"生成オプション: {request.options}")
    
    try:
        presentation = await generate_presentation_from_text(request.text, request.options)
        logger.info(f"プレゼンテーション生成成功: ID={presentation.id}, スライド数={len(presentation.slides)}")
        return presentation
    except Exception as e:
        logger.error(f"プレゼンテーション生成エラー: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# プレゼンテーションの詳細取得API
@app.get("/api/presentations/{presentation_id}", response_model=Presentation)
def get_presentation(presentation_id: str):
    logger.info(f"プレゼンテーション詳細取得API呼び出し: ID={presentation_id}")
    presentation = get_presentation_by_id(presentation_id)
    if not presentation:
        logger.warning(f"プレゼンテーションが見つかりません: ID={presentation_id}")
        raise HTTPException(status_code=404, detail="プレゼンテーションが見つかりません")
    logger.debug(f"プレゼンテーション詳細: {presentation}")
    return presentation

# プレゼンテーションのダウンロードAPI
@app.get("/api/presentations/{presentation_id}/download")
async def download_presentation(presentation_id: str):
    logger.info(f"プレゼンテーションダウンロードAPI呼び出し: ID={presentation_id}")
    presentation = get_presentation_by_id(presentation_id)
    if not presentation:
        logger.warning(f"プレゼンテーションが見つかりません: ID={presentation_id}")
        raise HTTPException(status_code=404, detail="プレゼンテーションが見つかりません")
    
    try:
        # PowerPointファイルの生成
        logger.info(f"PowerPointファイル生成開始: ID={presentation_id}")
        file_path = await generate_powerpoint_file(presentation)
        logger.info(f"PowerPointファイル生成完了: {file_path}")
        
        # ファイルの送信
        response = FileResponse(
            path=file_path,
            filename=f"presentation-{presentation_id}.pptx",
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
        )
        
        # CORSヘッダーを追加
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        
        return response
    except Exception as e:
        logger.error(f"PowerPointファイル生成エラー: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"ファイル生成エラー: {str(e)}")

# オプション要求に対応（プリフライトリクエスト用）
@app.options("/api/presentations/generate")
async def options_generate():
    return {}

@app.options("/api/presentations/{presentation_id}")
async def options_get_presentation(presentation_id: str):
    return {}

@app.options("/api/presentations/{presentation_id}/download")
async def options_download_presentation(presentation_id: str):
    return {}

if __name__ == "__main__":
    logger.info("アプリケーション起動")
    uvicorn.run("main:app", host="0.0.0.0", port=3001, reload=True)
