# HRMS-Lite

**HRMS Lite** – Full-Stack Coding Assignment

- **Live Frontend URL:** [https://hrms-lite-6lxp.vercel.app](https://hrms-lite-6lxp.vercel.app)  
- **Live Backend API (Railway):** [hrms-lite-production-fa7e.up.railway.app/docs](https://hrms-lite-production-fa7e.up.railway.app/docs)  
- **GitHub Repository:** [[Link to your repo](https://github.com/Ainy07/HRMS-Lite)]

---

## **Overview**

HRMS Lite is a lightweight Human Resource Management System designed to demonstrate full-stack development skills.  
The system allows an admin to:

- Manage employee records  
- Track daily attendance  

This project focuses on essential HR operations with a simple, professional, and usable interface.  

---

## **Functional Requirements**

### 1. Employee Management

The admin can:

- Add a new employee with:
  - Employee ID (unique)
  - Full Name
  - Email Address
  - Department
- View all employees
- Delete an employee

### 2. Attendance Management

The admin can:

- Mark attendance for an employee:
  - Date
  - Status (Present / Absent)
- View attendance records for each employee

---

## **Backend & Database Requirements**

- RESTful APIs implemented with **FastAPI**
- Data persisted using **Mongo / Railway**
- Basic server-side validation:
  - Required fields
  - Valid email format
  - Duplicate employee handling
- Proper HTTP status codes and meaningful error messages

---


## **Tech Stack**

**Frontend:**  
- React 19 + Vite  
- Axios  

**Backend:**  
- Python FastAPI  
- Uvicorn  

**Database:**  
- MongoDB 

**Deployment:**  
- Frontend: Vercel  
- Backend: Railway  

---

## **Project Structure**

HRMS-Lite/
├─ frontend/ # React + Vite frontend (deployed on Vercel)
├─ backend/ # FastAPI backend (deployed on Railway)
├─ README.md


---

## **Steps to Run Locally**

### Frontend

```bash
cd frontend
npm install
npm run dev
Open http://localhost:5173 in your browser.

Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
Open http://localhost:8000/docs for API documentation.

Assumptions & Limitations
Single admin user (no authentication implemented)

No advanced HR features (payroll, leave management)

Core functionality focuses on Employee & Attendance management

Bonus Features (Optional)
Filter attendance records by date

Display total present days per employee

Basic dashboard summary

Notes
The application is fully deployed and publicly accessible via the URLs above.

Ensure backend is running for frontend to function correctly if running locally.