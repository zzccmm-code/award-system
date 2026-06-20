"""Seed the database with initial mock data."""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, init_db
from app.models import Award, User
from app.auth import hash_password
from datetime import datetime


seed_awards = [
    {"project_name": "\u7279\u9ad8\u538b\u8f93\u7535\u7ebf\u8def\u667a\u80fd\u5316\u8fd0\u7ef4\u5173\u952e\u6280\u672f\u53ca\u5e94\u7528", "award_year": 2024, "award_type": "\u79d1\u6280\u8fdb\u6b65\u5956", "award_level": "\u4e00\u7b49\u5956", "completing_unit": "\u56fd\u5bb6\u7535\u7f51\u6709\u9650\u516c\u53f8, \u4e2d\u56fd\u7535\u529b\u79d1\u5b66\u7814\u7a76\u9662", "completers": "\u5f20\u4e09, \u674e\u56db, \u738b\u4e94, \u8d75\u516d", "source": "\u56fd\u5bb6\u7535\u7f51\u79d1\u6280\u90e8", "source_url": "", "matched_keywords": "\u7535\u529b,\u56fd\u5bb6\u7535\u7f51,\u7279\u9ad8\u538b,\u8f93\u7535", "is_power_related": 1},
    {"project_name": "\u65b0\u578b\u7535\u529b\u7cfb\u7edf\u6e90\u7f51\u8377\u50a8\u534f\u8c03\u63a7\u5236\u6280\u672f", "award_year": 2024, "award_type": "\u6280\u672f\u53d1\u660e\u5956", "award_level": "\u4e00\u7b49\u5956", "completing_unit": "\u5357\u65b9\u7535\u7f51\u79d1\u5b66\u7814\u7a76\u9662, \u6e05\u534e\u5927\u5b66", "completers": "\u5218\u4e00, \u9648\u4e8c, \u5468\u4e09", "source": "\u5357\u65b9\u7535\u7f51\u516c\u53f8", "source_url": "", "matched_keywords": "\u7535\u529b,\u5357\u65b9\u7535\u7f51,\u7535\u529b\u7cfb\u7edf", "is_power_related": 1},
    {"project_name": "\u6d77\u4e0a\u98ce\u7535\u67d4\u6027\u76f4\u6d41\u8f93\u7535\u5173\u952e\u6280\u672f\u53ca\u5de5\u7a0b\u5e94\u7528", "award_year": 2023, "award_type": "\u79d1\u6280\u8fdb\u6b65\u5956", "award_level": "\u7279\u7b49\u5956", "completing_unit": "\u4e2d\u56fd\u534e\u80fd\u96c6\u56e2\u6709\u9650\u516c\u53f8, \u4e0a\u6d77\u4ea4\u901a\u5927\u5b66", "completers": "\u5b59\u4e03, \u5468\u516b, \u5434\u4e5d, \u90d1\u5341", "source": "\u4e2d\u56fd\u7535\u673a\u5de5\u7a0b\u5b66\u4f1a", "source_url": "", "matched_keywords": "\u98ce\u7535,\u76f4\u6d41\u8f93\u7535", "is_power_related": 1},
    {"project_name": "\u9ad8\u6bd4\u4f8b\u53ef\u518d\u751f\u80fd\u6e90\u7535\u529b\u7cfb\u7edf\u89c4\u5212\u4e0e\u8fd0\u884c\u5173\u952e\u6280\u672f", "award_year": 2023, "award_type": "\u81ea\u7136\u79d1\u5b66\u5956", "award_level": "\u4e8c\u7b49\u5956", "completing_unit": "\u6e05\u534e\u5927\u5b66, \u534e\u5317\u7535\u529b\u5927\u5b66", "completers": "\u94b1\u4e00, \u5b59\u4e8c, \u674e\u4e09", "source": "\u6559\u80b2\u90e8", "source_url": "", "matched_keywords": "\u7535\u529b,\u7535\u529b\u7cfb\u7edf,\u65b0\u80fd\u6e90", "is_power_related": 1},
    {"project_name": "\u7535\u529b\u7269\u8054\u7f51\u8fb9\u7f18\u667a\u80fd\u8ba1\u7b97\u5e73\u53f0\u7814\u53d1\u4e0e\u5e94\u7528", "award_year": 2024, "award_type": "\u79d1\u6280\u8fdb\u6b65\u5956", "award_level": "\u4e8c\u7b49\u5956", "completing_unit": "\u56fd\u7f51\u4fe1\u606f\u901a\u4fe1\u4ea7\u4e1a\u96c6\u56e2\u6709\u9650\u516c\u53f8", "completers": "\u6768\u56db, \u6731\u4e94, \u9a6c\u516d", "source": "\u56fd\u5bb6\u7535\u7f51\u79d1\u6280\u90e8", "source_url": "", "matched_keywords": "\u7535\u529b,\u7535\u529b\u7269\u8054\u7f51,\u56fd\u5bb6\u7535\u7f51", "is_power_related": 1},
    {"project_name": "\u5927\u578b\u62bd\u6c34\u84c4\u80fd\u7535\u7ad9\u673a\u7ec4\u5173\u952e\u6280\u672f\u53ca\u5de5\u7a0b\u5e94\u7528", "award_year": 2022, "award_type": "\u79d1\u6280\u8fdb\u6b65\u5956", "award_level": "\u4e00\u7b49\u5956", "completing_unit": "\u56fd\u7f51\u65b0\u6e90\u63a7\u80a1\u6709\u9650\u516c\u53f8, \u54c8\u5c14\u6ee8\u7535\u673a\u5382", "completers": "\u9ec4\u4e03, \u66f9\u516b, \u5468\u4e5d", "source": "\u4e2d\u56fd\u6c34\u529b\u53d1\u7535\u5de5\u7a0b\u5b66\u4f1a", "source_url": "", "matched_keywords": "\u53d1\u7535,\u50a8\u80fd,\u6c34\u7535", "is_power_related": 1},
    {"project_name": "\u914d\u7535\u7f51\u6545\u969c\u667a\u80fd\u8bca\u65ad\u4e0e\u81ea\u6108\u63a7\u5236\u6280\u672f", "award_year": 2023, "award_type": "\u6280\u672f\u53d1\u660e\u5956", "award_level": "\u4e8c\u7b49\u5956", "completing_unit": "\u897f\u5b89\u4ea4\u901a\u5927\u5b66, \u56fd\u7f51\u9655\u897f\u7701\u7535\u529b\u516c\u53f8", "completers": "\u6797\u4e00, \u90ed\u4e8c, \u4f55\u4e09", "source": "\u9655\u897f\u7701\u79d1\u6280\u5385", "source_url": "", "matched_keywords": "\u914d\u7535,\u7535\u7f51,\u56fd\u5bb6\u7535\u7f51", "is_power_related": 1},
    {"project_name": "\u00b1800kV\u7279\u9ad8\u538b\u76f4\u6d41\u8f93\u7535\u6362\u6d41\u9600\u5173\u952e\u6280\u672f", "award_year": 2022, "award_type": "\u79d1\u6280\u8fdb\u6b65\u5956", "award_level": "\u7279\u7b49\u5956", "completing_unit": "\u4e2d\u56fd\u7535\u529b\u79d1\u5b66\u7814\u7a76\u9662, \u8bb8\u7ee7\u96c6\u56e2\u6709\u9650\u516c\u53f8", "completers": "\u7f57\u56db, \u6881\u4e94, \u5b8b\u516d, \u5510\u4e03", "source": "\u4e2d\u56fd\u7535\u529b\u4f01\u4e1a\u8054\u5408\u4f1a", "source_url": "", "matched_keywords": "\u7279\u9ad8\u538b,\u76f4\u6d41\u8f93\u7535,\u7535\u529b", "is_power_related": 1},
    {"project_name": "\u7535\u529b\u5e02\u573a\u8fd0\u8425\u4e0e\u76d1\u7ba1\u5173\u952e\u6280\u672f\u7814\u7a76\u53ca\u5e94\u7528", "award_year": 2024, "award_type": "\u6807\u51c6\u521b\u65b0\u5956", "award_level": "\u4e00\u7b49\u5956", "completing_unit": "\u5317\u4eac\u7535\u529b\u4ea4\u6613\u4e2d\u5fc3, \u4e2d\u56fd\u7535\u529b\u79d1\u5b66\u7814\u7a76\u9662", "completers": "\u97e9\u516b, \u51af\u4e5d, \u891a\u5341", "source": "\u56fd\u5bb6\u80fd\u6e90\u5c40", "source_url": "", "matched_keywords": "\u7535\u529b,\u7535\u529b\u5e02\u573a,\u7535\u529b\u4ea4\u6613", "is_power_related": 1},
    {"project_name": "\u7279\u9ad8\u538b\u53d8\u538b\u5668\u7edd\u7f18\u7ed3\u6784\u4e0e\u5236\u9020\u5de5\u827a\u521b\u65b0", "award_year": 2021, "award_type": "\u4e13\u5229\u5956", "award_level": "\u91d1\u5956", "completing_unit": "\u7279\u53d8\u7535\u5de5\u80a1\u4efd\u6709\u9650\u516c\u53f8, \u897f\u5b89\u897f\u7535\u53d8\u538b\u5668\u516c\u53f8", "completers": "\u536b\u4e00, \u848b\u4e8c, \u6c88\u4e09", "source": "\u56fd\u5bb6\u77e5\u8bc6\u4ea7\u6743\u5c40", "source_url": "", "matched_keywords": "\u7279\u9ad8\u538b,\u7535\u529b,\u7535\u529b\u53d8\u538b\u5668", "is_power_related": 1},
    {"project_name": "\u7efc\u5408\u80fd\u6e90\u7cfb\u7edf\u591a\u80fd\u4e92\u8865\u4f18\u5316\u8c03\u5ea6\u6280\u672f", "award_year": 2022, "award_type": "\u79d1\u6280\u8fdb\u6b65\u5956", "award_level": "\u4e8c\u7b49\u5956", "completing_unit": "\u5929\u6d25\u5927\u5b66, \u56fd\u7f51\u5929\u6d25\u5e02\u7535\u529b\u516c\u53f8", "completers": "\u9b4f\u56db, \u695a\u4e94, \u8c22\u516d", "source": "\u5929\u6d25\u5e02\u79d1\u6280\u5c40", "source_url": "", "matched_keywords": "\u7535\u529b,\u65b0\u80fd\u6e90", "is_power_related": 1},
    {"project_name": "\u57fa\u4e8e\u4eba\u5de5\u667a\u80fd\u7684\u7535\u529b\u8bbe\u5907\u72b6\u6001\u8bc4\u4f30\u4e0e\u9884\u6d4b\u6280\u672f", "award_year": 2024, "award_type": "\u79d1\u6280\u8fdb\u6b65\u5956", "award_level": "\u4e00\u7b49\u5956", "completing_unit": "\u4e2d\u56fd\u7535\u529b\u79d1\u5b66\u7814\u7a76\u9662, \u534e\u4e3a\u6280\u672f\u6709\u9650\u516c\u53f8", "completers": "\u5f6d\u4e03, \u8463\u516b, \u82cf\u4e5d", "source": "\u56fd\u5bb6\u7535\u7f51\u79d1\u6280\u90e8", "source_url": "", "matched_keywords": "\u7535\u529b,\u56fd\u5bb6\u7535\u7f51,\u7535\u529b\u88c5\u5907", "is_power_related": 1},
]

def seed():
    init_db()
    db = SessionLocal()

    # Create default admin user if not exists
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin = User(
            username="admin",
            hashed_password=hash_password("admin123"),
            display_name="系统管理员",
            is_active=1,
        )
        db.add(admin)
        db.commit()
        print("Created admin user (admin / admin123)")
    else:
        print("Admin user already exists")
    for item in seed_awards:
        existing = db.query(Award).filter(
            Award.project_name == item["project_name"],
            Award.award_year == item["award_year"],
            Award.source == item["source"]
        ).first()
        if not existing:
            award = Award(**item)
            db.add(award)
    db.commit()
    print(f"Seeded {len(seed_awards)} records")
    db.close()

if __name__ == "__main__":
    seed()
