# 🏥 Procurement Automation System

A complete **web-based Procurement Automation System** developed for **Smiles Institute of Gastroenterology LLP** to digitize and streamline hospital procurement workflows.

This project replaces manual procurement management using **Excel sheets, paperwork, and manual vendor handling** with a centralized digital platform.

---

# 📌 Problem Statement

During an internship at **Smiles Institute of Gastroenterology LLP**, procurement inefficiencies were identified by **Sarah Sunil Jacob**.

The hospital procurement process faced several challenges:

- Procurement requirements were managed manually using **Excel sheets**
- Vendor registration was a **manual process**
- Requirement approvals lacked automation
- Purchase orders had to be created manually
- Workflow tracking was inefficient and time-consuming

Sarah approached us with the requirement to develop a solution that could automate and simplify the complete procurement process.

---

# 🚀 Solution

We developed a **Procurement Automation System** to digitize and automate the workflow.

### Workflow:

```text
Requirement Raised
        ↓
Approval Process
        ↓
Admin Verification
        ↓
Vendor Processing
        ↓
Purchase Order Generation
```

The system allows procurement teams to raise requirements online, manage approvals, register vendors digitally, and generate downloadable PDF documents.

---

# ✨ Features

## 🔐 Authentication System
- Secure login page
- Authentication support
- User access control

---

## 📊 Dashboard
- Procurement overview
- Quick workflow navigation
- User-friendly UI
- Clean professional hospital theme

---

## 📝 Raise Indent System
- Create procurement requests digitally
- Add item details
- Requirement justification section
- Approval-ready format
- Download indent as PDF

---

## 🏢 Vendor Registration
- Register vendors digitally
- Vendor information storage
- Eliminate paperwork
- Structured vendor database

---

## 🛒 Purchase Order Management
- Generate purchase orders
- Vendor assignment support
- Itemized procurement records
- Downloadable PDF generation

---

## 📄 PDF Generation
- Professional A4 PDF layouts
- Hospital formatted documents
- Download-ready forms
- Printable purchase orders and indents

---

## ✅ Approval Workflow
- Raise requirement through website
- Approval management system
- Admin approval process
- Vendor procurement integration

---

# 🛠️ Tech Stack

## Frontend
Developed using:

- HTML5
- CSS3
- JavaScript

### Frontend Responsibilities
- UI Design
- Form Design
- Navigation System
- Responsive Layout
- Workflow Interface

---

## Backend
Developed using:

- Node.js
- Express.js
- JavaScript
- MySQL
- Authentication System

### Backend Responsibilities
- API Development
- Database Management
- Authentication
- PDF Generation
- Business Logic

---

## Database
- MySQL Database
- Relational Schema Design
- Procurement Records Storage
- Vendor Management Storage

---

## Tools & Technologies
- PDFKit (PDF Generation)
- XAMPP (Local Database Server)
- Git
- GitHub
- Railway (Deployment Attempt)
- Ngrok (Temporary Live Demo Hosting)

---

# 📂 Project Structure

```bash
client/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── vendorController.js
│   │   ├── poController.js
│   │   ├── indentController.js
│   │   └── pdfController.js
│   │
│   ├── database/
│   │   ├── connection.js
│   │   ├── schema.sql
│   │   └── seed.js
│   │
│   ├── middleware/
│   │   └── errorHandler.js
│   │
│   ├── pdf/
│   │   └── pdfGenerator.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── vendors.js
│   │   ├── purchaseOrders.js
│   │   ├── indentRequests.js
│   │   └── pdf.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── dashboard.html
│   ├── dashboard.css
│   ├── login.html
│   ├── login.css
│   ├── vendorreg.html
│   ├── vendorreg.css
│   ├── raiseindent.html
│   ├── raiseindent.css
│   ├── poform.html
│   ├── poform.css
│   │
│   └── js/
│       ├── common.js
│       ├── login.js
│       ├── vendorreg.js
│       ├── poform.js
│       └── raiseindent.js
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/ArunAura/procurement-system.git
cd procurement-system
```

---

## 2️⃣ Install Backend Dependencies

Go to backend folder:

```bash
cd backend
npm install
```

---

## 3️⃣ Setup Environment Variables

Create a `.env` file inside `backend/`

Add:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hospital_db
PORT=3000
```

---

## 4️⃣ Start XAMPP

Turn ON:

✅ Apache  
✅ MySQL

---

## 5️⃣ Setup Database

Run:

```bash
npm run setup-db
```

This automatically:

- Creates database
- Creates tables
- Seeds default admin user

---

## 6️⃣ Start Backend Server

```bash
npm start
```

Server will run on:

```bash
http://localhost:3000/login.html
```

---

# 🔑 Demo Login Credentials

```text
Email: admin@smiles.com
Password: admin123
```

---

# 👨‍💻 Contributors

## 🎨 Frontend Development

### Arun Kumar
Responsible for:

- HTML Development
- CSS Styling
- JavaScript Frontend
- UI/UX Design
- Form Design
- Navigation System

GitHub:  
https://github.com/ArunAura

LinkedIn:  
https://www.linkedin.com/in/arunkumar/

---

## ⚙️ Backend Development

### Aayush Jha

Responsible for:

- Backend Development
- Authentication
- API Development
- SQL Database
- Server-side Logic
- PDF Generation Integration

LinkedIn:  
https://www.linkedin.com/in/aayush-jha-b560a533b/

---

## 🏥 Client & Requirement Gathering

### Sarah Sunil Jacob

Responsible for:

- Problem Identification
- Workflow Explanation
- Requirement Gathering
- Hospital Procurement Understanding

LinkedIn:  
https://www.linkedin.com/in/sarah-sunil-jacob-9049062bb/

---

# 🎯 Project Goals

This system aims to:

✅ Reduce manual paperwork  
✅ Eliminate Excel dependency  
✅ Improve procurement efficiency  
✅ Automate approval workflows  
✅ Digitize vendor management  
✅ Generate professional procurement documents

---

# 🔮 Future Improvements

Planned features:

- Cloud Deployment
- Role-based Authentication
- Email Notifications
- Multi-level Approval Workflow
- Analytics Dashboard
- Inventory Tracking
- Admin Management Panel
- Vendor Portal
- Real-time Status Tracking

---



# 🌐 Project Repository

GitHub Repository:

https://github.com/ArunAura/procurement-system

---

# 📜 License

This project was developed for **educational purposes and real-world workflow automation**.

---

## ⭐ If you liked this project, consider giving it a star on GitHub!
