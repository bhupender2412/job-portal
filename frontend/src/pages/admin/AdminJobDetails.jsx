import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../../api/api";

function AdminJobDetails() {
  const {
    jobId,
  } = useParams();

  const [
    job,
    setJob,
  ] = useState(null);

  const [
    applicationStats,
    setApplicationStats,
  ] = useState({
    total: 0,
    applied: 0,
    underReview: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0,
    withdrawn: 0,
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    showRestore,
    setShowRestore,
  ] = useState(false);

  const [
    restoreStatus,
    setRestoreStatus,
  ] = useState("draft");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  // --------------------------------------------------
  // Load Job
  // --------------------------------------------------

  const loadJob =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            `/admin/jobs/${jobId}`,
          );

        setJob(
          response.data.job,
        );

        setApplicationStats(
          response.data
            .applicationStats || {
            total: 0,
            applied: 0,
            underReview: 0,
            shortlisted: 0,
            rejected: 0,
            hired: 0,
            withdrawn: 0,
          },
        );
      } catch (error) {
        setJob(null);

        setError(
          error.response?.data
            ?.message ||
            "Failed to load job",
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadJob();
  }, [jobId]);

  // --------------------------------------------------
  // Disable Job
  // --------------------------------------------------

  const handleDisable =
    async () => {
      const confirmed =
        window.confirm(
          `Disable "${job.title}"? It will be closed and removed from the public job board.`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(true);

        setMessage("");
        setError("");

        const response =
          await api.patch(
            `/admin/jobs/${jobId}/moderate`,
            {
              isActive:
                false,
            },
          );

        setMessage(
          response.data
            .message ||
            "Job disabled successfully",
        );

        await loadJob();
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to disable job",
        );
      } finally {
        setActionLoading(false);
      }
    };

  // --------------------------------------------------
  // Restore Job
  // --------------------------------------------------

  const handleRestore =
    async () => {
      try {
        setActionLoading(true);

        setMessage("");
        setError("");

        const response =
          await api.patch(
            `/admin/jobs/${jobId}/moderate`,
            {
              isActive:
                true,

              status:
                restoreStatus,
            },
          );

        setMessage(
          response.data
            .message ||
            "Job restored successfully",
        );

        setShowRestore(false);

        await loadJob();
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to restore job",
        );
      } finally {
        setActionLoading(false);
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
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (
    error &&
    !job
  ) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <div className="empty-state">
            <h1 className="text-3xl font-black text-slate-900">
              Job unavailable
            </h1>

            <p className="mt-3 text-slate-500">
              {error}
            </p>

            <Link
              to="/admin/jobs"
              className="btn-primary mt-6"
            >
              Back to Jobs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const company =
    job.company;

  const recruiter =
    job.recruiter;

  const canRestore =
    company?.isActive !==
    false;

  return (
    <main className="page-shell">
      <div className="page-container">
        {/* Back */}

        <Link
          to="/admin/jobs"
          className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Jobs
        </Link>

        {/* Feedback */}

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

        {/* ------------------------------------------------
            Header
        ------------------------------------------------ */}

        <section className="portal-card mt-6 overflow-hidden">
          <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-7 text-white md:p-9">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-start">
              <div>
                <div className="flex flex-wrap gap-2">
                  <HeaderBadge>
                    {formatValue(
                      job.status,
                    )}
                  </HeaderBadge>

                  <HeaderBadge>
                    {job.isActive
                      ? "Active"
                      : "Inactive"}
                  </HeaderBadge>

                  {company
                    ?.isVerified && (
                    <HeaderBadge>
                      ✓ Verified Company
                    </HeaderBadge>
                  )}
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                  {job.title}
                </h1>

                <p className="mt-3 text-lg font-semibold text-indigo-200">
                  {company?.name ||
                    "Company unavailable"}
                </p>

                <p className="mt-2 text-sm text-indigo-100/70">
                  {job.location}
                </p>
              </div>

              {/* Moderation Actions */}

              <div className="flex flex-wrap gap-3">
                {job.isActive ? (
                  <button
                    type="button"
                    disabled={
                      actionLoading
                    }
                    onClick={
                      handleDisable
                    }
                    className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading
                      ? "Updating..."
                      : "Disable Job"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={
                      actionLoading ||
                      !canRestore
                    }
                    onClick={() =>
                      setShowRestore(
                        true,
                      )
                    }
                    className="rounded-xl bg-white px-5 py-3 text-sm font-black text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Restore Job
                  </button>
                )}

                {job.status ===
                  "published" &&
                  job.isActive && (
                    <Link
                      to={`/jobs/${job._id}`}
                      className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
                    >
                      Public View
                    </Link>
                  )}
              </div>
            </div>
          </div>

          {/* Quick Info */}

          <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            <InfoBox
              label="Work Mode"
              value={formatValue(
                job.workMode,
              )}
            />

            <InfoBox
              label="Employment"
              value={formatValue(
                job.employmentType,
              )}
            />

            <InfoBox
              label="Experience"
              value={formatValue(
                job.experienceLevel,
              )}
            />

            <InfoBox
              label="Applications"
              value={
                applicationStats.total
              }
            />
          </div>
        </section>

        {/* Inactive Company Warning */}

        {company &&
          !company.isActive && (
          <div className="alert-error mt-6">
            This job belongs to an
            inactive company. Activate
            the company before restoring
            this job.
          </div>
        )}

        {/* Recruiter Warning */}

        {recruiter &&
          !recruiter.isActive && (
          <div className="alert-info mt-6">
            The recruiter who owns this
            job currently has an inactive
            account.
          </div>
        )}

        {/* ------------------------------------------------
            Application Statistics
        ------------------------------------------------ */}

        <section className="mt-8">
          <p className="eyebrow">
            Hiring Activity
          </p>

          <h2 className="mt-2 section-title">
            Application statistics
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            <StatCard
              label="Total"
              value={
                applicationStats.total
              }
            />

            <StatCard
              label="Applied"
              value={
                applicationStats.applied
              }
            />

            <StatCard
              label="Under Review"
              value={
                applicationStats
                  .underReview
              }
            />

            <StatCard
              label="Shortlisted"
              value={
                applicationStats
                  .shortlisted
              }
            />

            <StatCard
              label="Hired"
              value={
                applicationStats.hired
              }
            />

            <StatCard
              label="Rejected"
              value={
                applicationStats.rejected
              }
            />

            <StatCard
              label="Withdrawn"
              value={
                applicationStats
                  .withdrawn
              }
            />
          </div>
        </section>

        {/* ------------------------------------------------
            Main Layout
        ------------------------------------------------ */}

        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_340px]">
          {/* Main */}

          <div className="space-y-7">
            {/* Description */}

            <ContentSection
              title="Job Description"
            >
              <p className="whitespace-pre-line leading-7 text-slate-600">
                {job.description}
              </p>
            </ContentSection>

            {/* Responsibilities */}

            {job.responsibilities
              ?.length >
              0 && (
              <ContentSection
                title="Responsibilities"
              >
                <BulletList
                  items={
                    job.responsibilities
                  }
                />
              </ContentSection>
            )}

            {/* Requirements */}

            {job.requirements
              ?.length >
              0 && (
              <ContentSection
                title="Requirements"
              >
                <BulletList
                  items={
                    job.requirements
                  }
                />
              </ContentSection>
            )}

            {/* Skills */}

            {job.skills?.length >
              0 && (
              <ContentSection
                title="Skills"
              >
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(
                    (skill) => (
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
              </ContentSection>
            )}

            {/* Company */}

            <ContentSection
              title="Company"
            >
              {company ? (
                <>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-100 font-black text-indigo-700">
                      {company.logoUrl ? (
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
                        company.name
                          ?.charAt(0)
                          .toUpperCase() ||
                        "C"
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {company.name}
                      </h3>

                      <p className="mt-1 font-semibold text-indigo-600">
                        {company.industry ||
                          "Industry not added"}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        {company.location ||
                          "Location not added"}
                      </p>
                    </div>
                  </div>

                  {company.description && (
                    <p className="mt-5 leading-7 text-slate-600">
                      {
                        company.description
                      }
                    </p>
                  )}

                  <Link
                    to={`/admin/companies/${company._id}`}
                    className="btn-secondary mt-6"
                  >
                    View Company
                  </Link>
                </>
              ) : (
                <div className="alert-error">
                  Company information is
                  unavailable.
                </div>
              )}
            </ContentSection>

            {/* Recruiter */}

            <ContentSection
              title="Recruiter"
            >
              {recruiter ? (
                <div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Detail
                      label="Name"
                      value={
                        recruiter.name
                      }
                    />

                    <Detail
                      label="Email"
                      value={
                        recruiter.email
                      }
                    />

                    <Detail
                      label="Phone"
                      value={
                        recruiter.phone
                      }
                    />

                    <Detail
                      label="Designation"
                      value={
                        recruiter.designation
                      }
                    />

                    <Detail
                      label="Account Status"
                      value={
                        recruiter.isActive
                          ? "Active"
                          : "Inactive"
                      }
                    />
                  </div>

                  <Link
                    to={`/admin/users/${recruiter._id}`}
                    className="btn-secondary mt-6"
                  >
                    View Recruiter
                  </Link>
                </div>
              ) : (
                <div className="alert-info">
                  Recruiter information
                  is unavailable.
                </div>
              )}
            </ContentSection>
          </div>

          {/* Sidebar */}

          <aside className="space-y-6">
            {/* Job Details */}

            <section className="portal-card p-6">
              <h2 className="font-black text-slate-900">
                Job Details
              </h2>

              <div className="mt-5 space-y-4">
                <SideDetail
                  label="Status"
                  value={formatValue(
                    job.status,
                  )}
                />

                <SideDetail
                  label="Platform"
                  value={
                    job.isActive
                      ? "Active"
                      : "Inactive"
                  }
                />

                <SideDetail
                  label="Location"
                  value={
                    job.location
                  }
                />

                <SideDetail
                  label="Openings"
                  value={
                    job.openings ||
                    1
                  }
                />

                <SideDetail
                  label="Experience"
                  value={formatExperience(
                    job,
                  )}
                />

                <SideDetail
                  label="Salary"
                  value={formatSalary(
                    job,
                  )}
                />

                <SideDetail
                  label="Deadline"
                  value={
                    job.applicationDeadline
                      ? formatDate(
                          job.applicationDeadline,
                        )
                      : "No deadline"
                  }
                />

                <SideDetail
                  label="Created"
                  value={formatDate(
                    job.createdAt,
                  )}
                />

                <SideDetail
                  label="Updated"
                  value={formatDate(
                    job.updatedAt,
                  )}
                />
              </div>
            </section>

            {/* Moderation */}

            <section className="portal-card p-6">
              <p className="eyebrow">
                Moderation
              </p>

              <h2 className="mt-2 font-black text-slate-900">
                Platform Control
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Admin moderation controls
                whether this job can
                remain active on the
                platform.
              </p>

              {job.isActive ? (
                <button
                  type="button"
                  disabled={
                    actionLoading
                  }
                  onClick={
                    handleDisable
                  }
                  className="btn-danger mt-5 w-full"
                >
                  Disable Job
                </button>
              ) : (
                <button
                  type="button"
                  disabled={
                    actionLoading ||
                    !canRestore
                  }
                  onClick={() =>
                    setShowRestore(
                      true,
                    )
                  }
                  className="btn-primary mt-5 w-full"
                >
                  Restore Job
                </button>
              )}
            </section>

            {/* Record */}

            <section className="portal-card p-6">
              <h2 className="font-black text-slate-900">
                Record Information
              </h2>

              <div className="mt-5 space-y-4">
                <Detail
                  label="Job ID"
                  value={
                    job._id
                  }
                />

                <Detail
                  label="Applications"
                  value={
                    job.applicationCount ??
                    0
                  }
                />
              </div>
            </section>
          </aside>
        </div>

        {/* ------------------------------------------------
            Restore Dialog
        ------------------------------------------------ */}

        {showRestore && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <p className="eyebrow">
                Restore Job
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                {job.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Choose whether the job
                should return as a draft
                or immediately become
                public.
              </p>

              <div className="mt-6">
                <label
                  htmlFor="restoreStatus"
                  className="form-label"
                >
                  Restore As
                </label>

                <select
                  id="restoreStatus"
                  value={
                    restoreStatus
                  }
                  onChange={(
                    event,
                  ) =>
                    setRestoreStatus(
                      event.target.value,
                    )
                  }
                  className="form-select"
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="published">
                    Published
                  </option>
                </select>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={
                    actionLoading
                  }
                  onClick={
                    handleRestore
                  }
                  className="btn-primary"
                >
                  {actionLoading
                    ? "Restoring..."
                    : "Restore Job"}
                </button>

                <button
                  type="button"
                  disabled={
                    actionLoading
                  }
                  onClick={() =>
                    setShowRestore(
                      false,
                    )
                  }
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// --------------------------------------------------
// Components
// --------------------------------------------------

function HeaderBadge({
  children,
}) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-indigo-100">
      {children}
    </span>
  );
}

function InfoBox({
  label,
  value,
}) {
  return (
    <div className="bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-extrabold text-slate-800">
        {value}
      </p>
    </div>
  );
}

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

function ContentSection({
  title,
  children,
}) {
  return (
    <section className="portal-card p-6 md:p-8">
      <h2 className="text-xl font-black text-slate-900">
        {title}
      </h2>

      <div className="mt-5">
        {children}
      </div>
    </section>
  );
}

function BulletList({
  items,
}) {
  return (
    <ul className="space-y-3">
      {items.map(
        (
          item,
          index,
        ) => (
          <li
            key={`${item}-${index}`}
            className="flex gap-3 text-slate-600"
          >
            <span className="mt-1 font-black text-indigo-600">
              ✓
            </span>

            <span className="leading-7">
              {item}
            </span>
          </li>
        ),
      )}
    </ul>
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
        {value ||
          "Not added"}
      </p>
    </div>
  );
}

function SideDetail({
  label,
  value,
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="text-right font-bold text-slate-800">
        {value}
      </span>
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

function formatExperience(
  job,
) {
  const min =
    job.minExperience ??
    0;

  const max =
    job.maxExperience;

  if (
    min === 0 &&
    (max === null ||
      max === undefined)
  ) {
    return "Fresher";
  }

  if (
    max !== null &&
    max !== undefined
  ) {
    return `${min} – ${max} years`;
  }

  return `${min}+ years`;
}

function formatSalary(
  job,
) {
  if (
    job.salaryMin ==
      null &&
    job.salaryMax ==
      null
  ) {
    return "Not disclosed";
  }

  const currency =
    job.salaryCurrency ===
    "INR"
      ? "₹"
      : `${job.salaryCurrency || ""} `;

  const period =
    job.salaryPeriod
      ? ` / ${job.salaryPeriod}`
      : "";

  if (
    job.salaryMin != null &&
    job.salaryMax != null
  ) {
    return `${currency}${Number(
      job.salaryMin,
    ).toLocaleString(
      "en-IN",
    )} – ${currency}${Number(
      job.salaryMax,
    ).toLocaleString(
      "en-IN",
    )}${period}`;
  }

  if (
    job.salaryMin != null
  ) {
    return `${currency}${Number(
      job.salaryMin,
    ).toLocaleString(
      "en-IN",
    )}+${period}`;
  }

  return `Up to ${currency}${Number(
    job.salaryMax,
  ).toLocaleString(
    "en-IN",
  )}${period}`;
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

export default AdminJobDetails;