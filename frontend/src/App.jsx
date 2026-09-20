import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Route, Routes } from "react-router-dom";

import { verifySession } from "./features/auth/authSlice";

import MainLayout from "./layouts/MainLayout";

// Public Pages
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";

// Job Seeker Pages
import Profile from "./pages/jobseeker/Profile";
import SavedJobs from "./pages/jobseeker/SavedJobs";
import MyApplications from "./pages/jobseeker/MyApplications";

// Recruiter Pages
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import RecruiterApplicants from "./pages/recruiter/RecruiterApplicants";
import CompanyProfile from "./pages/recruiter/CompanyProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminJobs from "./pages/admin/AdminJobs";

// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import JobSeekerRoute from "./routes/JobSeekerRoute";
import RecruiterRoute from "./routes/RecruiterRoute";
import AdminRoute from "./routes/AdminRoute";

import JobDetails from "./pages/JobDetails";
import ApplicationDetails from "./pages/jobseeker/ApplicationDetails";
import RecruiterApplicantDetails from "./pages/recruiter/RecruiterApplicantDetails";

import AdminUserDetails from "./pages/admin/AdminUserDetails";
import AdminCompanyDetails from "./pages/admin/AdminCompanyDetails";

import AdminJobDetails from "./pages/admin/AdminJobDetails";

import AdminApplications from "./pages/admin/AdminApplications";

import AdminApplicationDetails from "./pages/admin/AdminApplicationDetails";

function App() {
  const dispatch = useDispatch();

  const { token, initialized } = useSelector((state) => state.auth);

  // --------------------------------------------------
  // Restore Existing Login Session
  // --------------------------------------------------

  useEffect(() => {
    if (token && !initialized) {
      dispatch(verifySession());
    }
  }, [token, initialized, dispatch]);

  // --------------------------------------------------
  // Initial Session Loading
  // --------------------------------------------------

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading Job Portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* ------------------------------------------------
            Public Routes
        ------------------------------------------------ */}

        <Route path="/" element={<Home />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route path="/jobs/:jobId" element={<JobDetails />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ------------------------------------------------
            Any Authenticated User
        ------------------------------------------------ */}

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* ------------------------------------------------
            Job Seeker Only
        ------------------------------------------------ */}

        <Route element={<JobSeekerRoute />}>
          <Route path="/saved-jobs" element={<SavedJobs />} />

          <Route path="/applications" element={<MyApplications />} />
          <Route
            path="/applications/:applicationId"
            element={<ApplicationDetails />}
          />
        </Route>

        {/* ------------------------------------------------
            Recruiter Only
        ------------------------------------------------ */}

        <Route element={<RecruiterRoute />}>
          <Route path="/recruiter" element={<RecruiterDashboard />} />

          <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
          <Route
            path="/recruiter/applicants/:applicationId"
            element={<RecruiterApplicantDetails />}
          />

          <Route
            path="/recruiter/applicants"
            element={<RecruiterApplicants />}
          />

          <Route path="/recruiter/company" element={<CompanyProfile />} />
        </Route>

        {/* ------------------------------------------------
            Admin Only
        ------------------------------------------------ */}

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/admin/users" element={<AdminUsers />} />

          <Route path="/admin/companies" element={<AdminCompanies />} />

          <Route path="/admin/jobs" element={<AdminJobs />} />

          <Route path="/admin/users/:userId" element={<AdminUserDetails />} />

          <Route path="/admin/jobs/:jobId" element={<AdminJobDetails />} />

          <Route path="/admin/applications" element={<AdminApplications />} />

          <Route
            path="/admin/applications/:applicationId"
            element={<AdminApplicationDetails />}
          />

          <Route
            path="/admin/companies/:companyId"
            element={<AdminCompanyDetails />}
          />
        </Route>

        {/* ------------------------------------------------
            404
        ------------------------------------------------ */}

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
