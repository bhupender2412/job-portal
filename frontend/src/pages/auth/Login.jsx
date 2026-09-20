import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  clearAuthError,
  loginUser,
} from "../../features/auth/authSlice";

function Login() {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    loading,
    error,
    isAuthenticated,
  } = useSelector(
    (state) =>
      state.auth,
  );

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [localError, setLocalError] =
    useState("");

  // ----------------------------------------------
  // Redirect Already Logged In User
  // ----------------------------------------------

  useEffect(() => {
    if (isAuthenticated) {
      const from =
        location.state?.from
          ?.pathname ||
        "/";

      navigate(
        from,
        {
          replace: true,
        },
      );
    }
  }, [
    isAuthenticated,
    location,
    navigate,
  ]);

  // ----------------------------------------------
  // Clear Previous Auth Error
  // ----------------------------------------------

  useEffect(() => {
    dispatch(
      clearAuthError(),
    );

    return () => {
      dispatch(
        clearAuthError(),
      );
    };
  }, [dispatch]);

  const handleChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setFormData(
        (current) => ({
          ...current,

          [name]:
            value,
        }),
      );

      setLocalError("");
    };

  const handleSubmit =
    async (
      event,
    ) => {
      event.preventDefault();

      setLocalError("");

      const email =
        formData.email
          .trim();

      const password =
        formData.password;

      if (
        !email ||
        !password
      ) {
        setLocalError(
          "Email and password are required",
        );

        return;
      }

      try {
        await dispatch(
          loginUser({
            email,
            password,
          }),
        ).unwrap();
      } catch {
        // Redux already stores
        // the backend error.
      }
    };

  return (
    <main className="page-shell">
      <div className="page-container">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
          {/* Left */}
          <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-8 text-white md:p-10 lg:p-12">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-200">
              Welcome Back
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight">
              Continue your career journey.
            </h1>

            <p className="mt-5 max-w-md leading-7 text-indigo-100/80">
              Sign in to discover jobs,
              manage applications, recruit
              talent or administer the
              platform.
            </p>

            <div className="mt-10 space-y-4">
              <Feature text="Search and save relevant opportunities" />

              <Feature text="Track your application progress" />

              <Feature text="Manage hiring workflows as a recruiter" />
            </div>
          </section>

          {/* Form */}
          <section className="p-8 md:p-10 lg:p-12">
            <p className="eyebrow">
              Account
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Sign in
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your registered email
              and password.
            </p>

            {(localError ||
              error) && (
              <div className="alert-error mt-6">
                {localError ||
                  error}
              </div>
            )}

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-7 space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="form-label"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="form-input"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="form-label"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={
                  loading
                }
                className="btn-primary w-full"
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              New to the platform?{" "}
              <Link
                to="/register"
                className="font-bold text-indigo-600 hover:text-indigo-700"
              >
                Create an account
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

function Feature({
  text,
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-black text-indigo-200">
        ✓
      </span>

      <p className="text-sm leading-6 text-indigo-100/80">
        {text}
      </p>
    </div>
  );
}

export default Login;