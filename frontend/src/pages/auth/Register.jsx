import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  clearAuthError,
  registerUser,
} from "../../features/auth/authSlice";

function Register() {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

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
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "jobseeker",
    });

  const [
    localError,
    setLocalError,
  ] = useState("");

  const [
    backendErrors,
    setBackendErrors,
  ] = useState([]);

  // ------------------------------------------------
  // Redirect Logged In User
  // ------------------------------------------------

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    navigate,
  ]);

  // ------------------------------------------------
  // Clear Previous Error
  // ------------------------------------------------

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

  // ------------------------------------------------
  // Input Change
  // ------------------------------------------------

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

      setBackendErrors(
        [],
      );
    };

  // ------------------------------------------------
  // Submit
  // ------------------------------------------------

  const handleSubmit =
    async (
      event,
    ) => {
      event.preventDefault();

      setLocalError("");

      setBackendErrors(
        [],
      );

      const name =
        formData.name.trim();

      const email =
        formData.email
          .trim();

      const phone =
        formData.phone
          .trim();

      const password =
        formData.password;

      if (
        !name ||
        !email ||
        !phone ||
        !password
      ) {
        setLocalError(
          "Please complete all required fields",
        );

        return;
      }

      if (
        name.length < 2
      ) {
        setLocalError(
          "Name must be at least 2 characters",
        );

        return;
      }

      if (
        phone.length < 10
      ) {
        setLocalError(
          "Enter a valid phone number",
        );

        return;
      }

      if (
        password.length < 6
      ) {
        setLocalError(
          "Password must be at least 6 characters",
        );

        return;
      }

      if (
        password !==
        formData.confirmPassword
      ) {
        setLocalError(
          "Passwords do not match",
        );

        return;
      }

      try {
        await dispatch(
          registerUser({
            name,
            email,
            phone,
            password,

            role:
              formData.role,
          }),
        ).unwrap();
      } catch (registerError) {
        setBackendErrors(
          registerError?.errors ||
            [],
        );
      }
    };

  return (
    <main className="page-shell">
      <div className="page-container">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left */}
          <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-8 text-white md:p-10 lg:p-12">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-200">
              Join Job Portal
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight">
              Build your next career
              connection.
            </h1>

            <p className="mt-5 max-w-md leading-7 text-indigo-100/80">
              Create an account as a
              Job Seeker or Recruiter
              and access tools designed
              for your role.
            </p>

            <div className="mt-10 space-y-4">
              <Feature
                title="Job Seekers"
                text="Discover opportunities, save jobs, apply with your resume and track progress."
              />

              <Feature
                title="Recruiters"
                text="Create a company profile, publish jobs and manage candidates."
              />

              <Feature
                title="Secure Accounts"
                text="Role-based access and JWT authentication protect each workflow."
              />
            </div>
          </section>

          {/* Registration Form */}
          <section className="p-8 md:p-10 lg:p-12">
            <p className="eyebrow">
              Create Account
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Get started
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Select your account type
              and enter your details.
            </p>

            {/* Role Selection */}
            <div className="mt-7 grid grid-cols-2 gap-3">
              <RoleButton
                label="Job Seeker"
                value="jobseeker"
                selected={
                  formData.role ===
                  "jobseeker"
                }
                onClick={() =>
                  setFormData(
                    (current) => ({
                      ...current,
                      role:
                        "jobseeker",
                    }),
                  )
                }
              />

              <RoleButton
                label="Recruiter"
                value="recruiter"
                selected={
                  formData.role ===
                  "recruiter"
                }
                onClick={() =>
                  setFormData(
                    (current) => ({
                      ...current,
                      role:
                        "recruiter",
                    }),
                  )
                }
              />
            </div>

            {(localError ||
              error) && (
              <div className="alert-error mt-6">
                {localError ||
                  error}
              </div>
            )}

            {backendErrors.length >
              0 && (
              <div className="alert-error mt-4">
                <ul className="space-y-1">
                  {backendErrors.map(
                    (
                      item,
                      index,
                    ) => (
                      <li
                        key={`${item.field}-${index}`}
                      >
                        {item.message}
                      </li>
                    ),
                  )}
                </ul>
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
                  htmlFor="name"
                  className="form-label"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Your full name"
                  autoComplete="name"
                  className="form-input"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
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
                    htmlFor="phone"
                    className="form-label"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="9876543210"
                    autoComplete="tel"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
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
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    className="form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="form-label"
                  >
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={
                      formData.confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    className="form-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  loading
                }
                className="btn-primary w-full"
              >
                {loading
                  ? "Creating Account..."
                  : formData.role ===
                      "recruiter"
                    ? "Create Recruiter Account"
                    : "Create Job Seeker Account"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an
              account?{" "}
              <Link
                to="/login"
                className="font-bold text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-4 text-center text-xs text-slate-400">
              Admin accounts cannot
              be created through public
              registration.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

function RoleButton({
  label,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-4 text-left transition ${
        selected
          ? "border-indigo-500 bg-indigo-50 ring-4 ring-indigo-100"
          : "border-slate-200 bg-white hover:border-indigo-300"
      }`}
    >
      <span
        className={`text-sm font-extrabold ${
          selected
            ? "text-indigo-700"
            : "text-slate-800"
        }`}
      >
        {label}
      </span>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {label ===
        "Job Seeker"
          ? "Find jobs and manage applications"
          : "Post jobs and hire candidates"}
      </p>
    </button>
  );
}

function Feature({
  title,
  text,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="font-bold text-white">
        {title}
      </p>

      <p className="mt-1 text-sm leading-6 text-indigo-100/70">
        {text}
      </p>
    </div>
  );
}

export default Register;