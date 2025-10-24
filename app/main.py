from fastapi import FastAPI, Request, Form, Depends
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
#from . import models, crud, schemas
from crud.database import engine, get_db, admin_id, sid, class_id

#models.Base.metadata.create_all(bind=engine)
app = FastAPI()
templates = Jinja2Templates(directory="app/templates")

app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/register", response_class=HTMLResponse)
async def attendance(request: Request):
    return templates.TemplateResponse("reg_inst.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/addadmins", response_class=HTMLResponse)
async def adddmins(request: Request):
    return templates.TemplateResponse("manage_admins.html", {"request": request})

@app.get("/removeadmins/{admin_id}", response_class=HTMLResponse)
async def removeadmins(request: Request, admin_id: int):
    return templates.TemplateResponse("manage_admins.html", {"request": request}, {"admin_id": admin_id})

@app.get("/masterdashboard", response_class=HTMLResponse)
async def masterAdminDashboard(request: Request):
    return templates.TemplateResponse("masterdashboard.html", {"request": request})

@app.get("/adminDashboard", response_class=HTMLResponse)
async def admin(request: Request):
    return templates.TemplateResponse("adminDashboard.html", {"request": request})

@app.get("/addstudent", response_class=HTMLResponse)
async def addstudent(request: Request):
    return templates.TemplateResponse("manage_student.html", {"request": request})

@app.get("/removestudent/{student_id}", response_class=HTMLResponse)
async def removestudent(request: Request, student_id: int):
    return templates.TemplateResponse("arstudent.html", {"request": request}, {"student_id" : sid})

@app.get("/addclass", response_class=HTMLResponse)
async def addclass(request: Request):
    return templates.TemplateResponse("manage_class.html", {"request": request})

@app.get("/removeclass/{class_id}", response_class=HTMLResponse)
async def removeclass(request: Request, class_id: int):
    return templates.TemplateResponse("manage_class.html", {"request": request}, {"class_id" : class_id})

@app.get("/viewreport", response_class=HTMLResponse)
async def viewreport(request: Request):
    return templates.TemplateResponse("viewreport.html", {"request": request})

@app.get("/assignsubject", response_class=HTMLResponse)
async def assignsubject(request: Request):
    return templates.TemplateResponse("manage_subject.html", {"request": request})

@app.post("/register")
async def register_institution(
    request: Request,
    inst_name: str = Form(...),
    inst_address: str = Form(...),
    master_admin_name: str = Form(...),
    inst_email: str = Form(...),
    inst_phone: str = Form(...),
    inst_password: str = Form(...),
    cnf_password: str = Form(...),
    db: Session = Depends(get_db)
):
    # Logic: save to database
    return templates.TemplateResponse("login.html", {"request": request, "message": "Registered successfully!"})

@app.post("/masterlogin")
async def master_login_post(
    request: Request,
    inst_ode: str = Form(...),
    admin_id: str = Form(...),
    admin_password: str = Form(...),
    db: Session = Depends(get_db)
):
    return templates.TemplateResponse("masterdashboard.html", {"request": request})

@app.post("/adminlogin")
async def admin_login_post(
    request: Request,
inst_ode: str = Form(...),
    admin_id: str = Form(...),
    admin_password: str = Form(...),
    db: Session = Depends(get_db)
):
    return templates.TemplateResponse("admindashboard.html", {"request": request})

@app.post("/addadmins")
async def add_admin(
    request: Request,
    admin_name: str = Form(...),
    admin_email: str = Form(...),
    admin_phone: str = Form(...),
    admin_password: str = Form(...),
    db: Session = Depends(get_db)
):
    # Add admin record
    return templates.TemplateResponse("manage_admins.html", {"request": request, "message": "Admin added!"})

@app.post("/removeadmins/{admin_id}", response_class=HTMLResponse)
async def remove_admins(
    request: Request,
    admin_id: int = Form(...),
    db: Session = Depends(get_db)
):
    return templates.TemplateResponse("manage_admins.html", {"request": request, "message": "Admin removed!"})

@app.post("/addstudent")
async def add_student(
    request: Request,
    stu_name: str = Form(...),
    stu_reg_no: str = Form(...),
    class_id: int = Form(...),
    stu_email: str = Form(...),
    stu_phone: str = Form(...),
    db: Session = Depends(get_db)
):
    # Add student record
    return templates.TemplateResponse("manage_student.html", {"request": request, "message": "Student added!"})

@app.post("/removestudent/{student_id}", response_class=HTMLResponse)
async def remove_student(
        request: Request,
        stu_reg_no: str = Form(...),
        stu_name: str = Form(...),
        db: Session = Depends(get_db)
):
    return templates.TemplateResponse("manage_student.html", {"request": request, "message": "Student removed!"})

@app.post("/addclass")
async def add_class(
    request: Request,
    class_id: int = Form(...),
    class_name: str = Form(...),
    db: Session = Depends(get_db)
):
    return templates.TemplateResponse("manage_class.html", {"request": request, "message": "Class added!"})

@app.post("/removeclass/{class_id}", response_class=HTMLResponse)
async def remove_class(
    request: Request,
    class_id: int = Form(...),
    db: Session = Depends(get_db)
):
    return templates.TemplateResponse("manage_class.html", {"request": request, "message": "Class removed!"})

@app.post("/viewreport")
async def viewreport(
    request: Request,
):
    return templates.TemplateResponse("viewreport.html", {"request": request})

@app.post("/assignsubject")
async def assign_subject(
    request: Request,
    admin_id: int = Form(...),
    subject: str = Form(...),
    db: Session = Depends(get_db)
):
    return templates.TemplateResponse("manage_subject.html", {"request": request, "message": "Subject assigned!"})