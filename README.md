# 📘 Sales CRM Dashboard - Fullstack Project

This is a full-stack Sales CRM application designed to streamline lead tracking, employee performance, and daily operations. The system is built with role-based dashboards: **Admin** and **Employee**, each with tailored interfaces and permissions.

---

## 📁 Folder Structure

```
Sales-CRM-Dashboard/
├── backend/                  # Express.js server
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/                 # React Frontend (split)
│   ├── admin/                # Admin Dashboard (No Auth)
│   └── employee/             # Employee Dashboard (JWT Auth)
└── README.md
```

---

## 🔧 Tech Stack

**Frontend:** React, React Router, Axios, Modular CSS  
**Backend:** Node.js, Express, MongoDB, JWT, Bcrypt  
**Deployment:** Netlify/Vercel (Frontend) + Render/Heroku (Backend)

---

## 🚀 Features

### ✅ Admin Panel (No Auth)
- Lead statistics, employee activity, conversion analytics
- CSV upload & sample template
- Manual/Bulk lead entry and assignment
- Team management with auto-distribution logic

### ✅ Employee Dashboard (JWT Protected)
- Attendance with check-in/out and break logs
- Lead management with status restrictions (e.g., ongoing/closed)
- Scheduled call filters (Today, Upcoming, All)
- Profile edit with password reset
- Activity Feed and Responsive Mobile Navigation

---

## 🛠️ Local Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/sales-crm-dashboard.git
cd sales-crm-dashboard
```

### 2. Start Backend
```bash
cd backend
npm install

# Create a .env file:
echo "MONGO_URI=your_mongo_url" >> .env
echo "JWT_SECRET=your_secret" >> .env

npm run dev  # Starts on http://localhost:5000
```

### 3. Start Admin Frontend (No Auth)
```bash
cd ../frontend/admin
npm install
npm run dev  # Starts on http://localhost:5173
```

### 4. Start Employee Frontend
```bash
cd ../employee
npm install
npm run dev  # Starts on http://localhost:5174
```

> ✅ Each frontend has its own styling and routing structure

---

## 🔐 Security Highlights
- Password encryption with bcrypt
- JWT-based login for Employee
- Secure API access (role-checked)
- Backend-driven filtering, search, and pagination

---

## 📄 Sample CSV
Available inside: `frontend/admin/assets/sample-leads.csv`

---

## 🌐 Deployment Targets
- **Frontend:** Vercel / Netlify
- **Backend:** Render / Heroku

---

## 📧 Contact
Built with ❤️ by Mouna — for queries, reach out via email or GitHub.

---


