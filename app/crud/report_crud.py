from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from typing import List, Optional
from . import models
from app.schemas import *
from .models import Attendance, Student


def class_attendance_report(
        db: Session,
        c_id: int,
        sub_id: Optional[int],
        start_date: date,
        end_date: date
) -> List[dict]:
    """
    Generates a structured, summary attendance report for a given class over a date range.
    Calculates total sessions, present count, and attendance percentage per student in the class.
    """

    # Base filter for the date range and class
    base_filters = [
        Attendance.c_id == c_id,
        Attendance.date.between(start_date, end_date)
    ]

    if sub_id:
        base_filters.append(Attendance.sub_id == sub_id)

    # 1. Get total distinct sessions (count of distinct dates attendance was marked)
    total_sessions_query = db.query(func.count(func.distinct(Attendance.date))).filter(
        *base_filters
    ).scalar() or 0

    if total_sessions_query == 0:
        return []

    # 2. Get attendance data (group by student and count status)
    report_data = db.query(
        Student.s_id,
        Student.s_name,
        Student.reg_no,
        Attendance.status,
        func.count(Attendance.s_id).label("count")
    ).join(Attendance).filter(
        *base_filters
    ).group_by(Student.s_id, Attendance.status).all()

    # 3. Process data into a structured report map
    report_map = {}
    for s_id, name, reg_no, status, count in report_data:
        if s_id not in report_map:
            report_map[s_id] = {
                "student_id": s_id,
                "name": name,
                "reg_no": reg_no,
                "present_count": 0,
                "absent_count": 0
            }

        if status:
            report_map[s_id]["present_count"] = count
        elif not status:
            report_map[s_id]["absent_count"] = count

    # Final calculation and formatting
    final_report = []
    for data in report_map.values():
        present_count = data['present_count']
        percentage = (present_count / total_sessions_query) * 100 if total_sessions_query > 0 else 0

        final_report.append({
            "student_id": data['student_id'],
            "name": data['name'],
            "reg_no": data['reg_no'],
            "total_present": present_count,
            "total_absent": data['absent_count'],
            "total_sessions": total_sessions_query,
            "attendance_percentage": round(percentage, 2)
        })
    return final_report

#reprt by student
def student_overall_report(
        db: Session,
        s_id: int,
        start_date: date,
        end_date: date
) -> dict:
    """
    Generates a student's overall attendance summary and subject-wise breakdown for a date range.
    """

    # 1. Subject-wise breakdown
    subject_report_data = db.query(
        Attendance.sub_id,
        models.Attendance.status,
        func.count(models.Attendance.id).label("count")
    ).join(models.Attendance, models.Attendance.sub_id == models.Attendance.sub_id).filter(
        models.Attendance.s_id == s_id,
        models.Attendance.date.between(start_date, end_date)
    ).group_by(models.Attendance.sub_id, models.Attendance.status).all()

    subject_details = {}
    total_records = 0
    overall_present = 0

    # Organize data by subject
    for subject_name, status, count in subject_report_data:
        if subject_name not in subject_details:
            subject_details[subject_name] = {"present": 0, "absent": 0, "total": 0}

        if status:
            subject_details[subject_name]["present"] = count
            overall_present += count
        elif not status:
            subject_details[subject_name]["absent"] = count

        subject_details[subject_name]["total"] += count
        total_records += count

    # Calculate overall totals and percentages
    overall_percentage = (overall_present / total_records) * 100 if total_records > 0 else 0

    # Final formatting of subject breakdown
    final_subject_breakdown = []
    for name, data in subject_details.items():
        sub_percent = (data['present'] / data['total']) * 100 if data['total'] > 0 else 0
        final_subject_breakdown.append({
            "subject_name": name,
            "present": data['present'],
            "absent": data['absent'],
            "total_sessions": data['total'],
            "percentage": round(sub_percent, 2)
        })

    return {
        "student_id": s_id,
        "overall_percentage": round(overall_percentage, 2),
        "total_sessions_marked": total_records,
        "total_present": overall_present,
        "total_absent": total_records - overall_present,
        "subject_breakdown": final_subject_breakdown
    }

#get report by subjects
def subject_overall_report(
        db: Session,
        sub_id: int,
        inst_id: int,
        start_date: date,
        end_date: date
) -> dict:
    """
    Generates a summary report for a specific subject across all classes
    in the institution for a date range, broken down by class.
    """

    # 1. Total records marked for the subject across all classes in the institution
    # NOTE: Assuming AttendanceRecord has institution_id for this cross-check
    base_filters = [
        models.Attendance.sub_id == sub_id,
        models.Attendance.date.between(start_date, end_date),
        models.Attendance.inst_id == inst_id
    ]

    total_records = db.query(func.count(models.Attendance.sub_id)).filter(*base_filters).scalar() or 0

    if total_records == 0:
        return {"subject_id": sub_id, "total_records": 0, "overall_percentage": 0, "class_breakdown": []}

    # 2. Get attendance data grouped by class and status
    class_report_data = db.query(
        models.Classes.c_name,
        models.Attendance.status,
        func.count(models.Attendance.id).label("count")
    ).join(models.Attendance, models.Attendance.c_id == models.Classes.c_id).filter(
        *base_filters
    ).group_by(models.Classes.c_name, models.Attendance.status).all()

    class_details = {}
    overall_present = 0

    for class_name, status, count in class_report_data:
        if class_name not in class_details:
            class_details[class_name] = {"present": 0, "absent": 0, "total": 0}

        if status:
            class_details[class_name]["present"] = count
            overall_present += count
        elif not status:
            class_details[class_name]["absent"] = count

        class_details[class_name]["total"] += count

    # Calculate overall subject percentage
    overall_percentage = (overall_present / total_records) * 100 if total_records > 0 else 0

    # Final formatting of class breakdown
    final_class_breakdown = []
    for name, data in class_details.items():
        class_percent = (data['present'] / data['total']) * 100 if data['total'] > 0 else 0
        final_class_breakdown.append({
            "class_name": class_name,
            "total_present": data['present'],
            "total_absent": data['absent'],
            "total_sessions_marked": data['total'],
            "class_percentage": round(class_percent, 2)
        })

    return {
        "subject_id": sub_id,
        "overall_attendance_percentage": round(overall_percentage, 2),
        "total_records_marked": total_records,
        "class_breakdown": final_class_breakdown
    }