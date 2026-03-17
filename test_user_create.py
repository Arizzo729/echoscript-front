from app.db import get_db
from app.models import User
from app.utils.auth_utils import hash_password

db = next(get_db())
try:
    user = User(
        email='test@example.com',
        password=hash_password('password123'),
        username='testuser'
    )
    db.add(user)
    db.commit()
    print('User created successfully')
except Exception as e:
    print(f'Error: {e}')
    db.rollback()