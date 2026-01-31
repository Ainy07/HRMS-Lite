from pydantic import BaseModel, EmailStr
from datetime import date

class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str

class EmployeeResponse(EmployeeCreate):
    id: str  

    class Config:
        orm_mode = True

class AttendanceCreate(BaseModel):
    date: date
    status: str 

class AttendanceResponse(AttendanceCreate):
    id: str 
    employee_id: str

    class Config:
        orm_mode = True
