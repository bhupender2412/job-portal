import {
  Link,
} from "react-router-dom";

function Footer() {
  const year =
    new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="page-container py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-black text-white">
                J
              </div>

              <p className="text-lg font-black text-slate-900">
                JobPortal
              </p>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              Connecting talented
              professionals with modern
              companies and meaningful
              opportunities.
            </p>
          </div>

          <div>
            <p className="font-extrabold text-slate-900">
              Explore
            </p>

            <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-slate-500">
              <Link
                to="/jobs"
                className="hover:text-indigo-600"
              >
                Browse Jobs
              </Link>

              <Link
                to="/register"
                className="hover:text-indigo-600"
              >
                Create Account
              </Link>

              <Link
                to="/login"
                className="hover:text-indigo-600"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div>
            <p className="font-extrabold text-slate-900">
              Platform
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Built with React,
              Node.js, Express,
              MongoDB and modern
              role-based authentication.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-400">
          © {year} JobPortal.
          All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;