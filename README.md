# 🗂️ Task Manager Web Application

A full-stack **Task Management System** that helps users organize, track, and analyze their tasks efficiently. The application includes **user authentication**, **task tracking**, **reports & analytics**, and a modern **React dashboard UI**.

---

## 🚀 Features

### 🔐 Authentication & User Management
- User registration and login  
- Secure password hashing  
- JWT-based authentication  
- Protected routes for authorized users only  

### ✅ Task Management
- Create, update, and delete tasks  
- Set task priorities and statuses  
- Assign tasks to users  
- Track task progress  

### 📊 Reports & Analytics
- Visual reports of task status  
- Performance insights using charts  
- Task distribution overview  

### 📁 File Upload Support
- Upload attachments related to tasks  
- Middleware handling for file uploads  

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- JavaScript (ES6+)
- CSS
- Chart libraries for analytics

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Token (JWT)
- Middleware-based route protection


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a **.env** file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm start
```

Backend runs on:  
👉 `http://localhost:5000`

---

### 3️⃣ Frontend Setup

```bash
cd frontend/Task-Manager
npm install
npm run dev
```

Frontend runs on:  
👉 `http://localhost:5173`

---

## 🔌 API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/register | Register new user |
| POST   | /api/auth/login    | Login user |
| GET    | /api/tasks         | Get all tasks |
| POST   | /api/tasks         | Create task |
| PUT    | /api/tasks/:id     | Update task |
| DELETE | /api/tasks/:id     | Delete task |
| GET    | /api/reports       | Get task reports |

---

## 🔒 Protected Routes

All task and report routes require a valid JWT token in headers:

```
Authorization: Bearer <token>
```

Authentication is handled using middleware.

---

## 📊 Dashboard & UI

The frontend dashboard includes:
- Task cards with status indicators  
- User overview cards  
- Bar charts and legends for analytics  
- Responsive layout for better usability  

---

## 🧠 Key Learning Outcomes

- Building a complete MERN stack application  
- Implementing JWT authentication  
- Designing RESTful APIs  
- Handling file uploads in Node.js  
- Creating data visualizations in React  
- Structuring scalable full-stack projects  

---

## 📌 Future Improvements

- Email notifications for task deadlines  
- Role-based access control (Admin/User)  
- Drag & drop task board (Kanban style)  
- Real-time updates using WebSockets  

---

## 👨‍💻 Author

**Shivraj Patil**  
Full-Stack Web Developer (MERN)

---

⭐ If you like this project, consider giving it a star on GitHub!
