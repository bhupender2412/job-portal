import { useState } from "react";

import { Link, NavLink, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../features/auth/authSlice";

function Navbar() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());

    setMobileOpen(false);

    navigate("/", {
      replace: true,
    });
  };

  const navClass = ({ isActive }) => {
    return isActive
      ? "rounded-lg bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700"
      : "rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-700";
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="page-container">
        <div className="flex h-[72px] items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            onClick={closeMobile}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-lg font-black text-white shadow-sm">
              J
            </div>

            <div>
              <p className="text-xl font-black tracking-tight text-slate-900">
                JobPortal
              </p>

              <p className="-mt-1 hidden text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 sm:block">
                Careers connected
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>

            <NavLink to="/jobs" className={navClass}>
              Jobs
            </NavLink>

            {/* Job Seeker */}
            {user?.role === "jobseeker" && (
              <>
                <NavLink to="/saved-jobs" className={navClass}>
                  Saved
                </NavLink>

                <NavLink to="/applications" className={navClass}>
                  Applications
                </NavLink>

                <NavLink to="/profile" className={navClass}>
                  Profile
                </NavLink>
              </>
            )}

            {/* Recruiter */}
            {user?.role === "recruiter" && (
              <>
                <NavLink to="/recruiter" className={navClass}>
                  Dashboard
                </NavLink>

                <NavLink to="/recruiter/jobs" className={navClass}>
                  My Jobs
                </NavLink>

                <NavLink to="/recruiter/applicants" className={navClass}>
                  Applicants
                </NavLink>

                <NavLink to="/recruiter/company" className={navClass}>
                  Company
                </NavLink>
              </>
            )}

            {/* Admin */}
            {user?.role === "admin" && (
              <>
                <NavLink to="/admin" className={navClass}>
                  Admin
                </NavLink>

                <NavLink to="/admin/users" className={navClass}>
                  Users
                </NavLink>

                <NavLink to="/admin/companies" className={navClass}>
                  Companies
                </NavLink>

                <NavLink to="/admin/jobs" className={navClass}>
                  Manage Jobs
                </NavLink>

                <NavLink to="/admin/applications" className={navClass}>
                  Applications
                </NavLink>
              </>
            )}
          </nav>

          {/* Desktop Account */}
          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-black text-indigo-700">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div className="max-w-36">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {user?.name}
                    </p>

                    <p className="text-[11px] font-semibold capitalize text-slate-400">
                      {formatRole(user?.role)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>
                  Sign In
                </NavLink>

                <Link to="/register" className="btn-primary py-2.5">
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-xl font-bold text-slate-700 lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-t border-slate-100 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {/* Public */}
              <MobileLink to="/" onClick={closeMobile}>
                Home
              </MobileLink>

              <MobileLink to="/jobs" onClick={closeMobile}>
                Jobs
              </MobileLink>

              {/* Job Seeker */}
              {user?.role === "jobseeker" && (
                <>
                  <MobileLink to="/saved-jobs" onClick={closeMobile}>
                    Saved Jobs
                  </MobileLink>

                  <MobileLink to="/applications" onClick={closeMobile}>
                    My Applications
                  </MobileLink>

                  <MobileLink to="/profile" onClick={closeMobile}>
                    Profile
                  </MobileLink>
                </>
              )}

              {/* Recruiter */}
              {user?.role === "recruiter" && (
                <>
                  <MobileLink to="/recruiter" onClick={closeMobile}>
                    Recruiter Dashboard
                  </MobileLink>

                  <MobileLink to="/recruiter/jobs" onClick={closeMobile}>
                    My Jobs
                  </MobileLink>

                  <MobileLink to="/recruiter/applicants" onClick={closeMobile}>
                    Applicants
                  </MobileLink>

                  <MobileLink to="/recruiter/company" onClick={closeMobile}>
                    Company
                  </MobileLink>
                </>
              )}

              {/* Admin */}
              {user?.role === "admin" && (
                <>
                  <MobileLink to="/admin" onClick={closeMobile}>
                    Admin Dashboard
                  </MobileLink>

                  <MobileLink to="/admin/users" onClick={closeMobile}>
                    Users
                  </MobileLink>

                  <MobileLink to="/admin/companies" onClick={closeMobile}>
                    Companies
                  </MobileLink>

                  <MobileLink to="/admin/jobs" onClick={closeMobile}>
                    Manage Jobs
                  </MobileLink>

                  <MobileLink to="/admin/applications" onClick={closeMobile}>
                    Applications
                  </MobileLink>
                </>
              )}
            </div>

            {/* Mobile Account */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              {isAuthenticated ? (
                <>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-black text-indigo-700">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {user?.name}
                      </p>

                      <p className="text-xs capitalize text-slate-400">
                        {formatRole(user?.role)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn-secondary w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="btn-secondary"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobile}
                    className="btn-primary"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function MobileLink({ to, onClick, children }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        isActive
          ? "rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700"
          : "rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
      }
    >
      {children}
    </NavLink>
  );
}

function formatRole(role) {
  if (role === "jobseeker") {
    return "Job Seeker";
  }

  if (role === "recruiter") {
    return "Recruiter";
  }

  if (role === "admin") {
    return "Admin";
  }

  return "User";
}

export default Navbar;
