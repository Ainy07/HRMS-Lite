from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import crud, schemas

app = FastAPI(title="HRMS Lite API (MongoDB)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
# Global exception log for debugging
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    print("Exception:", exc)
    traceback.print_exc()
    return {"detail": "Internal Server Error"}

# EMPLOYEE CRUD
@app.post("/employees", response_model=schemas.EmployeeResponse)
def add_employee(emp: schemas.EmployeeCreate):
    return crud.create_employee(emp)


@app.get("/employees", response_model=list[schemas.EmployeeResponse])
def list_employees():
    return crud.get_employees()

@app.delete("/employees/{emp_id}")
def remove_employee(emp_id: str):
    deleted = crud.delete_employee(emp_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted"}

# ATTENDANCE CRUD
@app.post("/employees/{emp_id}/attendance", response_model=schemas.AttendanceResponse)
def mark_attendance(emp_id: str, att: schemas.AttendanceCreate):
    return crud.add_attendance(emp_id, att)

@app.get("/employees/{emp_id}/attendance", response_model=list[schemas.AttendanceResponse])
def view_attendance(emp_id: str):
    return crud.get_attendance(emp_id)
