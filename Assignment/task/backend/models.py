
def employee_helper(emp):
    return {
        "id": str(emp["_id"]),
        "employee_id": emp["employee_id"],
        "full_name": emp["full_name"],
        "email": emp["email"],
        "department": emp["department"]
    }

def attendance_helper(att):
    return {
        "id": str(att["_id"]),
        "employee_id": att["employee_id"],
        "date": att["date"],
        "status": att["status"]
    }
