import os
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
import tempfile

from openai import OpenAI
from pptx import Presentation as PPTXPresentation
from pptx.util import Inches, Pt

from app.schemas.presentation import Presentation, Slide, PresentationOptions

# OpenAIクライアントの初期化
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# メモリ内キャッシュ
# 実際のアプリケーションではデータベース等の永続化層を使用する
presentations_cache: Dict[str, Presentation] = {}


async def generate_presentation_from_text(
    text: str, 
    options: Optional[PresentationOptions] = None
) -> Presentation:
    """テキストからプレゼンテーションを生成する"""
    if options is None:
        options = PresentationOptions()
    
    try:
        # GPT-4を使用してテキストからスライド構造を生成
        response = await client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {
                    "role": "system",
                    "content": f"""あなたはプレゼンテーションのスペシャリストです。テキストから高品質なプレゼンテーションを作成します。
以下のテーマでスライドを作成してください: {options.theme}
スライド数の目安は約{options.slide_count}枚です。
各スライドにはタイトルとコンテンツのリストを含めてください。
結果はJSON形式で返してください。次の形式に従ってください:
{{
  "slides": [
    {{
      "title": "スライドタイトル",
      "content": ["コンテンツ項目1", "コンテンツ項目2"]
    }}
  ]
}}
"""
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            response_format={"type": "json_object"}
        )

        # APIレスポンスからスライドデータを取得
        response_content = response.choices[0].message.content
        if not response_content:
            raise ValueError("レスポンスの生成に失敗しました")

        # JSONパース
        parsed_response = json.loads(response_content)
        slides_data = parsed_response.get("slides", [])
        
        # Slideオブジェクトに変換
        slides = []
        for slide_data in slides_data:
            slide = Slide(
                title=slide_data["title"],
                content=slide_data["content"],
                image_url=slide_data.get("image_url")
            )
            slides.append(slide)

        # 画像生成と追加（実装予定）
        if options.include_images and os.getenv("OPENAI_API_KEY"):
            # TODO: DALL-Eや他の画像生成APIの実装
            pass

        # プレゼンテーションデータの生成
        presentation_id = str(uuid.uuid4())
        presentation = Presentation(
            id=presentation_id,
            slides=slides,
            theme=options.theme,
            created_at=datetime.now().isoformat(),
            download_url=f"/api/presentations/{presentation_id}/download"
        )

        # キャッシュに保存
        presentations_cache[presentation_id] = presentation

        return presentation

    except Exception as e:
        print(f"Error generating presentation: {str(e)}")
        raise ValueError(f"プレゼンテーションの生成中にエラーが発生しました: {str(e)}")


def get_presentation_by_id(presentation_id: str) -> Optional[Presentation]:
    """プレゼンテーションIDからプレゼンテーションデータを取得する"""
    return presentations_cache.get(presentation_id)


async def generate_powerpoint_file(presentation: Presentation) -> str:
    """プレゼンテーションをPowerPointファイルとして生成する"""
    try:
        # PowerPointファイルを作成
        pptx = PPTXPresentation()
        
        # テーマに基づいた設定
        theme_settings = get_theme_settings(presentation.theme)
        
        # 各スライドの生成
        for slide_data in presentation.slides:
            # スライドの追加
            slide_layout = pptx.slide_layouts[1]  # タイトルと内容のレイアウト
            slide = pptx.slides.add_slide(slide_layout)
            
            # タイトルの設定
            title_shape = slide.shapes.title
            if title_shape:
                title_shape.text = slide_data.title
            
            # コンテンツの設定
            content_shape = slide.placeholders[1]  # コンテンツのプレースホルダー
            text_frame = content_shape.text_frame
            
            # 各コンテンツ項目を一行ずつ追加
            for i, content_item in enumerate(slide_data.content):
                if i == 0:
                    p = text_frame.paragraphs[0]
                else:
                    p = text_frame.add_paragraph()
                p.text = content_item
                p.level = 0  # 箱条書きレベル
        
        # 一時ファイルに保存
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pptx")
        temp_file.close()
        pptx.save(temp_file.name)
        
        return temp_file.name
    
    except Exception as e:
        print(f"Error generating PowerPoint file: {str(e)}")
        raise ValueError(f"PowerPointファイルの生成中にエラーが発生しました: {str(e)}")


def get_theme_settings(theme: str) -> Dict[str, Any]:
    """テーマに基づいた設定を取得する"""
    themes = {
        "modern": {
            "primary_color": "0EA5E9",
            "secondary_color": "7DD3FC",
            "text_color": "374151",
            "title_font": "Arial",
            "content_font": "Arial",
        },
        "business": {
            "primary_color": "1E40AF",
            "secondary_color": "3B82F6",
            "text_color": "1F2937",
            "title_font": "Calibri",
            "content_font": "Calibri",
        },
        "creative": {
            "primary_color": "8B5CF6",
            "secondary_color": "C4B5FD",
            "text_color": "4B5563",
            "title_font": "Segoe UI",
            "content_font": "Segoe UI",
        },
        "minimal": {
            "primary_color": "64748B",
            "secondary_color": "94A3B8",
            "text_color": "334155",
            "title_font": "Helvetica",
            "content_font": "Helvetica",
        },
    }
    
    return themes.get(theme, themes["modern"])
