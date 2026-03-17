#!/usr/bin/env python
"""Update existing avatar URLs in database to use RunPod proxy URL"""

import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL","postgresql://postgres:KBQZgJVeRSilmYiGSbsjNzJBBRUxmVlh@hopper.proxy.rlwy.net:58682/railway")

# The old internal IP pattern and new proxy URL
OLD_PATTERN = "http://100.65.30.86:60489"
NEW_BASE_URL = "https://o96r2nvvu9d67u-8000.proxy.runpod.net"

def update_avatar_urls():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    with SessionLocal() as db:
        try:
            # Find all users with avatar URLs containing the old internal IP
            result = db.execute(text("SELECT id, avatar_url FROM users WHERE avatar_url LIKE :pattern"), {"pattern": f"{OLD_PATTERN}%"})
            users_to_update = result.fetchall()

            print(f"Found {len(users_to_update)} users with old avatar URLs")

            for user_id, old_url in users_to_update:
                # Replace the old base URL with the new one
                new_url = old_url.replace(OLD_PATTERN, NEW_BASE_URL)
                print(f"Updating user {user_id}: {old_url} -> {new_url}")

                # Update the database
                db.execute(text("UPDATE users SET avatar_url = :new_url WHERE id = :user_id"), {"new_url": new_url, "user_id": user_id})

            db.commit()
            print(f"Successfully updated {len(users_to_update)} avatar URLs")

        except Exception as e:
            print(f"Error updating avatar URLs: {e}")
            db.rollback()

if __name__ == "__main__":
    update_avatar_urls()