from datetime import datetime
from typing import Optional

import field
from pydantic import BaseModel, EmailStr
from sqlalchemy import Boolean

class StudentCreateSchema(BaseModel):
    reg_no: str
    s_name: str
    s_email: str
    s_phone: str
    c_id: str


class Student(StudentCreateSchema):
    """Schema for reading/responding with Student data (output)."""
    id: int
    institution_id: int

    # When sending data out, we exclude the password, but keep the Base field structure
    s_password: str = field(..., alias="s_password", exclude=True)

    class Config:
        from_attributes = True
        populate_by_name = True

class ClassCreateSchema(BaseModel):
    class_name: str

class Class(ClassCreateSchema):
    """Schema for reading/responding with Class data (output)."""
    c_id: int
    inst_id: int

    class Config:
        from_attributes = True
        populate_by_name = True