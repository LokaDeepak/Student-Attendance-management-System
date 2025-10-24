from fastapi import FastAPI, Request, Form, Depends
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
#from . import models, crud, schemas
from crud.database import engine, get_db

#models.Base.metadata.create_all(bind=engine)
app = FastAPI()
templates = Jinja2Templates(directory="app/templates")

app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/register", response_class=HTMLResponse)
async def attendance(request: Request):
    return templates.TemplateResponse("registernewins.html", {"request": request})

@app.get("/masterdashboard", response_class=HTMLResponse)
async def masterAdminDashboard(request: Request):
    return templates.TemplateResponse("masterdashboard.html", {"request": request})

@app.get("/admin", response_class=HTMLResponse)
async def admin(request: Request):
    return templates.TemplateResponse("adminDashboard.html", {"request": request})

@app.post("/register", response_class=HTMLResponse)
async def registerIns(
        request: Request,
        ins_name : str = Form(...),
        ins_address : str = Form(...),
        master_admin_name : str = Form(...),
        ins_email : str = Form(...),
        ins_phone : str = Form(...),
        ins_password : str = Form(...),
        cnf_password : str = Form(...)
):
    student = schemas.StudentCreate(ins_name=ins_name, class_name=class_name, section=section, combination=combination)
    db_student = crud.create_student(db, student)
    return templates.TemplateResponse("student_added.html", {"request": request, "student": db_student})
