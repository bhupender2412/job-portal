import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import api from "../../api/api";

function AdminDashboard() {
  const [
    dashboard,
    setDashboard,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // --------------------------------------------------
  // Load Dashboard
  // --------------------------------------------------

  useEffect(() => {
    const loadDashboard =
      async () => {
        try {
          setLoading(true);

          setError("");

          const response =
            await api.get(
              "/admin/dashboard",
            );

          setDashboard(
            response.data,
          );
        } catch (error) {
          setError(
            error.response?.data
              ?.message ||
              "Failed to load Admin dashboard",
          );
        } finally {
          setLoading(false);
        }
      };

    loadDashboard();
  }, []);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading Admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (
    error ||
    !dashboard
  ) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <div className="alert-error">
            {error ||
              "Dashboard could not be loaded."}
          </div>
        </div>
      </main>
    );
  }

  const {
    stats,
    recentJobs,
    recentApplications,
  } = dashboard;

  return (
    <main className="page-shell">
      <div className="page-container">
        {/* ------------------------------------------------
            Hero
        ------------------------------------------------ */}

        <section className="rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 px-7 py-9 text-white md:px-10 md:py-11">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-200">
                Administration
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                JobPortal Admin Dashboard
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-indigo-100/75">
                Monitor users,
                recruiters, companies,
                jobs and platform hiring
                activity from one central
                dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/users"
                className="rounded-xl bg-white px-5 py-3 text-sm font-black text-indigo-700 transition hover:bg-indigo-50"
              >
                Manage Users
              </Link>

              <Link
                to="/admin/companies"
                className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Review Companies
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------
            Main Platform Stats
        ------------------------------------------------ */}

        <section className="mt-8">
          <p className="eyebrow">
            Platform Overview
          </p>

          <h2 className="mt-2 section-title">
            Core statistics
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MainStatCard
              label="Total Users"
              value={
                stats.users.total
              }
              detail={`${stats.users.active} active`}
            />

            <MainStatCard
              label="Companies"
              value={
                stats.companies
                  .total
              }
              detail={`${stats.companies.verified} verified`}
            />

            <MainStatCard
              label="Jobs"
              value={
                stats.jobs.total
              }
              detail={`${stats.jobs.published} published`}
            />

            <MainStatCard
              label="Applications"
              value={
                stats.applications
                  .total
              }
              detail={`${stats.applications.hired} hired`}
            />
          </div>
        </section>

        {/* ------------------------------------------------
            Users
        ------------------------------------------------ */}

        <DashboardSection
          eyebrow="Users"
          title="User accounts"
        >
          <StatCard
            label="Job Seekers"
            value={
              stats.users
                .jobSeekers
            }
          />

          <StatCard
            label="Recruiters"
            value={
              stats.users
                .recruiters
            }
          />

          <StatCard
            label="Admins"
            value={
              stats.users.admins
            }
          />

          <StatCard
            label="Active"
            value={
              stats.users.active
            }
          />

          <StatCard
            label="Inactive"
            value={
              stats.users.inactive
            }
          />
        </DashboardSection>

        {/* ------------------------------------------------
            Companies
        ------------------------------------------------ */}

        <DashboardSection
          eyebrow="Companies"
          title="Company moderation"
        >
          <StatCard
            label="Total"
            value={
              stats.companies
                .total
            }
          />

          <StatCard
            label="Verified"
            value={
              stats.companies
                .verified
            }
          />

          <StatCard
            label="Unverified"
            value={
              stats.companies
                .unverified
            }
          />

          <StatCard
            label="Active"
            value={
              stats.companies
                .active
            }
          />

          <StatCard
            label="Inactive"
            value={
              stats.companies
                .inactive
            }
          />
        </DashboardSection>

        {/* ------------------------------------------------
            Jobs
        ------------------------------------------------ */}

        <DashboardSection
          eyebrow="Job Listings"
          title="Job moderation"
        >
          <StatCard
            label="Total"
            value={
              stats.jobs.total
            }
          />

          <StatCard
            label="Published"
            value={
              stats.jobs.published
            }
          />

          <StatCard
            label="Draft"
            value={
              stats.jobs.draft
            }
          />

          <StatCard
            label="Closed"
            value={
              stats.jobs.closed
            }
          />

          <StatCard
            label="Inactive"
            value={
              stats.jobs.inactive
            }
          />
        </DashboardSection>

        {/* ------------------------------------------------
            Applications
        ------------------------------------------------ */}

        <section className="mt-10">
          <p className="eyebrow">
            Hiring Activity
          </p>

          <h2 className="mt-2 section-title">
            Application pipeline
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            <StatCard
              label="Total"
              value={
                stats.applications
                  .total
              }
            />

            <StatCard
              label="Applied"
              value={
                stats.applications
                  .applied
              }
            />

            <StatCard
              label="Under Review"
              value={
                stats.applications
                  .underReview
              }
            />

            <StatCard
              label="Shortlisted"
              value={
                stats.applications
                  .shortlisted
              }
            />

            <StatCard
              label="Hired"
              value={
                stats.applications
                  .hired
              }
            />

            <StatCard
              label="Rejected"
              value={
                stats.applications
                  .rejected
              }
            />

            <StatCard
              label="Withdrawn"
              value={
                stats.applications
                  .withdrawn
              }
            />
          </div>
        </section>

        {/* ------------------------------------------------
            Recent Activity
        ------------------------------------------------ */}

        <div className="mt-10 grid gap-7 xl:grid-cols-2">
          {/* Recent Jobs */}

          <section className="portal-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">
                  Recent Jobs
                </p>

                <h2 className="mt-2 text-xl font-black text-slate-900">
                  Latest listings
                </h2>
              </div>

              <Link
                to="/admin/jobs"
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                Manage Jobs
              </Link>
            </div>

            {recentJobs?.length >
            0 ? (
              <div className="mt-5 divide-y divide-slate-100">
                {recentJobs.map(
                  (job) => (
                    <RecentJob
                      key={
                        job._id
                      }
                      job={
                        job
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <EmptyMini
                text="No jobs available."
              />
            )}
          </section>

          {/* Recent Applications */}

          <section className="portal-card p-6">
            <div>
              <p className="eyebrow">
                Recent Applications
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-900">
                Latest hiring activity
              </h2>
            </div>

            {recentApplications
              ?.length > 0 ? (
              <div className="mt-5 divide-y divide-slate-100">
                {recentApplications.map(
                  (
                    application,
                  ) => (
                    <RecentApplication
                      key={
                        application._id
                      }
                      application={
                        application
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <EmptyMini
                text="No applications available."
              />
            )}
          </section>
        </div>

        {/* ------------------------------------------------
            Admin Tools
        ------------------------------------------------ */}

        <section className="mt-10">
          <p className="eyebrow">
            Administration
          </p>

          <h2 className="mt-2 section-title">
            Platform management
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <AdminAction
              title="Users"
              description="Review Job Seekers, Recruiters and account activity."
              to="/admin/users"
              action="Manage Users"
            />

            <AdminAction
              title="Companies"
              description="Verify companies and manage company access."
              to="/admin/companies"
              action="Manage Companies"
            />

            <AdminAction
              title="Job Listings"
              description="Review, disable and restore platform job listings."
              to="/admin/jobs"
              action="Manage Jobs"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

// --------------------------------------------------
// Main Stat Card
// --------------------------------------------------

function MainStatCard({
  label,
  value,
  detail,
}) {
  return (
    <article className="portal-card portal-card-hover p-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-4xl font-black text-slate-900">
        {value ?? 0}
      </p>

      <p className="mt-2 text-sm font-semibold text-indigo-600">
        {detail}
      </p>
    </article>
  );
}

// --------------------------------------------------
// Dashboard Section
// --------------------------------------------------

function DashboardSection({
  eyebrow,
  title,
  children,
}) {
  return (
    <section className="mt-10">
      <p className="eyebrow">
        {eyebrow}
      </p>

      <h2 className="mt-2 section-title">
        {title}
      </h2>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {children}
      </div>
    </section>
  );
}

// --------------------------------------------------
// Stat Card
// --------------------------------------------------

function StatCard({
  label,
  value,
}) {
  return (
    <article className="portal-card p-5">
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-slate-900">
        {value ?? 0}
      </p>
    </article>
  );
}

// --------------------------------------------------
// Recent Job
// --------------------------------------------------

function RecentJob({
  job,
}) {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-extrabold text-slate-900">
            {job.title}
          </p>

          <p className="mt-1 text-sm font-semibold text-indigo-600">
            {job.company?.name ||
              "Company"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {job.location} •{" "}
            {formatValue(
              job.workMode,
            )}
          </p>
        </div>

        <span
          className={jobStatusClass(
            job.status,
          )}
        >
          {formatValue(
            job.status,
          )}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-400">
        <span>
          {job.applicationCount ||
            0}{" "}
          applications
        </span>

        <span>
          Recruiter:{" "}
          {job.recruiter?.name ||
            "—"}
        </span>

        <span>
          {formatDate(
            job.createdAt,
          )}
        </span>
      </div>
    </div>
  );
}

// --------------------------------------------------
// Recent Application
// --------------------------------------------------

function RecentApplication({
  application,
}) {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-black text-indigo-700">
            {application
              .applicant
              ?.name
              ?.charAt(0)
              .toUpperCase() ||
              "C"}
          </div>

          <div className="min-w-0">
            <p className="truncate font-extrabold text-slate-900">
              {application
                .applicant
                ?.name ||
                "Candidate"}
            </p>

            <p className="mt-1 truncate text-sm text-slate-500">
              {application.job
                ?.title ||
                "Job"}
            </p>

            <p className="mt-1 truncate text-xs font-semibold text-indigo-600">
              {application.company
                ?.name ||
                "Company"}
            </p>
          </div>
        </div>

        <span
          className={applicationStatusClass(
            application.status,
          )}
        >
          {formatValue(
            application.status,
          )}
        </span>
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-400">
        {formatDate(
          application.appliedAt,
        )}
      </p>
    </div>
  );
}

// --------------------------------------------------
// Admin Action
// --------------------------------------------------

function AdminAction({
  title,
  description,
  to,
  action,
}) {
  return (
    <article className="portal-card portal-card-hover p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 font-black text-indigo-700">
        {title
          .charAt(0)
          .toUpperCase()}
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <Link
        to={to}
        className="btn-primary mt-5"
      >
        {action}
      </Link>
    </article>
  );
}

function EmptyMini({
  text,
}) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-slate-200 px-5 py-8 text-center text-sm font-semibold text-slate-400">
      {text}
    </div>
  );
}

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function formatValue(
  value,
) {
  if (!value) {
    return "—";
  }

  return value
    .split("-")
    .map(
      (part) =>
        part
          .charAt(0)
          .toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

function formatDate(
  value,
) {
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

function jobStatusClass(
  status,
) {
  if (
    status ===
    "published"
  ) {
    return "badge badge-success";
  }

  if (
    status ===
    "closed"
  ) {
    return "badge badge-danger";
  }

  return "badge badge-warning";
}

function applicationStatusClass(
  status,
) {
  if (
    status === "hired"
  ) {
    return "badge badge-success";
  }

  if (
    status ===
      "rejected" ||
    status ===
      "withdrawn"
  ) {
    return "badge badge-danger";
  }

  if (
    status ===
      "under-review" ||
    status ===
      "shortlisted"
  ) {
    return "badge badge-warning";
  }

  return "badge badge-primary";
}

export default AdminDashboard;