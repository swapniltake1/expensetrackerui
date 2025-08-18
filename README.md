# 💰 Expense Tracker Application

A **Fullstack Expense Tracker Application** built with **Spring Boot (Backend)** and **React + TypeScript (Frontend)**.  
This project is part of my **practice journey**, and the next milestone is to integrate **AI-powered suggestions** for smarter financial management.

---

## 📌 Project Overview

- **Backend**: Spring Boot, JPA, MySQL  
- **Frontend**: React (TypeScript), Vite, Tailwind CSS, shadcn-ui  
- **Authentication**: JWT (planned)  
- **Deployment**: GitHub + Vercel/Netlify (planned)  

---

## ⚡ Features

- ✅ Add, update, delete, and view expenses  
- ✅ Filter expenses by **date range** and **category**  
- ✅ Secure REST APIs with Spring Boot  
- ✅ Modern React frontend with clean UI  
- ✅ Scalable database integration  
- 🚀 Upcoming → **AI-powered expense optimization**  

---

## 🏗️ Architecture  

Frontend (React + TypeScript + Tailwind)
|
v
Backend (Spring Boot + JPA + MySQL)
|
v
Database (MySQL)



## 🔑 Backend APIs  

### 👤 User APIs  
- `POST /api/users/register` → Register a new user  
- `POST /api/users/login` → User login  

### 💰 Expense APIs  
- `GET /api/expenses?start={date}&end={date}&category={category}` → Get expenses (with optional filters)  
- `POST /api/expenses` → Add a new expense  
- `PUT /api/expenses/{id}` → Update an expense  
- `DELETE /api/expenses/{id}` → Delete an expense  

---

## 🛠️ Installation & Setup  

### 1️⃣ Clone Repositories  

**Backend**  
``` bash
git clone https://github.com/swapniltake1/expensetrackerapp.git
cd expensetrackerapp
Frontend

git clone https://github.com/swapniltake1/expensetrackerui.git
cd expensetrackerui
2️⃣ Backend Setup (Spring Boot)
Install Java 17+, Maven, and MySQL

Update application.properties with your DB credentials

properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
Run backend:

mvn spring-boot:run
Backend will start at 👉 http://localhost:8080

3️⃣ Frontend Setup (React + Vite)

cd expensetrackerui
npm install
npm run dev
Frontend will start at 👉 http://localhost:5173

🚀 Deployment
Backend: Deploy on Render / Railway / AWS EC2

Frontend: Deploy on Vercel / Netlify / GitHub Pages

🧭 Roadmap
 Add user authentication with JWT

 Build expense analytics dashboard

 AI-based expense categorization & suggestions

 Add charts for better visualization

 Mobile responsive UI

🤝 Contributing
Fork the repo

Create a new branch (feature/your-feature)

Commit your changes

Push the branch

Open a Pull Request 🚀

📜 License
This project is licensed under the MIT License – free to use and modify.


