from typing import Optional

from pydantic import BaseModel, Field, EmailStr

class InstitutionRegistrationSchema(BaseModel):
    inst_name: str
    inst_address: Optional[str]
    master_admin_name: str
    inst_email: str
    inst_phone: str
    inst_password: str
    admin_username: str

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

# from pydantic import BaseModel, Field, EmailStr
# from typing import Optional
#
#
# # --- 1. Schemas for CREATION (Data input from the Master Admin Registration Form) ---
#
# class MasterAdminCreate(BaseModel):
#     """Defines the data required to create the first Master Admin during Institution registration."""
#     name: str = Field(..., max_length=100)
#     email: EmailStr
#     username: str = Field(..., max_length=50)
#     password: str = Field(..., min_length=8)
#     phone_number: str = Field(..., max_length=20)
#
#
# class InstitutionCreate(BaseModel):
#     """Defines the data required to register a new institution."""
#     name: str = Field(..., max_length=255)
#     institution_code: str = Field(..., min_length=4, max_length=20)
#     address: str | None = None
#     # Nested schema to capture the Master Admin details in the same request
#     master_admin: MasterAdminCreate
#
#
# # --- 2. Schemas for RESPONSE (Data output by the API) ---
#
# class InstitutionBase(BaseModel):
#     """Base schema for an Institution."""
#     id: int
#     name: str
#     institution_code: str
#
#     class Config:
#         # Enable ORM mode to allow conversion from SQLAlchemy models to Pydantic objects
#         from_attributes = True
#
#
# class MasterAdminBase(BaseModel):
#     """Base schema for a Master Admin (used in responses, without password)."""
#     id: int
#     name: str
#     email: EmailStr
#     username: str
#
#     class Config:
#         from_attributes = True
#
#
# class InstitutionRegistrationResponse(BaseModel):
#     """
#     Schema for the response after a successful institution registration.
#     Crucial for sending the generated inst_code back to the user.
#     """
#     id: int
#     institution_code: str
#     name: str
#     email: EmailStr
#
#     class Config:
#         from_attributes = True