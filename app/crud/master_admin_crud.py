import secrets
import string

import bcrypt
from sqlalchemy.orm import Session

from app.crud.auth_crud import hash_password
from app.schemas.auth import StudentCreateSchema
from models import Institution, Admin, Student, Classes


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

# reading data for view reports
def get_total_students_count(db: Session, inst_id: int) -> int:
    return db.query(Student).filter(Student.inst_id == inst_id).count()

def get_all_classes(db: Session, inst_id: int) -> list[Classes]:
    return db.query(Classes).filter(Classes.inst_id == inst_id).all()

def get_all_students(db: Session, inst_id: int) -> list[Student]:
    return db.query(Student).filter(Student.inst_id == inst_id).all()
