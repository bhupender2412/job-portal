import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

import api from "../../api/api";

function AdminUsers() {
  const {
    user: authUser,
  } = useSelector(
    (state) => state.auth,
  );

  const [
    users,
    setUsers,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    role,
    setRole,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    pages,
    setPages,
  ] = useState(1);

  const [
    total,
    setTotal,
  ] = useState(0);

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

  // --------------------------------------------------
  // Load Users
  // --------------------------------------------------

  useEffect(() => {
    const timer =
      setTimeout(
        async () => {
          try {
            setLoading(true);
            setError("");

            const params = {
              page,
              limit: 8,
            };

            if (
              search.trim()
            ) {
              params.search =
                search.trim();
            }

            if (role) {
              params.role =
                role;
            }

            if (status) {
              params.isActive =
                status;
            }

            const response =
              await api.get(
                "/admin/users",
                {
                  params,
                },
              );

            setUsers(
              response.data.users ||
                [],
            );

            setPage(
              response.data.page ||
                1,
            );

            setPages(
              response.data.pages ||
                1,
            );

            setTotal(
              response.data.total ||
                0,
            );
          } catch (error) {
            setUsers([]);

            setError(
              error.response?.data
                ?.message ||
                "Failed to load users",
            );
          } finally {
            setLoading(false);
          }
        },
        300,
      );

    return () =>
      clearTimeout(timer);
  }, [
    search,
    role,
    status,
    page,
  ]);

  // --------------------------------------------------
  // Change User Status
  // --------------------------------------------------

  const handleStatus =
    async (
      user,
    ) => {
      if (
        user._id ===
        currentUserId
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
            : `Deactivate ${user.name}'s account? They will no longer be able to use protected platform features.`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(
          user._id,
        );

        setMessage("");
        setError("");

        const response =
          await api.patch(
            `/admin/users/${user._id}/status`,
            {
              isActive:
                nextStatus,
            },
          );

        setUsers(
          (current) =>
            current.map(
              (item) =>
                item._id ===
                user._id
                  ? {
                      ...item,
                      isActive:
                        nextStatus,
                    }
                  : item,
            ),
        );

        setMessage(
          response.data
            .message ||
            `User ${
              nextStatus
                ? "activated"
                : "deactivated"
            } successfully`,
        );
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to update user status",
        );
      } finally {
        setActionLoading("");
      }
    };

  // --------------------------------------------------
  // Clear Filters
  // --------------------------------------------------

  const clearFilters =
    () => {
      setSearch("");
      setRole("");
      setStatus("");
      setPage(1);
    };

  return (
    <main className="page-shell">
      <div className="page-container">
        {/* Hero */}

        <section className="rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 px-7 py-9 text-white md:px-10 md:py-11">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-200">
            Administration
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            User Management
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-indigo-100/75">
            Review platform accounts,
            inspect user information and
            control account access.
          </p>
        </section>

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

        {/* Filters */}

        <section className="portal-card mt-8 p-5 md:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
            <div>
              <label
                htmlFor="search"
                className="form-label"
              >
                Search
              </label>

              <input
                id="search"
                value={search}
                onChange={(
                  event,
                ) => {
                  setSearch(
                    event.target.value,
                  );

                  setPage(1);
                }}
                placeholder="Name, email, phone..."
                className="form-input"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="form-label"
              >
                Role
              </label>

              <select
                id="role"
                value={role}
                onChange={(
                  event,
                ) => {
                  setRole(
                    event.target.value,
                  );

                  setPage(1);
                }}
                className="form-select"
              >
                <option value="">
                  All Roles
                </option>

                <option value="jobseeker">
                  Job Seekers
                </option>

                <option value="recruiter">
                  Recruiters
                </option>

                <option value="admin">
                  Admins
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="form-label"
              >
                Account Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(
                  event,
                ) => {
                  setStatus(
                    event.target.value,
                  );

                  setPage(1);
                }}
                className="form-select"
              >
                <option value="">
                  All Accounts
                </option>

                <option value="true">
                  Active
                </option>

                <option value="false">
                  Inactive
                </option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="btn-secondary w-full"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Results Header */}

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              Accounts
            </p>

            <h2 className="mt-2 section-title">
              Platform users
            </h2>
          </div>

          <p className="text-sm font-semibold text-slate-500">
            {total}{" "}
            {total === 1
              ? "user"
              : "users"}
          </p>
        </div>

        {/* Loading */}

        {loading && (
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading users...
              </p>
            </div>
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          users.length ===
            0 && (
            <div className="empty-state mt-6">
              <h3 className="text-2xl font-black text-slate-900">
                No users found
              </h3>

              <p className="mt-2 text-slate-500">
                Try changing your
                search or account
                filters.
              </p>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="btn-primary mt-6"
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* User Cards */}

        {!loading &&
          users.length >
            0 && (
            <div className="mt-6 space-y-4">
              {users.map(
                (user) => (
                  <UserCard
                    key={
                      user._id
                    }
                    user={user}
                    isCurrentUser={
                      user._id ===
                      currentUserId
                    }
                    loading={
                      actionLoading ===
                      user._id
                    }
                    onStatus={
                      handleStatus
                    }
                  />
                ),
              )}
            </div>
          )}

        {/* Pagination */}

        {!loading &&
          pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={
                  page <= 1
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.max(
                        current -
                          1,
                        1,
                      ),
                  )
                }
                className="btn-secondary"
              >
                Previous
              </button>

              <span className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm">
                Page {page} of{" "}
                {pages}
              </span>

              <button
                type="button"
                disabled={
                  page >= pages
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.min(
                        current +
                          1,
                        pages,
                      ),
                  )
                }
                className="btn-secondary"
              >
                Next
              </button>
            </div>
          )}
      </div>
    </main>
  );
}

// --------------------------------------------------
// User Card
// --------------------------------------------------

function UserCard({
  user,
  isCurrentUser,
  loading,
  onStatus,
}) {
  return (
    <article className="portal-card p-6">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-xl font-black text-indigo-700">
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

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">
                {user.name}
              </h3>

              <span
                className={roleClass(
                  user.role,
                )}
              >
                {formatRole(
                  user.role,
                )}
              </span>

              <span
                className={
                  user.isActive
                    ? "badge badge-success"
                    : "badge badge-danger"
                }
              >
                {user.isActive
                  ? "Active"
                  : "Inactive"}
              </span>

              {isCurrentUser && (
                <span className="badge badge-primary">
                  You
                </span>
              )}
            </div>

            <p className="mt-2 text-sm font-semibold text-slate-600">
              {user.email}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <span>
                <strong className="text-slate-700">
                  Phone:
                </strong>{" "}
                {user.phone ||
                  "Not added"}
              </span>

              <span>
                <strong className="text-slate-700">
                  Joined:
                </strong>{" "}
                {formatDate(
                  user.createdAt,
                )}
              </span>

              <span>
                <strong className="text-slate-700">
                  Last Login:
                </strong>{" "}
                {formatDateTime(
                  user.lastLoginAt,
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            to={`/admin/users/${user._id}`}
            className="btn-primary"
          >
            View Details
          </Link>

          {!isCurrentUser && (
            <button
              type="button"
              disabled={
                loading
              }
              onClick={() =>
                onStatus(user)
              }
              className={
                user.isActive
                  ? "btn-danger"
                  : "btn-secondary"
              }
            >
              {loading
                ? "Updating..."
                : user.isActive
                  ? "Deactivate"
                  : "Activate"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// --------------------------------------------------
// Helpers
// --------------------------------------------------

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

function roleClass(role) {
  if (
    role === "admin"
  ) {
    return "badge badge-danger";
  }

  if (
    role === "recruiter"
  ) {
    return "badge badge-warning";
  }

  return "badge badge-primary";
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Date(
    value,
  ).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
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

export default AdminUsers;