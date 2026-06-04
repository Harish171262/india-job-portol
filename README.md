# 💼 India Job Portal 
A comprehensive, full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed to connect job seekers with employers across India. This platform facilitates seamless job postings, application tracking, and user profile management with real-time data persistence.
---

DEMO
frontend:  https://india-job-portol.vercel.app/

backend:   https://india-job-portol.onrender.com

## 🚀 Features
### 👤 User Authentication & Roles
*   **Secure Sign-Up & Login:** Integrated authentication to protect user dashboards.
*   **Role-Based Dashboards:** Distinct user experiences for **Employers** (to post jobs and view applicants) and **Candidates** (to browse and apply for jobs).
### 📋 Employer Dashboard
*   **Job Management:** Create, update, and delete active job vacancies.
*   **Applicant Tracking:** View profiles and application details submitted by candidates.
### 🔍 Candidate Dashboard
*   **Advanced Job Search:** Filter and search through real-time job openings.
*   **Easy Apply:** One-click application process linking candidate profiles directly to employer vacancy listings.
---
## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js, HTML5, CSS3, JavaScript | Interactive, responsive user interface |
| **Backend** | Node.js, Express.js | Secure RESTful API management & routing |
| **Database** | MongoDB, MongoDB Compass | Schemaless document database for persistent storage |
| **Source Control** | Git, GitHub | Distributed version control and cloud deployment |

---
## 📂 Project Structure
```text
mkdir job-portol/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   └── jobs.js
│   ├── node_modules/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.css
│   │   ├── App.js
│   │   └── index.js
│   ├── node_modules/
│   └── package.json
└── README.md
