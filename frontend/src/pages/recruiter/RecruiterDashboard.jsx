import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import api from "../../api/api";

function RecruiterDashboard() {
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

  useEffect(() => {
    const loadDashboard =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await api.get(
              "/recruiter/dashboard",
            );

          setDashboard(
            response.data,
          );
        } catch (error) {
          setError(
            error.response?.data
              ?.message ||
              "Failed to load recruiter dashboard",
          );
        } finally {
          setLoading(false);
        }
      };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading recruiter dashboard...
          </p>
        </div>
      </div>
    );
  }

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
    company,
    stats,
    recentJobs,
    recentApplications,
  } = dashboard;

  return (
    <main className="page-shell">
      <div className="page-container">
        {/* Hero */}
        <section className="rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 px-7 py-9 text-white md:px-10 md:py-11">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-200">
                Recruiter Dashboard
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                Manage your hiring pipeline.
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-indigo-100/75">
                Monitor job listings,
                applications and hiring
                progress from one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/recruiter/jobs"
                className="rounded-xl bg-white px-5 py-3 text-sm font-black text-indigo-700 transition hover:bg-indigo-50"
              >
                Manage Jobs
              </Link>

              <Link
                to="/recruiter/applicants"
                className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
              >
                View Applicants
              </Link>
            </div>
          </div>
        </section>

        {/* Company */}
        <section className="portal-card mt-8 p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-indigo-100 text-xl font-black text-indigo-700">
                {company?.logoUrl ? (
                  <img
                    src={
                      company.logoUrl
                    }
                    alt={
                      company.name
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  company?.name
                    ?.charAt(0)
                    .toUpperCase() ||
                  "C"
                )}
              </div>

              <div>
                <p className="eyebrow">
                  Company
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  {company?.name ||
                    "No company created"}
                </h2>

                {company && (
                  <p className="mt-1 text-sm text-slate-500">
                    {company.industry ||
                      "Industry not added"}{" "}
                    •{" "}
                    {company.location ||
                      "Location not added"}
                  </p>
                )}
              </div>
            </div>

            {company ? (
              <div className="flex flex-wrap gap-2">
                <span
                  className={
                    company.isVerified
                      ? "badge badge-success"
                      : "badge badge-warning"
                  }
                >
                  {company.isVerified
                    ? "✓ Verified"
                    : "Unverified"}
                </span>

                <span
                  className={
                    company.isActive
                      ? "badge badge-success"
                      : "badge badge-danger"
                  }
                >
                  {company.isActive
                    ? "Active"
                    : "Inactive"}
                </span>

                <Link
                  to="/recruiter/company"
                  className="btn-secondary"
                >
                  Manage Company
                </Link>
              </div>
            ) : (
              <Link
                to="/recruiter/company"
                className="btn-primary"
              >
                Create Company
              </Link>
            )}
          </div>
        </section>

        {/* Job Stats */}
        <section className="mt-8">
          <p className="eyebrow">
            Job Listings
          </p>

          <h2 className="mt-2 section-title">
            Job overview
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              label="Total Jobs"
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
              label="Active"
              value={
                stats.jobs.active
              }
            />
          </div>
        </section>

        {/* Application Stats */}
        <section className="mt-10">
          <p className="eyebrow">
            Hiring Pipeline
          </p>

          <h2 className="mt-2 section-title">
            Applications
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

        {/* Recent */}
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
                to="/recruiter/jobs"
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                View All
              </Link>
            </div>

            {recentJobs.length >
            0 ? (
              <div className="mt-5 divide-y divide-slate-100">
                {recentJobs.map(
                  (job) => (
                    <div
                      key={
                        job._id
                      }
                      className="py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-extrabold text-slate-900">
                            {job.title}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
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

                      <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
                        <span>
                          {
                            job.applicationCount ||
                            0
                          }{" "}
                          applications
                        </span>

                        <span>
                          {formatDate(
                            job.createdAt,
                          )}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <EmptyMini
                text="No job listings yet."
              />
            )}
          </section>

          {/* Recent Applicants */}
          <section className="portal-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">
                  Recent Applicants
                </p>

                <h2 className="mt-2 text-xl font-black text-slate-900">
                  Latest candidates
                </h2>
              </div>

              <Link
                to="/recruiter/applicants"
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                View All
              </Link>
            </div>

            {recentApplications.length >
            0 ? (
              <div className="mt-5 divide-y divide-slate-100">
                {recentApplications.map(
                  (
                    application,
                  ) => (
                    <div
                      key={
                        application._id
                      }
                      className="py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 font-black text-indigo-700">
                            {application
                              .applicant
                              ?.avatar ? (
                              <img
                                src={
                                  application
                                    .applicant
                                    .avatar
                                }
                                alt={
                                  application
                                    .applicant
                                    .name
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              application
                                .applicant
                                ?.name
                                ?.charAt(
                                  0,
                                )
                                .toUpperCase() ||
                              "C"
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-extrabold text-slate-900">
                              {application
                                .applicant
                                ?.name ||
                                "Candidate"}
                            </p>

                            <p className="mt-1 truncate text-sm text-slate-500">
                              {application
                                .job
                                ?.title ||
                                "Job"}
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

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-slate-400">
                          {formatDate(
                            application.appliedAt,
                          )}
                        </span>

                        <Link
                          to={`/recruiter/applicants/${application._id}`}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <EmptyMini
                text="No applications yet."
              />
            )}
          </section>
        </div>

        {/* Quick Actions */}
        <section className="mt-10">
          <p className="eyebrow">
            Quick Actions
          </p>

          <h2 className="mt-2 section-title">
            Recruiter tools
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <QuickAction
              title="Manage Jobs"
              description="Create, edit, publish and close your listings."
              to="/recruiter/jobs"
              action="Open Jobs"
            />

            <QuickAction
              title="Review Applicants"
              description="Inspect candidates and update hiring stages."
              to="/recruiter/applicants"
              action="Open Applicants"
            />

            <QuickAction
              title="Company Profile"
              description="Maintain your public company information."
              to="/recruiter/company"
              action="Manage Company"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

// --------------------------------------------------
// Components
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

function QuickAction({
  title,
  description,
  to,
  action,
}) {
  return (
    <article className="portal-card portal-card-hover p-6">
      <h3 className="text-xl font-black text-slate-900">
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
    status === "closed"
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
    status === "rejected" ||
    status === "withdrawn"
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

export default RecruiterDashboard;