from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr
from sqlalchemy import Boolean

# this file will have admin create admin login and authentication schemas
# class InstitutionRegistrationSchema(BaseModel):
#     inst_name: str
#     inst_address: Optional[str]
#     master_admin_name: str
#     inst_email: str
#     inst_phone: str
#     inst_password: str
#     admin_username: str

class AdminLoginSchema(BaseModel):
    inst_code: str
    admin_username: str
    admin_password: str

class AdminCreateSchema(BaseModel):
    admin_name: str
    admin_email: str
    admin_phone: str
    admin_password: str
    admin_username: str

class Admin(AdminCreateSchema):
    admin_id: int
#
# class StudentCreateSchema(BaseModel):
#     reg_no: str
#     s_name: str
#     s_email: str
#     s_phone: str
#     c_name: str

# class ClassCreateSchema(BaseModel):
#     class_name: str

# class AttendanceCreateSchema(BaseModel):
#     s_id: int
#     c_id: int
#     sub_id: int
#     date: datetime
#     status: Boolean
#     taken_by_admin_id: int

class TokenSchema(BaseModel):
    #if login successful
    access_token: str
    token_type: str = "bearer"

# Schema for token data payload (used internally by JWT)
class TokenData(BaseModel):
    user_id: int | None = None
    role: str


# class InstitutionResponse(BaseModel):
#     """
#     Schema for the response after a successful institution registration.
#     Crucial for sending the generated inst_code back to the user.
#     """
#     inst_id: int
#     inst_code: str
#     inst_name: str
#     inst_email: EmailStr
#
#     # Required for Pydantic to read attributes from SQLAlchemy objects
#     class Config:
#         from_attributes = True