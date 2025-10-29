from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..crud.database import get_db
# from ..utils.security import create_access_token, authenticate_user, get_current_master_admin
# from ..utils.security import ACCESS_TOKEN_EXPIRE_MINUTES, create_jwt_token_for_user
from app.utils.security import (
    create_access_token,
    authenticate_user,
    get_current_master_admin,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_jwt_token_for_user
)

# Import Schemas (Input/Output validation)
from ..schemas.auth import AdminLoginSchema, TokenSchema
from ..schemas.institution import InstitutionRegistrationSchema, InstitutionResponse
from ..schemas.auth import AdminCreateSchema, Admin  # Admin schema used for output

from ..crud import master_admin_crud

router = APIRouter(
    prefix="/master-admin",
    tags=["Master Admin"]
)

#institution registration
@router.post("/register", response_model=InstitutionResponse, status_code=status.HTTP_201_CREATED)
def register_institution_and_master_admin(
    institution_data: InstitutionRegistrationSchema,
    db: Session = Depends(get_db)
):
    #Registers a new institution and creates its associated Master Admin.
    # Check if institution code already exists
    if master_admin_crud.get_institution_by_code(db, institution_data.institution_code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Institution with this code already exists"
        )

    # This function handles the creation of both Institution and Master Admin
    db_institution, db_master_admin = master_admin_crud.create_institution_and_master_admin(
        db=db,
        institution=institution_data
    )

    return db_institution

#admin/ master admin login
@router.post("/login", response_model=TokenSchema)
def master_admin_login(
    form_data: AdminLoginSchema,
    db: Session = Depends(get_db)
):
    """
    Authenticates the Master Admin using institution code, username, and password.
    Returns a JWT token upon success.
    """
    master_admin_user = authenticate_user(
        db=db,
        inst_code=form_data.inst_code,
        admin_username=form_data.admin_username,
        admin_password=form_data.admin_password,
        user_type="master_admin"
    )

    if not master_admin_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username, password, or institution code"
        )
 # Create the JWT token
    access_token = create_jwt_token_for_user(master_admin_user.id, "master_admin")

    return {"access_token": access_token, "token_type": "bearer"}

#admin management
@router.post("/admins", response_model=Admin, status_code=status.HTTP_201_CREATED)
def add_admin(
    admin_data: AdminCreateSchema,
    db: Session = Depends(get_db),
    current_master_admin: dict = Depends(get_current_master_admin)
):
    #Allows Master Admin to add a new Institution Admin.
    # Security check: Ensure the new admin belongs to the master admin's institution
    if admin_data.inst_id != current_master_admin['inst_id']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot add admin to a different institution"
        )

    # Check if username or email already exists
    if master_admin_crud.get_admin_by_username(db, admin_data.username):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")

    db_admin = master_admin_crud.create_admin(db=db, admin=admin_data)
    return db_admin

@router.delete("/admins/{admin_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    current_master_admin: dict = Depends(get_current_master_admin)
):
    #Allows Master Admin to remove an Institution Admin.
    admin_to_delete = master_admin_crud.get_admin_by_id(db, admin_id)

    if not admin_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")

    # Security check: Ensure admin belongs to the master admin's institution
    if admin_to_delete.inst_id != current_master_admin['inst_id']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete admin from a different institution"
        )

    master_admin_crud.delete_admin_by_id(db, admin_id)
    return {"message": "Admin deleted"}

# @router.post("/assign-subject", status_code=status.HTTP_201_CREATED)
# def assign_subject_to_admin(
#     admin_id: int,
#     subject_id: int,
#     db: Session = Depends(get_db),
#     current_master_admin: dict = Depends(get_current_master_admin)
# ):
#     #Allows Master Admin to assign a subject to a specific Institution Admin.
#     # Validation checks (Simplified - assumes subject and admin exist and belong to the institution)
#
#     # 1. Check if the Admin exists
#     admin_obj = master_admin_crud.get_admin_by_id(db, admin_id)
#     if not admin_obj or admin_obj.inst_id != current_master_admin['inst_id']:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found in institution")
#
#     #2. Check if the Subject exists (requires a subject CRUD function)
#     #Placeholder for subject existence check:
#     subject_obj = master_admin_crud.get_subject_by_id(db, subject_id)
#     if not subject_obj or subject_obj.institution_id != current_master_admin['institution_id']:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found in institution")
#
#     # 3. Perform Assignment
#     master_admin_crud.assign_subject(db, admin_id, subject_id)
#     return {"message": f"Subject ID {subject_id} successfully assigned to Admin ID {admin_id}"}