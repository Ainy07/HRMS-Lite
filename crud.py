from fastapi import HTTPException
from models import employee_helper, attendance_helper
from database import employee_collection, attendance_collection
from bson import ObjectId
def create_employee(emp):
    if employee_collection.find_one({"employee_id": emp.employee_id}) or \
       employee_collection.find_one({"email": emp.email}):
        raise HTTPException(status_code=400, detail="Employee already exists")
    try:
        result = employee_collection.insert_one(emp.dict())
        new_emp = employee_collection.find_one({"_id": result.inserted_id})
        return employee_helper(new_emp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_employees():
    return [employee_helper(e) for e in employee_collection.find()]

def delete_employee(emp_id):
    from bson import ObjectId
    result = employee_collection.delete_one({"_id": ObjectId(emp_id)})
    attendance_collection.delete_many({"employee_id": emp_id})
    return result.deleted_count

def add_attendance(emp_id: str, att):
    try:
        # Convert emp_id to ObjectId
        employee = employee_collection.find_one({"_id": ObjectId(emp_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid employee id")

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Insert attendance
    try:
        result = attendance_collection.insert_one({
            "employee_id": emp_id,
            "date": str(att.date),
            "status": att.status
        })
        new_att = attendance_collection.find_one({"_id": result.inserted_id})
        return attendance_helper(new_att)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_attendance(emp_id):
    return [attendance_helper(a) for a in attendance_collection.find({"employee_id": emp_id})]
