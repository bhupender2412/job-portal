# JobPortal

A production-ready **full-stack Job Portal** built with the MERN stack.

JobPortal provides dedicated workflows for **Job Seekers, Recruiters, and Administrators**, covering job discovery, applications, recruiter hiring pipelines, company management, resume uploads, role-based access control, and platform moderation.

## Live Demo

**Frontend:**  
https://job-portal-topaz-two.vercel.app/

**Backend API:**  
https://job-portal-api-o0dr.onrender.com/

**API Health:**  
https://job-portal-api-o0dr.onrender.com/api/health

**GitHub Repository:**  
https://github.com/bhupender2412/job-portal

---

## Overview

JobPortal is a complete recruitment platform designed around three user roles:

- **Job Seekers** can create profiles, browse jobs, save opportunities, upload resumes, apply for jobs, and track applications.
- **Recruiters** can manage their company profile, create job listings, review candidates, and move applicants through a hiring pipeline.
- **Administrators** can monitor platform activity and moderate users, companies, jobs, and applications.

The project includes authentication, authorization, validation, Cloudinary resume storage, MongoDB persistence, responsive dashboards, filtering, pagination, security middleware, and production deployment.

---

## Features

### Job Seeker

- Register and login securely
- Browse published jobs
- Search and filter job listings
- View complete job details
- Maintain a professional profile
- Add headline, bio, location, education, experience, and skills
- Upload resume using Cloudinary
- View current resume
- Save jobs
- Remove saved jobs
- Apply for jobs
- Add a cover letter while applying
- Prevent duplicate applications
- Track submitted applications
- View application details
- View application status history
- Withdraw eligible applications
- Access protected Job Seeker routes

---

### Recruiter

- Recruiter-specific dashboard
- View job and application statistics
- Create and manage a company profile
- Maintain recruiter profile information
- Create job drafts
- Publish job listings
- Edit recruiter-owned jobs
- Close job listings
- Deactivate jobs
- View recruiter-owned jobs
- Search and filter applicants
- View candidate profiles
- View candidate resumes
- Review cover letters
- Move candidates through hiring stages
- Mark applications as under review
- Shortlist candidates
- Hire candidates
- Reject candidates
- Track application status history
- View recent jobs and applicants
- Recruiter-specific data isolation

---

### Admin

- Platform administration dashboard
- View platform-wide statistics
- View Job Seeker, Recruiter, and Admin counts
- View company statistics
- View job statistics
- View application statistics
- Search and filter users
- View complete user profiles
- Activate and deactivate user accounts
- Protect Admin accounts from self-deactivation
- Review registered companies
- Search and filter companies
- Verify and unverify companies
- Activate and deactivate companies
- View company details and recruiter information
- View company job statistics
- Search and filter platform jobs
- View detailed job information
- Disable jobs
- Restore jobs as Draft
- Restore jobs as Published
- Prevent job restoration while the company is inactive
- Monitor all platform applications
- Search applications by candidate, job, or company
- Filter applications by status, job, company, and recruiter
- View complete application details
- View candidate, job, company, and recruiter information
- Audit complete application status history

---

## Role-Based Access Control

The application supports three roles:

| Role | Main Access |
| --- | --- |
| Job Seeker | Jobs, profile, saved jobs, applications |
| Recruiter | Dashboard, company, job management, applicants |
| Admin | Dashboard, users, companies, jobs, applications |

Protected backend routes verify:

- JWT authentication
- User existence
- Account active status
- Required role authorization

A disabled user's existing JWT can no longer be used to access protected resources because the backend checks the user's current database status on every protected request.

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Redux Toolkit
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- Zod
- Multer
- Cloudinary
- Helmet
- Express Rate Limit
- CORS

### Deployment

- **Vercel** — Frontend
- **Render** — Backend
- **MongoDB Atlas** — Database
- **Cloudinary** — Resume storage

---

## Architecture

```text
User Browser
     |
     v
React + Vite
Hosted on Vercel
     |
     | HTTPS / REST API
     v
Node.js + Express
Hosted on Render
     |
     +-------------------------+
     |                         |
     v                         v
MongoDB Atlas             Cloudinary
Application Data          Resume Files
```

---

## Authentication Flow

```text
Register / Login
       |
       v
Request Validation
       |
       v
Password Verification
       |
       v
JWT Generated
       |
       v
Token Stored by Frontend
       |
       v
Authorization: Bearer <token>
       |
       v
Protect Middleware
       |
       +--> Verify JWT
       +--> Find User
       +--> Check Account Status
       |
       v
Role Authorization
       |
       v
Protected Resource
```

---

## Application Hiring Workflow

```text
Job Seeker Applies
        |
        v
     Applied
        |
        v
  Under Review
        |
        v
   Shortlisted
      /     \
     /       \
    v         v
 Hired     Rejected
```

A Job Seeker may also withdraw an eligible application.

Every application stage change is stored in the application's status history for tracking and auditing.

---

## Admin Moderation Flow

```text
Admin
  |
  +--> Users
  |      |
  |      +--> Activate
  |      +--> Deactivate
  |
  +--> Companies
  |      |
  |      +--> Verify / Unverify
  |      +--> Activate / Deactivate
  |
  +--> Jobs
  |      |
  |      +--> Disable
  |      +--> Restore as Draft
  |      +--> Restore as Published
  |
  +--> Applications
         |
         +--> Monitor
         +--> Inspect Details
         +--> Audit Status History
```

---

## Security

The backend includes several production security measures:

- Password hashing with bcrypt
- JWT authentication
- JWT expiration
- Role-based authorization
- Disabled-account enforcement
- Zod request validation
- Authentication rate limiting
- Helmet security headers
- Request body size limits
- Restricted CORS origins
- Production-safe error responses
- MongoDB ObjectId validation
- Environment-variable validation
- Production JWT secret strength validation
- Cloudinary-based resume storage
- `.env` files excluded from Git
- Password field excluded from normal MongoDB queries
- Admin self-deactivation protection

---

## Project Structure

```text
job-portal/
|
|-- backend/
|   |-- config/
|   |   |-- cloudinary.js
|   |   `-- db.js
|   |
|   |-- controllers/
|   |   |-- adminController.js
|   |   |-- applicationController.js
|   |   |-- authController.js
|   |   |-- companyController.js
|   |   |-- jobController.js
|   |   |-- profileController.js
|   |   |-- recruiterController.js
|   |   `-- savedJobController.js
|   |
|   |-- middleware/
|   |   |-- authMiddleware.js
|   |   |-- errorMiddleware.js
|   |   |-- securityMiddleware.js
|   |   `-- validateMiddleware.js
|   |
|   |-- models/
|   |
|   |-- routes/
|   |   |-- adminRoutes.js
|   |   |-- applicationRoutes.js
|   |   |-- authRoutes.js
|   |   |-- companyRoutes.js
|   |   |-- jobRoutes.js
|   |   |-- profileRoutes.js
|   |   |-- recruiterRoutes.js
|   |   `-- savedJobRoutes.js
|   |
|   |-- scripts/
|   |-- utils/
|   |-- validators/
|   |
|   |-- .env.example
|   |-- app.js
|   |-- server.js
|   `-- package.json
|
|-- frontend/
|   |-- public/
|   |
|   |-- src/
|   |   |-- api/
|   |   |-- app/
|   |   |-- assets/
|   |   |
|   |   |-- components/
|   |   |   |-- common/
|   |   |   `-- jobs/
|   |   |
|   |   |-- features/
|   |   |   |-- applications/
|   |   |   |-- auth/
|   |   |   |-- jobs/
|   |   |   `-- savedJobs/
|   |   |
|   |   |-- layouts/
|   |   |
|   |   |-- pages/
|   |   |   |-- admin/
|   |   |   |-- auth/
|   |   |   |-- jobseeker/
|   |   |   `-- recruiter/
|   |   |
|   |   `-- routes/
|   |
|   |-- .env.example
|   |-- index.html
|   |-- vite.config.js
|   `-- package.json
|
|-- .gitignore
`-- README.md
```

---

## Main API Routes

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

---

### Profile

```text
GET   /api/profile
PATCH /api/profile/jobseeker
PATCH /api/profile/recruiter
POST  /api/profile/jobseeker/resume
```

---

### Public Jobs

```text
GET /api/jobs
GET /api/jobs/:jobId
```

Recruiters also have protected routes for creating and managing their own job listings.

---

### Job Seeker Applications

```text
POST  /api/applications/jobs/:jobId
GET   /api/applications/my
GET   /api/applications/my/:applicationId
PATCH /api/applications/my/:applicationId/withdraw
```

---

### Recruiter Applications

Recruiters have protected application-management routes for:

- Viewing applicants
- Filtering applicants
- Viewing application details
- Updating application status
- Managing the hiring pipeline

---

### Saved Jobs

```text
GET    /api/saved-jobs
POST   /api/saved-jobs/:jobId
DELETE /api/saved-jobs/:jobId
```

---

### Recruiter Dashboard

```text
GET /api/recruiter/dashboard
```

---

### Admin Dashboard

```text
GET /api/admin/dashboard
```

---

### Admin Users

```text
GET   /api/admin/users
GET   /api/admin/users/:userId
PATCH /api/admin/users/:userId/status
```

---

### Admin Companies

```text
GET   /api/admin/companies
GET   /api/admin/companies/:companyId
PATCH /api/admin/companies/:companyId/verification
PATCH /api/admin/companies/:companyId/status
```

---

### Admin Jobs

```text
GET   /api/admin/jobs
GET   /api/admin/jobs/:jobId
PATCH /api/admin/jobs/:jobId/moderate
```

---

### Admin Applications

```text
GET /api/admin/applications
GET /api/admin/applications/:applicationId
```

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/bhupender2412/job-portal.git
cd job-portal
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Example:

```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

Health endpoint:

```text
http://localhost:5000/api/health
```

---

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## Available Scripts

### Backend

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Create Admin:

```bash
npm run create-admin
```

---

### Frontend

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Production Environment

### Frontend

Vercel environment variable:

```env
VITE_API_URL=https://job-portal-api-o0dr.onrender.com/api
```

---

### Backend

Render environment variables:

```text
NODE_ENV
CLIENT_URL
MONGO_URI
JWT_SECRET
JWT_EXPIRES_IN
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Example production frontend origin:

```text
https://job-portal-topaz-two.vercel.app
```

Sensitive credentials are never stored in the repository.

---

## Deployment Architecture

```text
GitHub
  |
  +-------------------------------+
  |                               |
  v                               v
Vercel                          Render
Frontend                        Backend
  |                               |
  |                               |
  | HTTPS REST API                |
  +------------------------------>|
                                  |
                    +-------------+-------------+
                    |                           |
                    v                           v
              MongoDB Atlas                Cloudinary
```

---

## Production Links

| Service | URL |
| --- | --- |
| Frontend | https://job-portal-topaz-two.vercel.app/ |
| Backend API | https://job-portal-api-o0dr.onrender.com/ |
| API Health | https://job-portal-api-o0dr.onrender.com/api/health |
| GitHub Repository | https://github.com/bhupender2412/job-portal |
| Portfolio | https://bhupender-portfolio-sage.vercel.app/ |

---

## Project Highlights

- Complete MERN full-stack application
- Three-role RBAC architecture
- Job Seeker, Recruiter, and Admin dashboards
- Production JWT authentication
- Recruiter-specific data isolation
- End-to-end job application workflow
- Hiring pipeline with status history
- Cloudinary resume storage
- Saved jobs functionality
- Company management
- Admin user moderation
- Admin company verification
- Admin job moderation
- Platform-wide application monitoring
- Search and filter functionality
- Pagination
- Responsive UI
- Protected frontend routes
- Protected backend APIs
- Production security middleware
- MongoDB Atlas integration
- Render backend deployment
- Vercel frontend deployment

---

## Responsive Design

The application has been tested across:

```text
Desktop
Laptop
Tablet
Mobile
```

The UI includes responsive:

- Navigation
- Forms
- Job cards
- Dashboards
- Filters
- Statistics cards
- Application cards
- Modals
- User management screens
- Company management screens
- Admin moderation pages

---

## Error Handling

The application includes:

- Loading states
- Empty states
- Validation messages
- Authentication errors
- Authorization errors
- Invalid resource handling
- Duplicate record handling
- File upload errors
- Production-safe server errors
- Not Found handling

---

## Future Improvements

Potential future enhancements include:

- Forgot-password email workflow
- Email verification
- Application email notifications
- Interview scheduling
- Recruiter-candidate messaging
- Job recommendations
- Candidate-job matching
- Advanced analytics charts
- Company logo uploads
- Automated unit tests
- Integration tests
- End-to-end testing
- Route-level frontend code splitting
- Notification system

---

## Author

**Bhupender Singh**

Full Stack Developer

**GitHub:**  
https://github.com/bhupender2412

**Portfolio:**  
https://bhupender-portfolio-sage.vercel.app/

---

## License

This project is intended for learning, portfolio demonstration, and educational purposes.