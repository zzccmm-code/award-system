from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class AwardBase(BaseModel):
    project_name: str
    award_year: int
    award_type: str
    award_level: str
    completing_unit: str
    completers: str
    award_category: Optional[str] = ""
    source: str
    source_url: Optional[str] = None


class AwardCreate(AwardBase):
    pass


class AwardOut(AwardBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AwardSearchParams(BaseModel):
    keyword: Optional[str] = None
    award_year: Optional[int] = None
    award_type: Optional[str] = None
    page: int = 1
    page_size: int = 10


class AwardListResponse(BaseModel):
    total: int
    items: list[AwardOut]
    page: int
    page_size: int
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    display_name: str


class UserInfo(BaseModel):
    username: str
    display_name: str
