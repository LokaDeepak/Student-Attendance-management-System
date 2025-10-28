from typing import Optional

from pydantic import BaseModel, EmailStr


class InstitutionRegistrationSchema(BaseModel):
    inst_name: str
    inst_address: Optional[str]
    master_admin_name: str
    inst_email: str
    inst_phone: str
    inst_password: str
    admin_username: str

class AdminLoginSchema(BaseModel):
    inst_id: str
    admin_username: str
    admin_password: str

class AdminCreateSchema(BaseModel):
    admin_name: str
    admin_email: str
    admin_phone: str
    admin_password: str
    admin_username: str

class StudentCreateSchema(BaseModel):
    reg_no: str
    s_name: str
    s_email: str
    s_phone: str
    c_name: str

class TokenSchema(BaseModel):
    #if login successful
    access_token: str
    token_type: str = "bearer"


class InstitutionResponse(BaseModel):
    """
    Schema for the response after a successful institution registration.
    Crucial for sending the generated inst_code back to the user.
    """
    inst_id: int
    inst_code: str
    inst_name: str
    inst_email: EmailStr

    # Required for Pydantic to read attributes from SQLAlchemy objects
    class Config:
        from_attributes = True

