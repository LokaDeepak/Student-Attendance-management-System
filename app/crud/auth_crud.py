from typing import Any

import bcrypt
from sqlalchemy.orm import Session
from sqlalchemy import or_
from .models import Institution, Admin

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        return False
# Assuming your schemas are defined in app/schemas/auth.py or similar
# from app.schemas.auth import AdminLoginSchema


# --- Core Login CRUD Function ---

def get_admin_by_credentials(db: Session, inst_code: str, admin_identifier: str, password: str) -> type[Admin] | None:
    """
    retrieve an admin by its credentials

    Args:
        inst_id: The institution's unique code (P8).
        admin_identifier: The Admin ID or Email provided by the user (P8).
        password: The plaintext password provided by the user
    """

    # 1. Retrieve the Institution by code
    institution = db.query(Institution).filter(Institution.inst_code == inst_code).first()

    if not institution:
        # Institution code is invalid
        return None

    # 2. Retrieve the Admin based on the identifier AND institution ID
    # This query checks against admin_email OR a unique admin ID string (admin_id_str)
    # The identifier field on the login form (P8) could be either one.
    admin = db.query(Admin).filter(
        Admin.inst_code == institution.inst_code,
        or_(
            Admin.admin_email == admin_identifier
        )
    ).first()

    if not admin:
        # if admin id does not map with inst id
        return None

    if verify_password(password, admin.admin_password):
        # Authentication successful
        return admin
    return None
