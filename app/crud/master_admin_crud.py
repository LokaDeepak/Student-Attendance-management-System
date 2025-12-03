import secrets
import string
from typing import Optional

import bcrypt
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.crud import models
from app.crud.auth_crud import hash_password
from app.crud.report_crud import class_attendance_report, student_overall_report, subject_overall_report
from app.schemas.attendance import Subject
from app.schemas.student import StudentCreateSchema
from models import Institution, Admin, Student, Classes, Subjects


def generate_unique_inst_code(db: Session, length: int = 8) -> str:
    characters = string.digits

    while True:
        code = ''.join(secrets.choice(characters) for i in range(length))

        exists = db.query(Institution).filter(code == Institution.inst_code).first()

        if not exists:
            return code

def create_institution_and_master_admin(db: Session, inst_data: 'InstitutionRegistrationSchema'):
    hashed_password = hash_password(inst_data.inst_password)
    # inst id generation
    inst_code = generate_unique_inst_code(db)

    # create the institution
    db_institution = Institution(
        inst_code=inst_code,  # Save the generated code
        inst_name=inst_data.inst_name,
        inst_email=inst_data.inst_email,
        inst_phone=inst_data.inst_phone,
        inst_master_admin_name=inst_data.inst_master_admin_name,
        inst_password=hashed_password,
        # ... other fields
    )
    db.add(db_institution)
    db.flush()  # Flush to get the inst_id before committing

    # create master admin record
    db_admin = Admin(
        inst_code=db_institution.inst_code,
        admin_id=db_institution.admin_id,
        admin_name=inst_data.master_admin_name,
        admin_username=inst_data.admin_user_name,
        admin_phone=inst_data.admin_phone,
        admin_email=inst_data.inst_email,  # Using institution email for master admin login
        admin_password=hashed_password,
        is_master=True
    )
    db.add(db_admin)
    db.commit()

    return db_institution


def create_admin(db: Session, inst_id: int, admin_data: 'AdminCreateSchema') -> Admin:
    """Creates a new Institution Admin (non-master)."""

    # hashing password before saving to db
    hashed_password = hash_password(admin_data.admin_password)

    admin_exists = db.query(Admin).filter(
        Admin.inst_id == inst_id,
        Admin.admin_username == admin_data.admin_username
    ).first()

    if admin_exists:
        raise ValueError("Admin Username already exists for this institution.")

    db_admin = Admin(
        inst_id=inst_id,
        admin_name=admin_data.admin_name,
        admin_phone=admin_data.admin_phone,
        admin_email=admin_data.admin_email,
        admin_username=admin_data.admin_username,  # Unique login ID
        admin_password=hashed_password,
        is_master=False  # This is a regular admin
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin


# 2. REMOVE ADMIN (P4)
def delete_admin_by_id(db: Session, inst_id: int, admin_id: int) -> bool:
    """Deletes an Admin belonging to the specified institution."""

    admin = db.query(Admin).filter(
        Admin.inst_id == inst_id,
        Admin.admin_id == admin_id,
        Admin.is_master == False
    ).first()

    if admin:
        db.delete(admin)
        db.commit()
        return True

    return False
# to detect total number of admins
def get_admins_by_inst_id(db: Session, inst_id: int) -> list[Admin]:
    """Retrieves all Admin records (Master and Institution Admins) for a dashboard count."""
    admins = db.query(Admin).filter(Admin.inst_id == inst_id).all()
    return admins

def get_admin_by_username(db: Session, admin_username: str) -> Optional[Admin]:
    admin = db.query(Admin).filter(Admin.admin_username == admin_username).first()
    #if admin:
     #   return {"message": f"Admin {admin_username} already exists"}

def get_admin_by_id(db: Session, admin_id: int) -> Optional[Admin]:
    admin = db.query(Admin).filter(Admin.admin_id == admin_id).first()

# to create new student
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

#to add class
def create_class(db: Session, inst_id: int, class_name: str) -> Classes:
    # check if the class name already exists within this institution
    class_exists = db.query(Classes).filter(
        Classes.inst_id == inst_id,
        func.lower(Classes.class_name) == func.lower(class_name)  # Case-insensitive check
    ).first()

    if class_exists:
        raise ValueError(f"Class name '{class_name}' already exists for this institution.")

    # 2. Create the Classes record
    db_class = Classes(
        inst_id=inst_id,
        class_name=class_name
    )
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class

#delete the class
def delete_class_by_id(db: Session, inst_id: int, c_id: int) -> bool:
    db_class = db.query(Classes).filter(
        Classes.inst_id == inst_id,
        Classes.c_id == c_id
    ).first()

    if db_class:
        # IMPORTANT: Deleting a class will likely fail if there are students
        # still linked to it (Foreign Key constraint). The API route must handle this.
        db.delete(db_class)
        db.commit()
        return True

    return False

def get_subject_by_id(db: Session, sub_id: int) -> Optional[Subject]:
    subject = db.query(Subjects).filter(Subjects.sub_id == sub_id).first()



# reading data for view reports
def get_total_students_count(db: Session, inst_id: int) -> int:
    return db.query(Student).filter(Student.inst_id == inst_id).count()

def get_all_classes(db: Session, inst_id: int) -> list[Classes]:
    return db.query(Classes).filter(Classes.inst_id == inst_id).all()

def get_all_students(db: Session, inst_id: int) -> list[Student]:
    return db.query(Student).filter(Student.inst_id == inst_id).all()

def view_report_by_class(db: Session, c_id: int):
    class_attendance_report(db, c_id)

def view_report_by_student(db: Session, s_id: int):
    student_overall_report(db, s_id)

def view_report_by_subject(db: Session, sub_id: int):
    subject_overall_report(db, sub_id)

def get_institution_by_code(db: Session, institution_code: str) -> Optional[models.Institution]:
    """
    Retrieves an institution by its unique code.
    Used by the registration route to check for code duplication.
    """
    return db.query(models.Institution).filter(models.Institution.institution_code == institution_code).first()


# def get_attendance_report_by_class(db: Session, class_id: int, subject_id: int, start_date: date, end_date: date) -> \
# List[dict]:
#     """Generates a summary attendance report for a given class, subject, and date range."""
#
#     # 1. Get total sessions (count of distinct dates attendance was taken)
#     total_sessions_query = db.query(func.count(func.distinct(models.AttendanceRecord.date))).filter(
#         models.AttendanceRecord.class_id == class_id,
#         models.AttendanceRecord.subject_id == subject_id,
#         models.AttendanceRecord.date.between(start_date, end_date)
#     ).scalar() or 0
#
#     if total_sessions_query == 0:
#         return []
#
#     # 2. Get attendance data (group by student and count status)
#     report_data = db.query(
#         models.Student.id,
#         models.Student.name,
#         models.Student.roll_number,
#         models.AttendanceRecord.status,
#         func.count(models.AttendanceRecord.id).label("count")
#     ).join(models.AttendanceRecord).filter(
#         models.Student.class_id == class_id,
#         models.AttendanceRecord.subject_id == subject_id,
#         models.AttendanceRecord.date.between(start_date, end_date)
#     ).group_by(models.Student.id, models.AttendanceRecord.status).all()
#
#     # 3. Process data into a structured report
#     report_map = {}
#     for student_id, name, roll_number, status, count in report_data:
#         if student_id not in report_map:
#             report_map[student_id] = {
#                 "student_id": student_id,
#                 "name": name,
#                 "roll_number": roll_number,
#                 "present_count": 0,
#                 "absent_count": 0,
#                 "total_sessions": total_sessions_query,
#             }
#
#         # Status should be stored in uppercase (P/A) or similar for consistent checking
#         if status.upper() == 'PRESENT':
#             report_map[student_id]["present_count"] = count
#         elif status.upper() == 'ABSENT':
#             report_map[student_id]["absent_count"] = count
#
#             # Final calculation and formatting
#     final_report = []
#     for data in report_map.values():
#         present_count = data['present_count']
#         percentage = (present_count / total_sessions_query) * 100 if total_sessions_query > 0 else 0
#
#         final_report.append({
#             "student_id": data['student_id'],
#             "name": data['name'],
#             "roll_number": data['roll_number'],
#             "total_present": present_count,
#             "total_absent": data['absent_count'],
#             "total_sessions": total_sessions_query,
#             "attendance_percentage": round(percentage, 2),
#         })
#
#     return final_report