from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from typing import List, Optional, Any

from app.api import master_admin
from app.crud import models
from app.crud.models import Classes, Student, Attendance, Announcement
from .master_admin_crud import create_class
from .report_crud import *
from app.schemas.student import StudentCreateSchema, ClassCreateSchema
from app.schemas.attendance import AttendanceCreateSchema
# Assuming models are in a parent directory for SQLAlchemy ORM models

#add class by admin
def add_class(db: Session, inst_id: int, class_name: str) -> Classes:
    create_class(db, inst_id, class_name)

#for select class combo box
def get_all_classes(db: Session, inst_id: int) -> List[Classes]:
    return db.query(Classes).filter(Classes.inst_id == inst_id).all()

def get_class_by_id(db: Session, class_id: int) -> Optional[models.Class]:
    """Fetches a class by its ID."""
    return db.query(models.Class).filter(models.Class.id == class_id).first()

def create_student(db: Session, inst_id: str, student_data: 'StudentCreateSchema') -> Student:
    student_exists = db.query(Student).filter(
        Student.inst_id == student_data.inst_id,
        Student.reg_no == student_data.reg_no
    ).first()

    if student_exists:
        raise ValueError("Student already exists for this institution.")

    db_student = Student(
        inst_id=inst_id,
        reg_no = student_data.reg_no,
        s_name=student_data.s_name,
        s_email=student_data.s_email,
        s_phone=student_data.s_phone,
        c_id = student_data.c_id
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

#to remove student by id
def delete_student_by_id(db: Session, reg_no: str, inst_id: int) -> bool:
    """Deletes an Admin belonging to the specified institution."""

    student = db.query(Student).filter(
        Student.inst_id == inst_id,
        Student.reg_no == reg_no
    ).first()

    if student:
        db.delete(student)
        db.commit()
        return True

    return False


def get_students_for_attendance(db: Session, c_id: int, inst_id: int) -> List[models.Student]:
    """
    Retrieves all students in a specific class for attendance marking.
    This provides the list needed for the admin to mark Present/Absent.
    """
    return db.query(Student).filter(
        Student.c_id == c_id,
        Student.inst_id == inst_id
    ).order_by(Student.reg_no).all()


def record_attendance(db: Session, attendance_data: AttendanceCreateSchema, admin_id: int) -> Attendance:
    """
    Records a single attendance entry for a student/subject/date.
    NOTE: A separate function would ideally handle bulk creation/updates, but this handles a single record.
    """
    db_attendance = Attendance(
        s_id=attendance_data.s_id,
        c_id=attendance_data.c_id,
        sub_id=attendance_data.sub_id,
        date=attendance_data.date,  # Date should be supplied by frontend or defaulted
        status=attendance_data.status,
        taken_by_admin_id=admin_id
    )
    # Check for existing record to prevent duplicates (optional, but good practice)
    # existing = db.query(models.AttendanceRecord).filter(
    #     models.AttendanceRecord.student_id == attendance_data.student_id,
    #     models.AttendanceRecord.subject_id == attendance_data.subject_id,
    #     models.AttendanceRecord.date == attendance_data.date
    # ).first()
    #
    # if existing:
    #     existing.status = attendance_data.status
    #     db.commit()
    #     db.refresh(existing)
    #     return existing

    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def view_announcements(db: Session, inst_id: int) -> list[type[Announcement]]:
    #Fetches all announcements posted by the Master Admin for the current institution.
    return db.query(Announcement).filter(
        Announcement.inst_id == inst_id,
        Announcement.expiry_date >= date.today()
    ).order_by(Announcement.created_at.desc()).all()

def view_report_by_class(db: Session, c_id: int):
    class_attendance_report(db, c_id)

def view_report_by_student(db: Session, s_id: int):
    student_overall_report(db, s_id)

def view_report_by_subject(db: Session, sub_id: int):
    subject_overall_report(db, sub_id)