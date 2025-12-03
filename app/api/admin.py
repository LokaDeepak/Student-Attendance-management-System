from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..crud.database import get_db
#import utils
from ..api.auth import create_access_token, authenticate_user, get_current_master_admin
from ..api.auth import ACCESS_TOKEN_EXPIRE_MINUTES, create_jwt_token_for_user