# JobPortal

A production-ready full-stack job portal built with the MERN stack.

JobPortal provides separate workflows for **Job Seekers, Recruiters, and Administrators**, including job discovery, applications, recruiter hiring pipelines, company management, resume uploads, role-based access control, and platform moderation.

## Live Demo

**Frontend:**  
https://job-portal-topaz-two.vercel.app/

**Backend API:**  
https://job-portal-api-o0dr.onrender.com/

**API Health:**  
https://job-portal-api-o0dr.onrender.com/api/health

---

## Features

### Job Seeker

- Register and login securely
- Browse published jobs
- Search and filter job listings
- View complete job details
- Maintain professional profile
- Upload resume using Cloudinary
- Save and remove saved jobs
- Apply for jobs
- Add cover letters
- Track submitted applications
- View application status history
- Withdraw eligible applications

### Recruiter

- Recruiter-specific dashboard
- Create and manage company profile
- Create job drafts
- Edit job listings
- Publish and close jobs
- Manage recruiter-owned jobs
- Review applicants
- View candidate profiles and resumes
- Search and filter applications
- Move candidates through hiring stages
- Shortlist candidates
- Hire or reject candidates
- Track hiring statistics

### Admin

- Platform administration dashboard
- View platform statistics
- Manage user accounts
- Activate and deactivate users
- Review companies
- Verify and unverify companies
- Activate and deactivate companies
- Moderate job listings
- Disable and restore jobs
- Restore jobs as draft or published
- Monitor platform-wide applications
- View detailed candidate, recruiter, company, and job information
- Audit application status history

---

## Role-Based Access Control

The application supports three roles:

| Role | Main Access |
| --- | --- |
| Job Seeker | Jobs, profile, saved jobs, applications |
| Recruiter | Company, job management, applicants, hiring workflow |
| Admin | Users, companies, jobs, applications, platform moderation |

Protected backend routes verify:

- JWT authentication
- User existence
- Account active status
- Required role authorization

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
- JWT
- bcryptjs
- Zod
- Multer
- Cloudinary
- Helmet
- Express Rate Limit

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database
- Cloudinary — Resume storage

---

## Architecture

```text
User Browser
     |
     v
React + Vite
Vercel
     |
     | HTTPS / REST API
     v
Node.js + Express
Render
     |
     +----------------------+
     |                      |
     v                      v
MongoDB Atlas          Cloudinary
Application Data       Resume Files