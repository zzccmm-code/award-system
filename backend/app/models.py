from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, create_engine
from .database import Base


class Award(Base):
    __tablename__ = "awards"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_name = Column(String(500), nullable=False, comment="项目名称")
    award_year = Column(Integer, nullable=False, comment="获奖年度")
    award_type = Column(String(100), nullable=False, comment="奖励类型")
    award_level = Column(String(100), nullable=False, comment="奖励等级")
    completing_unit = Column(Text, nullable=False, comment="完成单位")
    completers = Column(Text, nullable=False, comment="完成人")
    source = Column(String(200), nullable=False, comment="信息来源")
    source_url = Column(String(500), nullable=True, comment="原始链接")
    raw_data = Column(Text, nullable=True, comment="原始数据")
    award_category = Column(String(50), default="", comment="奖励级别：国家级/省部级/行业级/国网公司级/省公司级")
    created_at = Column(DateTime, default=datetime.utcnow, comment="入库时间")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, comment="更新时间")
    is_power_related = Column(Integer, default=1, comment="是否电力相关：1是 0否")
    matched_keywords = Column(String(500), nullable=True, comment="匹配到的关键词")
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False, comment="用户名")
    hashed_password = Column(String(200), nullable=False, comment="密码哈希")
    display_name = Column(String(100), default="", comment="显示名称")
    is_active = Column(Integer, default=1, comment="是否启用")
    created_at = Column(DateTime, default=datetime.utcnow, comment="创建时间")
