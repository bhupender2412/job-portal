import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

import api from "../../api/api";

function AdminUserDetails() {
  const {
    userId,
  } = useParams();

  const {
    user: authUser,
  } = useSelector(
    (state) => state.auth,
  );

  const [
    user,
    setUser,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    updating,
    setUpdating,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const currentUserId =
    authUser?.id ||
    authUser?._id;

  const isCurrentUser =
    userId ===
    currentUserId;

  // --------------------------------------------------
  // Load User
  // --------------------------------------------------

  const loadUser =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            `/admin/users/${userId}`,
          );

        setUser(
          response.data.user,
        );
      } catch (error) {
        setUser(null);

        setError(
          error.response?.data
            ?.message ||
            "Failed to load user",
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadUser();
  }, [userId]);

  // --------------------------------------------------
  // Status
  // --------------------------------------------------

  const handleStatus =
    async () => {
      if (
        isCurrentUser
      ) {
        setError(
          "You cannot change your own account status.",
        );

        return;
      }

      const nextStatus =
        !user.isActive;

      const confirmed =
        window.confirm(
          nextStatus
            ? `Activate ${user.name}'s account?`
            : `Deactivate ${user.name}'s account?`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setUpdating(true);

        setMessage("");
        setError("");

        const response =
          await api.patch(
            `/admin/users/${userId}/status`,
            {
              isActive:
                nextStatus,
            },
          );

        setMessage(
          response.data
            .message ||
            "Account status updated successfully",
        );

        await loadUser();
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to update account status",
        );
      } finally {
        setUpdating(false);
      }
    };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading user...
          </p>
        </div>
      </div>
    );
  }

  if (
    error &&
    !user
  ) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <div className="empty-state">
            <h1 className="text-3xl font-black text-slate-900">
              User unavailable
            </h1>

            <p className="mt-3 text-slate-500">
              {error}
            </p>

            <Link
              to="/admin/users"
              className="btn-primary mt-6"
            >
              Back to Users
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="page-container">
        <Link
          to="/admin/users"
          className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Users
        </Link>

        {message && (
          <div className="alert-success mt-6">
            {message}
          </div>
        )}

        {error && (
          <div className="alert-error mt-6">
            {error}
          </div>
        )}

        {/* Header */}

        <section className="portal-card mt-6 overflow-hidden">
          <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-7 text-white md:p-9">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10 text-2xl font-black">
                  {user.avatar ? (
                    <img
                      src={
                        user.avatar
                      }
                      alt={
                        user.name
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.name
                      ?.charAt(0)
                      .toUpperCase() ||
                    "U"
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-indigo-100">
                      {formatRole(
                        user.role,
                      )}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        user.isActive
                          ? "bg-emerald-400/15 text-emerald-200"
                          : "bg-red-400/15 text-red-200"
                      }`}
                    >
                      {user.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                    {isCurrentUser && (
                      <span className="rounded-full bg-indigo-400/20 px-3 py-1 text-xs font-bold text-indigo-100">
                        Your Account
                      </span>
                    )}
                  </div>

                  <h1 className="mt-4 text-3xl font-black tracking-tight">
                    {user.name}
                  </h1>

                  <p className="mt-2 text-indigo-100/75">
                    {user.email}
                  </p>
                </div>
              </div>

              {!isCurrentUser && (
                <button
                  type="button"
                  disabled={
                    updating
                  }
                  onClick={
                    handleStatus
                  }
                  className={
                    user.isActive
                      ? "rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                      : "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                  }
                >
                  {updating
                    ? "Updating..."
                    : user.isActive
                      ? "Deactivate Account"
                      : "Activate Account"}
                </button>
              )}
            </div>
          </div>
        </section>

        {isCurrentUser && (
          <div className="alert-info mt-6">
            This is your Admin
            account. Its active status
            cannot be changed from the
            Admin panel.
          </div>
        )}

        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_340px]">
          {/* Main */}

          <div className="space-y-7">
            <section className="portal-card p-6 md:p-8">
              <h2 className="text-xl font-black text-slate-900">
                Account Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Detail
                  label="Full Name"
                  value={
                    user.name
                  }
                />

                <Detail
                  label="Email"
                  value={
                    user.email
                  }
                />

                <Detail
                  label="Phone"
                  value={
                    user.phone
                  }
                />

                <Detail
                  label="Role"
                  value={formatRole(
                    user.role,
                  )}
                />

                <Detail
                  label="Joined"
                  value={formatDateTime(
                    user.createdAt,
                  )}
                />

                <Detail
                  label="Last Login"
                  value={formatDateTime(
                    user.lastLoginAt,
                  )}
                />
              </div>
            </section>

            {/* Job Seeker */}

            {user.role ===
              "jobseeker" && (
              <section className="portal-card p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900">
                  Job Seeker Profile
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Detail
                    label="Headline"
                    value={
                      user.headline
                    }
                  />

                  <Detail
                    label="Location"
                    value={
                      user.location
                    }
                  />

                  <Detail
                    label="Experience"
                    value={`${user.experienceYears ?? 0} years`}
                  />

                  <Detail
                    label="Education"
                    value={
                      user.education
                    }
                  />
                </div>

                {user.bio && (
                  <div className="mt-7 border-t border-slate-100 pt-6">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                      About
                    </p>

                    <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                      {user.bio}
                    </p>
                  </div>
                )}

                {user.skills
                  ?.length >
                  0 && (
                  <div className="mt-7 border-t border-slate-100 pt-6">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                      Skills
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {user.skills.map(
                        (
                          skill,
                        ) => (
                          <span
                            key={
                              skill
                            }
                            className="badge badge-primary"
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Recruiter */}

            {user.role ===
              "recruiter" && (
              <section className="portal-card p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900">
                  Recruiter Profile
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Detail
                    label="Company Name"
                    value={
                      user.companyName
                    }
                  />

                  <Detail
                    label="Designation"
                    value={
                      user.designation
                    }
                  />

                  <Detail
                    label="Location"
                    value={
                      user.location
                    }
                  />
                </div>

                {user.bio && (
                  <div className="mt-7 border-t border-slate-100 pt-6">
                    <Detail
                      label="Bio"
                      value={
                        user.bio
                      }
                    />
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}

          <aside className="space-y-6">
            <section className="portal-card p-6">
              <p className="eyebrow">
                Account Status
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-900">
                Access
              </h2>

              <div className="mt-5">
                <span
                  className={
                    user.isActive
                      ? "badge badge-success"
                      : "badge badge-danger"
                  }
                >
                  {user.isActive
                    ? "Active Account"
                    : "Inactive Account"}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                {user.isActive
                  ? "This user can currently access the platform according to their role."
                  : "This account has been disabled by platform administration."}
              </p>
            </section>

            {user.role ===
              "jobseeker" && (
              <section className="portal-card p-6">
                <h2 className="font-black text-slate-900">
                  Resume
                </h2>

                {user.resumeUrl ? (
                  <a
                    href={
                      user.resumeUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary mt-5 w-full"
                  >
                    View Resume
                  </a>
                ) : (
                  <div className="alert-info mt-5">
                    No resume uploaded.
                  </div>
                )}
              </section>
            )}

            <section className="portal-card p-6">
              <h2 className="font-black text-slate-900">
                Record Information
              </h2>

              <div className="mt-5 space-y-4">
                <Detail
                  label="User ID"
                  value={
                    user._id
                  }
                />

                <Detail
                  label="Last Updated"
                  value={formatDateTime(
                    user.updatedAt,
                  )}
                />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-slate-700">
        {value || "Not added"}
      </p>
    </div>
  );
}

function formatRole(role) {
  if (
    role === "jobseeker"
  ) {
    return "Job Seeker";
  }

  if (
    role === "recruiter"
  ) {
    return "Recruiter";
  }

  if (
    role === "admin"
  ) {
    return "Admin";
  }

  return "User";
}

function formatDateTime(
  value,
) {
  if (!value) {
    return "Never";
  }

  return new Date(
    value,
  ).toLocaleString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  );
}

export default AdminUserDetails;