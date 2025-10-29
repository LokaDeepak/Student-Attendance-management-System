from pydantic import BaseModel
from datetime import date
from typing import Literal

from sqlalchemy import Boolean


# --- Subject Schemas ---

class SubjectBase(BaseModel):
    """Base fields for a Subject."""
    sub_name: str
    sub_id: str  # e.g., "CS-301"


class SubjectCreate(SubjectBase):
    """Schema for adding a new Subject (input)."""
    pass


class Subject(SubjectBase):
    """Schema for reading/responding with Subject data (output)."""
    sub_id: int
    inst_id: int

    class Config:
        orm_mode = True
        #form_attributes = True


# --- Attendance Schemas ---

class AttendanceCreateSchema(BaseModel):
    """Schema for recording a single attendance entry (input)."""
    s_id: int
    class_id: int
    sub_id: int
    date: date = date.today()  # Default to today if not provided in the request
    # Use Literal for strict validation on status values
    status: Boolean


class AttendanceRecord(AttendanceCreateSchema):
    """Schema for reading/responding with an attendance record (output)."""
    s_id: int
    taken_by_admin_id: int

    class Config:
        orm_mode = True
       # form_attributes = True