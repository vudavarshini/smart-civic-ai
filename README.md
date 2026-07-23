# Smart Civic AI – AI-Powered Civic Complaint Management System

Smart Civic AI is a production-ready, full-stack civic complaint management portal developed for the **Smart India Hackathon (SIH)**. The platform enables citizens to report public infrastructure issues (like potholes, garbage, water leakages, and broken streetlights) by uploading photos. The system processes the image using an **AI service**, classifies the problem, assigns a priority rating, suggests the corresponding municipal department, and routes it to the administrative dashboard.

## 🚀 Key Features

* **Citizen Reporting Flow**: Quick image upload, automated AI-based classification, Leaflet mapping pinpoint coordinates selection, and live notification trackers.
* **AI Image Classification**: Automated analysis detecting Pothole, Garbage, Water Leakage, Broken Streetlight, Damaged Road, Illegal Dumping, or Open Drain. Establishes confidence ratings and suggestions. Supports citizen override if confidence is low.
* **Administrative SLA Dashboard**: Real-time KPI summary cards, analytical charts (Category distribution, Department workloads, Monthly volume charts), search/sort tables, status dispatcher adjustments, and CSV data reports downloader.
* **Notification Engine**: Submits alert notifications to citizen panels upon registration, filing, department dispatch, or resolutions.

---

## 🛠️ Technology Stack

* **Frontend**: React.js, Vite, Tailwind CSS, React Router v6, Axios, Chart.js, Leaflet Map (OpenStreetMap)
* **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT authentication, bcryptjs, Multer
* **AI Service**: Python, Flask, Flask-CORS, Pillow (Image Processing Heuristics)

---

## 📂 Project Structure

```
smart-civic-ai/
├── backend/
│   ├── config/db.js          # MongoDB Mongoose connector
│   ├── controllers/          # Request handlers (auth, complaints, admin, notify)
│   ├── middleware/           # Auth validation, Multer files handler
│   ├── models/               # Mongoose schemas (User, Complaint, Notification)
│   ├── routes/               # Express routing configuration
│   ├── uploads/              # Local storage for citizen uploads
│   ├── .env                  # Port, DB, JWT, and AI Url keys
│   ├── server.js             # Express bootstrap entry
│   └── package.json          # Node backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbars, Footer, Protected Route, MapView
│   │   ├── pages/            # Login, Register, Dashboards, Report, Details
│   │   ├── App.jsx           # Browser Routes container
│   │   ├── index.css         # Tailwind configurations and scrollbar styles
│   │   └── main.jsx          # React DOM mounting
│   ├── index.html            # Imports Google Fonts and Leaflet CSS stylesheets
│   ├── vite.config.js        # Port 3000 mapping and backend API proxies
│   ├── tailwind.config.js    # Custom government palette
│   └── package.json          # Frontend packages
├── ai-service/
│   ├── app.py                # Flask REST interface
│   ├── detect.py             # PIL-based heuristic analysis
│   ├── .env                  # AI port configurations
│   └── requirements.txt      # Python dependencies
├── database/
│   └── seed.js               # MongoDB seeder script
├── .env.example              # Template environments config
└── README.md                 # Setup guide
```

---

## ⚙️ Setup and Running Guide

Follow these steps sequentially to get the entire project up and running locally.

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** (v9 or higher)
* **Python** (v3.9 or higher)
* **MongoDB** (local database server running on standard port `27017`)

---

### Step 1: Initialize Backend & Configurations
Navigate to the root directory `smart-civic-ai` and set up the backend:

1. Copy `.env.example` into a new file named `.env` in the `backend/` folder:
   ```bash
   cp .env.example backend/.env
   ```
2. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

---

### Step 2: Seed the Database
Ensure your local MongoDB instance is running, then run the database seeder from the root folder:
```bash
cd ..
# Run this from the project root directory
node database/seed.js
```
*This will wipe existing databases and register 2 citizens, 1 admin, and 6 New Delhi coordinate complaints with Unsplash pictures.*

---

### Step 3: Run the Backend Server
From the `backend/` folder, start the development server:
```bash
cd backend
npm run dev
```
The API backend will start on **`http://localhost:5000`**.

---

### Step 4: Run the AI Detection Service
Open a new terminal window or tab to run the Python Flask service:

1. Navigate to the `ai-service/` folder:
   ```bash
   cd ai-service
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment variables:
   ```bash
   cp .env.example .env
   # Or create .env file containing:
   # PORT=8000
   # HOST=127.0.0.1
   ```
5. Run the Flask server:
   ```bash
   python app.py
   ```
The AI service will listen on **`http://127.0.0.1:8000`**.

---

### Step 5: Run the React Frontend
Open a third terminal window or tab to launch the React interface:

1. Navigate to the `frontend/` folder:
   ```bash
   cd frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
The frontend interface will launch on **`http://localhost:3000`**.

---

## 🔑 Demo Access Credentials

You can sign in using these pre-registered seed accounts:

### Citizen Profile
* **Email**: `rahul@gmail.com`
* **Password**: `citizen123`
*(Can submit new issues, view map markings, inspect timelines, and edit profiles)*

### Administrator Profile
* **Email**: `admin@civicai.gov.in`
* **Password**: `admin123`
*(Can inspect charts, change issue statuses, re-assign departments, delete records, and download CSV reports)*
