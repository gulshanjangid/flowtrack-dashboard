# 🚀 FlowTrack Dashboard

FlowTrack Dashboard is a **workflow and task management system** built with a modern React frontend and Flask backend.
It allows teams to manage workflows, tasks, users, and teams efficiently through an intuitive dashboard interface.

---

# 📌 Project Overview

FlowTrack is designed to help organizations:

* Track workflows
* Manage tasks
* Organize teams
* Monitor user activities
* Maintain workflow history

This project includes:

* ⚛️ React + TypeScript frontend
* 🐍 Flask REST API backend
* 🗄️ SQLAlchemy database models
* 🔐 JWT Authentication
* 📊 Dashboard analytics and charts

---

# ✨ Features

## 👤 User Management

* Register and login system
* JWT authentication
* User profile management
* Role-based access

## 📋 Task Management

* Create tasks
* Assign tasks to users
* Track task progress
* Update task status

## 🔄 Workflow Management

* Create workflows
* Manage workflow stages
* Assign workflows to teams

## 👥 Team Management

* Create teams
* Add users to teams
* Manage team members

## 📊 Dashboard Analytics

* Activity logs
* Task summaries
* Workflow visualization
* Charts and reports

---

# 🧰 Tech Stack

## Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* ShadCN UI
* React Router
* React Query
* Axios
* Recharts
* Framer Motion

## Backend

* Flask
* Flask SQLAlchemy
* Flask JWT Extended
* Flask Migrate
* Marshmallow
* Bcrypt
* Flask CORS

## Testing

* Vitest (Frontend)
* Pytest (Backend)
* Playwright

---

# 📁 Project Structure

```
flowtrack-dashboard-main/

├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── config.py
│   │   └── extensions.py
│   │
│   ├── run.py
│   ├── seed.py
│   └── requirements.txt
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── utils/
│
├── public/
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/flowtrack-dashboard.git

cd flowtrack-dashboard-main
```

---

# 🖥️ Frontend Setup

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

---

# 🐍 Backend Setup

Go to backend folder:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend server:

```bash
python run.py
```

---

# 🔑 Environment Variables

Create `.env` file inside **backend/**

Example:

```
FLASK_APP=run.py
FLASK_ENV=development

SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret

DATABASE_URL=sqlite:///flowtrack.db
```

---

# 🗄️ Database Setup

Run migrations:

```bash
flask db init
flask db migrate
flask db upgrade
```

Seed database (optional):

```bash
python seed.py
```

---

# 🔌 API Endpoints (Example)

## Authentication

```
POST /api/auth/login
POST /api/auth/register
```

## Users

```
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
```

## Tasks

```
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

## Teams

```
GET /api/teams
POST /api/teams
```

## Workflows

```
GET /api/workflows
POST /api/workflows
```

---

# 🧪 Running Tests

## Frontend Tests

```bash
npm run test
```

## Backend Tests

```bash
pytest
```

---

# 🎨 UI Framework

This project uses:

* Tailwind CSS
* ShadCN UI
* Radix UI Components

These libraries help create a modern and responsive dashboard.

---

# 📊 Dashboard Components

Includes:

* Charts (Recharts)
* Tables
* Forms
* Notifications
* Modals
* Activity Logs

---

# 🚀 Deployment

## Frontend

 https://flowtastic-tasks-13.lovable.app/

Build:

```bash
npm run build
```

Upload:

```
dist/
```

---

## Backend

Deploy using:

* Render
* Railway
* Heroku
* AWS EC2

Run:

```bash
gunicorn run:app
```

---

# 🛡️ Security

* JWT Authentication
* Password hashing with bcrypt
* CORS enabled
* Environment-based configuration

---

# 🤝 Contributing

Contributions are welcome!

Steps:

```bash
Fork repository

Create feature branch:
git checkout -b feature-name

Commit changes:
git commit -m "Add feature"

Push:
git push origin feature-name

Open Pull Request
```

---

# 📌 Future Improvements

* Role-based permissions
* Email notifications
* File attachments
* Workflow automation
* Advanced analytics
* Mobile responsiveness improvements

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Your Name**

GitHub:
https://github.com/your-username

---

# ⭐ Support

If you like this project:

⭐ Star the repository
🐛 Report issues
🚀 Suggest new features

---

