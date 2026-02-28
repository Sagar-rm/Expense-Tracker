# 🚀 FinTrack AI — Smart Expense Tracker

A full-stack AI-powered expense tracker with ML predictions, smart auto-categorization, budget risk alerts, and beautiful dark-mode analytics dashboard.

## 🏗️ Architecture

```
expense_tracker/
├── client/          # React + Vite + Tailwind CSS (Frontend)
├── server/          # Node.js + Express + MongoDB (Backend API)
└── ml-service/      # Python Flask + Scikit-Learn (ML Microservice)
```

## ✨ Features

### 🔹 Core Features
- JWT Authentication (Register / Login / Profile)
- Add / Edit / Delete Expenses
- Category filtering & date range filtering
- Monthly summary & dashboard analytics

### 🔹 AI Features
- **Auto-categorization**: Keywords like "Swiggy" → Food, "Uber" → Transport
- **Spending trend detection**: Consecutive month growth alerts
- **ML Expense Prediction**: Linear Regression on 6-month data
- **Budget Risk Alert System**: HIGH/MEDIUM/LOW risk levels
- **AI Insight Cards**: Personalized spending insights

### 🎨 UI Highlights
- Premium dark mode with glassmorphism
- Recharts: Pie, Line, Area, Bar charts
- Animated stat cards, micro-interactions
- Fully responsive (mobile + desktop)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running on localhost:27017
- Python 3.8+

### 1. Start MongoDB
```bash
mongod
```

### 2. Start Backend API
```bash
cd server
npm install
npm run dev
# Runs on http://localhost:5000
```

### 3. Start ML Service
```bash
cd ml-service
source venv/bin/activate
python app.py
# Runs on http://localhost:8000
```

### 4. Start Frontend
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login
- `GET /api/auth/profile` — Get profile
- `PUT /api/auth/profile` — Update profile

### Expenses
- `POST /api/expenses` — Add expense (with auto-categorization)
- `GET /api/expenses` — List expenses (with filters)
- `PUT /api/expenses/:id` — Update expense
- `DELETE /api/expenses/:id` — Delete expense

### Analytics
- `GET /api/analytics/monthly-summary` — Dashboard data + risk alert + insights
- `GET /api/analytics/trends` — 6-month trend data
- `GET /api/analytics/prediction` — ML spending prediction
- `GET /api/analytics/categories` — Category breakdown

### ML Service
- `POST /predict` — Predict next month spending
- `POST /analyze` — Trend analysis

## 🌍 Environment Variables (server/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=your_secret_key
ML_SERVICE_URL=http://localhost:8000
```

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Charts | Recharts |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Auth | JWT + bcryptjs |
| ML | Python, Flask, Scikit-Learn, NumPy |
