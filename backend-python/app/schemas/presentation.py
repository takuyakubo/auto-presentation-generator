from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class Slide(BaseModel):
    title: str
    content: List[str]
    image_url: Optional[str] = None

class PresentationOptions(BaseModel):
    theme: Optional[str] = "modern"
    slide_count: Optional[int] = 10
    include_images: Optional[bool] = True

class PresentationRequest(BaseModel):
    text: str
    options: Optional[PresentationOptions] = Field(default_factory=PresentationOptions)

class Presentation(BaseModel):
    id: str
    slides: List[Slide]
    theme: str
    created_at: str
    download_url: str
