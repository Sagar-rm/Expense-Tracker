# FinTrack AI — Smart Expense Tracker: Full Explanation

## 1. Project Overview
**FinTrack AI** is a modern, full-stack application designed to help users manage their personal finances with the help of Artificial Intelligence. Unlike traditional trackers, it uses Machine Learning to predict future spending, analyze trends, and automatically categorize expenses based on their description.

---

## 2. Technology Stack & Languages

### **Languages**
1.  **JavaScript (ES6+)**:
    *   Used in the **Frontend** (React) for interactive UI logic.
    *   Used in the **Backend** (Node.js) for handling API requests and database operations.
2.  **Python**:
    *   Used for the **ML Microservice**. Python is the industry standard for Data Science and Machine Learning.
3.  **CSS (Tailwind CSS v4)**:
    *   Used for styling the application. It allows for rapid design of beautiful, responsive interfaces.
4.  **HTML5**:
    *   The structural foundation of the web application.

### **Core Technologies**
*   **Frontend**: React 19, Vite (Build tool), Recharts (Data visualization).
*   **Backend**: Node.js, Express.js (Web framework).
*   **Database**: MongoDB (NoSQL database for flexible data storage).
*   **Machine Learning**: Scikit-Learn (Linear Regression), NumPy, Flask (Python Micro-framework).
*   **Authentication**: JWT (JSON Web Tokens) and Bcrypt (Password hashing).

---

## 3. Directory Structure & File Breakdown

### **ROOT Directory**
*   `start.sh`: A helper script that starts the Backend, Frontend, and ML Service all at once.
*   `README.md`: The primary documentation file for developers.

---

### **BACKEND (`/server`)**
The "brain" of the application that handles data and security.

*   **`server.js`**: The main entry point. It sets up the Express server, connects to the database, and registers all API routes.
*   **`config/db.js`**: Contains the logic to connect the application to the MongoDB database.
*   **`models/`**: Defines the "shape" of data in the database.
    *   `User.js`: Stores user credentials and profile info.
    *   `Expense.js`: Stores expense details (amount, date, category, tags).
*   **`controllers/`**: Contains the actual "business logic".
    *   `authController.js`: Logic for signing up, logging in, and managing accounts.
    *   `expenseController.js`: Logic for creating, viewing, updating, and deleting expenses.
    *   `analyticsController.js`: Aggregates data for charts and communicates with the ML Service.
*   **`routes/`**: Defines the URL endpoints.
    *   `authRoutes.js`: Maps `/api/auth` to account features.
    *   `expenseRoutes.js`: Maps `/api/expenses` to expense features.
    *   `analyticsRoutes.js`: Maps `/api/analytics` to AI/Insight features.
*   **`middleware/authMiddleware.js`**: A security guard. It checks if the user is logged in (via a token) before allowing access to private data.
*   **`services/`**: Helper logic.
    *   `categorizationService.js`: Automatically detects if a "Burger" expense should be under "Food".
    *   `budgetRiskService.js`: Calculates if the user is spending too much compared to previous months.

---

### **FRONTEND (`/client`)**
The user interface that people interact with.

*   **`src/main.jsx` & `App.jsx`**: The starting points of the React app. `App.jsx` handles the routing (switching between Login, Dashboard, etc.).
*   **`src/context/AuthContext.jsx`**: Manages the "Global State" of the user. It knows if you are logged in or not everywhere in the app.
*   **`src/pages/`**: The main screens of the app.
    *   `Dashboard.jsx`: Shows the big picture (Total spent, Quick Charts).
    *   `Expenses.jsx`: A detailed list of every transaction with search and filters.
    *   `Analytics.jsx`: The "AI" screen showing future predictions and spending trends.
    *   `AddExpense.jsx`: The beautiful form to record new spending.
*   **`src/services/api.js`**: A centralized place for all communication with the Backend.
*   **`src/index.css`**: Defines the look and feel (Colors, Fonts, Glassmorphism effects).

---

### **ML MICROSERVICE (`/ml-service`)**
The intelligence layer.

*   **`app.py`**: A small server written in Python (Flask) that listens for requests from the Node.js backend.
*   **`model.py`**: The Machine Learning implementation.
    *   It uses **Linear Regression** to look at your last 6 months of spending and predict what you might spend next month.
    *   It also performs "Trend Analysis" to see if your spending is increasing or decreasing.

---

## 4. How Data Flows
1.  **User Inputs** an expense on the **Frontend**.
2.  The **Backend** receives it, runs the **Categorization Service**, and saves it to **MongoDB**.
3.  When the user visits the **Analytics** page, the **Backend** fetches history and sends it to the **Python ML Service**.
4.  The **ML Service** returns a prediction, which the **Frontend** displays as a beautiful chart.

---

## 5. Summary Table

| Category | Item | Purpose |
| :--- | :--- | :--- |
| **Logic** | Node.js / Express | Processing requests and managing data |
| **Storage** | MongoDB | Storing user and expense records safely |
| **UI** | React | Providing a fast, smooth user experience |
| **Intelligence** | Python / Scikit-Learn | Predicting future costs and analyzing patterns |
| **Security** | JWT | Ensuring only you can see your own data |
