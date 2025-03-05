import pytest
import uuid
from datetime import datetime
from app.schemas.presentation import PresentationOptions, Presentation, Slide
from app.services.presentation_service import get_theme_settings


def test_get_theme_settings():
    # デフォルトテーマ
    modern_theme = get_theme_settings("modern")
    assert modern_theme["primary_color"] == "0EA5E9"
    assert modern_theme["title_font"] == "Arial"
    
    # 存在しないテーマはデフォルトにフォールバック
    unknown_theme = get_theme_settings("unknown_theme")
    assert unknown_theme == modern_theme
    
    # 他のテーマ
    business_theme = get_theme_settings("business")
    assert business_theme["primary_color"] == "1E40AF"
    assert business_theme["title_font"] == "Calibri"
