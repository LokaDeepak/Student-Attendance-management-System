from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, UniqueConstraint
from . database import Base

class Institution(Base):
    __tablename__ = "institution"

    inst_id = Column(String, primary_key=True)
    inst_name = Column(String(100), nullable=False)
    inst_address = Column(String(100))
    inst_email = Column(String(100), nullable=False)
    inst_phone = Column(String(100))
    master_admin_name = Column(String(100), nullable=False)
    inst_password = Column(String(100), nullable=False)

class Admin(Base):
    __tablename__ = "admin"
    admin_id = Column(Integer, primary_key=True)
    inst_id = Column(Integer, ForeignKey("institution.inst_id"))
    admin_name = Column(String(100), nullable=False)
    admin_username = Column(String(100), unique=True, nullable=False)
    admin_phone = Column(String(100), nullable=False)
    admin_email = Column(String(100), nullable=False)
    admin_password = Column(String(100), nullable=False)
    is_master = Column(bool, default=False, nullable=False)

class Classes(Base):
    __tablename__ = "classes"
    c_id = Column(Integer, primary_key=True)
    class_name = Column(String(100), nullable=False)
    inst_id = Column(Integer, ForeignKey("institution.inst_id"))

class Student(Base):
    __tablename__ = "student"
    s_id = Column(Integer, primary_key=True)
    inst_id = Column(Integer, ForeignKey("institution.inst_id"))
    c_id = Column(Integer, ForeignKey("classes.c_id"))
    reg_no = Column(String(100), nullable=False)
    sname = Column(String(100), nullable=False)
    s_email = Column(String(100), nullable=False)
    s_phone = Column(String(100), nullable=False)
    __table_args__ = (
        UniqueConstraint('inst_id', 'reg_no', name='uq_inst_regno'),
    )

class Subjects(Base):
    __tablename__ = "subjects"
    sub_id = Column(Integer, primary_key=True)
    sub_name = Column(String(100), nullable=False)
    inst_id = Column(Integer, ForeignKey("institution.inst_id"))

class Attendance(Base):
    __tablename__ = "attendance"
    a_id = Column(Integer, primary_key=True)
    s_id = Column(Integer, ForeignKey("Student.s_id"))
    c_id = Column(Integer, ForeignKey("classes.c_id"))
    sub_id = Column(Integer, ForeignKey("Subjects.sub_id"))
    date = Column(datetime, nullable=False)
    status = Column(Boolean, nullable=False)
    taken_by_admin = Column(Integer, ForeignKey("Admin.admin_id"))

class timAdminSubject(Base):
    __tablename__ = "admin_subject"
    admin_id = Column(Integer, ForeignKey("admins.admin_id"))
    sub_id = Column(Integer, ForeignKey("subjects.sub_id"))
    admin_subject = Column(String(100), nullable=False)

# Hypothetical model in models.py
class DateTime:
    pass

class Announcement(Base):
    __tablename__ = "announcement"
    id = Column(Integer, primary_key=True)
    inst_id = Column(Integer, ForeignKey("institution.inst_id"), nullable=False)
    admin_id = Column(Integer, ForeignKey("admin.admin_id"), nullable=False) # Who made the announcement
    title = Column(String(200), nullable=False)
    content = Column(String(1000), nullable=False)
    created_at = Column(DateTime, default=datetime.now)