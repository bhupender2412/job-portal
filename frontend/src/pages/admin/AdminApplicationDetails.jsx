import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../../api/api";

function AdminApplicationDetails() {
  const {
    applicationId,
  } = useParams();

  const [
    application,
    setApplication,
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
  // Load Application
  // --------------------------------------------------

  useEffect(() => {
    const loadApplication =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await api.get(
              `/admin/applications/${applicationId}`,
            );

          setApplication(
            response.data.application,
          );
        } catch (error) {
          setApplication(null);

          setError(
            error.response?.data
              ?.message ||
              "Failed to load application",
          );
        } finally {
          setLoading(false);
        }
      };

    loadApplication();
  }, [applicationId]);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading application...
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
    !application
  ) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <div className="empty-state">
            <h1 className="text-3xl font-black text-slate-900">
              Application unavailable
            </h1>

            <p className="mt-3 text-slate-500">
              {error ||
                "The application could not be loaded."}
            </p>

            <Link
              to="/admin/applications"
              className="btn-primary mt-6"
            >
              Back to Applications
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const applicant =
    application.applicant;

  const job =
    application.job;

  const company =
    application.company;

  const recruiter =
    application.recruiter;

  const resumeUrl =
    application.resumeUrl ||
    applicant?.resumeUrl;

  return (
    <main className="page-shell">
      <div className="page-container">
        {/* Back */}

        <Link
          to="/admin/applications"
          className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Applications
        </Link>

        {/* --------------------------------------------------
            Header
        -------------------------------------------------- */}

        <section className="portal-card mt-6 overflow-hidden">
          <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-7 text-white md:p-9">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-start">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10 text-2xl font-black text-white">
                  {applicant?.avatar ? (
                    <img
                      src={
                        applicant.avatar
                      }
                      alt={
                        applicant.name
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    applicant?.name
                      ?.charAt(0)
                      .toUpperCase() ||
                    "C"
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap gap-2">
                    <HeaderBadge>
                      {formatValue(
                        application.status,
                      )}
                    </HeaderBadge>

                    {applicant &&
                      !applicant.isActive && (
                        <HeaderBadge>
                          Candidate Inactive
                        </HeaderBadge>
                      )}

                    {company
                      ?.isVerified && (
                      <HeaderBadge>
                        ✓ Verified Company
                      </HeaderBadge>
                    )}
                  </div>

                  <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                    {applicant?.name ||
                      "Candidate"}
                  </h1>

                  <p className="mt-2 font-semibold text-indigo-200">
                    {applicant?.headline ||
                      "Job Seeker"}
                  </p>

                  <p className="mt-3 text-sm text-indigo-100/70">
                    Applied for{" "}
                    <strong className="text-white">
                      {job?.title ||
                        "Job unavailable"}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {resumeUrl && (
                  <a
                    href={
                      resumeUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-white px-5 py-3 text-sm font-black text-indigo-700 transition hover:bg-indigo-50"
                  >
                    View Resume
                  </a>
                )}

                {job?._id && (
                  <Link
                    to={`/admin/jobs/${job._id}`}
                    className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
                  >
                    View Job
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}

          <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryBox
              label="Status"
              value={formatValue(
                application.status,
              )}
            />

            <SummaryBox
              label="Company"
              value={
                company?.name ||
                "Unavailable"
              }
            />

            <SummaryBox
              label="Recruiter"
              value={
                recruiter?.name ||
                "Unavailable"
              }
            />

            <SummaryBox
              label="Applied"
              value={formatDate(
                application.appliedAt,
              )}
            />
          </div>
        </section>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_340px]">
          {/* --------------------------------------------------
              Main
          -------------------------------------------------- */}

          <div className="space-y-7">
            {/* Candidate */}

            <section className="portal-card p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">
                    Candidate
                  </p>

                  <h2 className="mt-2 text-xl font-black text-slate-900">
                    Candidate Profile
                  </h2>
                </div>

                {applicant?._id && (
                  <Link
                    to={`/admin/users/${applicant._id}`}
                    className="btn-secondary"
                  >
                    View User
                  </Link>
                )}
              </div>

              {applicant ? (
                <>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Detail
                      label="Full Name"
                      value={
                        applicant.name
                      }
                    />

                    <Detail
                      label="Email"
                      value={
                        applicant.email
                      }
                    />

                    <Detail
                      label="Phone"
                      value={
                        applicant.phone
                      }
                    />

                    <Detail
                      label="Location"
                      value={
                        applicant.location
                      }
                    />

                    <Detail
                      label="Experience"
                      value={`${applicant.experienceYears ?? 0} years`}
                    />

                    <Detail
                      label="Education"
                      value={
                        applicant.education
                      }
                    />

                    <Detail
                      label="Account Status"
                      value={
                        applicant.isActive
                          ? "Active"
                          : "Inactive"
                      }
                    />

                    <Detail
                      label="Member Since"
                      value={formatDate(
                        applicant.createdAt,
                      )}
                    />
                  </div>

                  {applicant.bio && (
                    <div className="mt-7 border-t border-slate-100 pt-6">
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                        About
                      </p>

                      <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                        {applicant.bio}
                      </p>
                    </div>
                  )}

                  {applicant.skills
                    ?.length >
                    0 && (
                    <div className="mt-7 border-t border-slate-100 pt-6">
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                        Skills
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {applicant.skills.map(
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
                    </div>
                  )}
                </>
              ) : (
                <div className="alert-error mt-6">
                  Candidate information
                  is unavailable.
                </div>
              )}
            </section>

            {/* Cover Letter */}

            <section className="portal-card p-6 md:p-8">
              <h2 className="text-xl font-black text-slate-900">
                Cover Letter
              </h2>

              <p className="mt-5 whitespace-pre-line leading-7 text-slate-600">
                {application.coverLetter ||
                  "No cover letter was provided."}
              </p>
            </section>

            {/* Status Timeline */}

            <section className="portal-card p-6 md:p-8">
              <p className="eyebrow">
                Application History
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-900">
                Status Timeline
              </h2>

              {application
                .statusHistory
                ?.length > 0 ? (
                <div className="mt-6">
                  {application.statusHistory.map(
                    (
                      item,
                      index,
                    ) => (
                      <TimelineItem
                        key={
                          item._id ||
                          `${item.status}-${index}`
                        }
                        item={
                          item
                        }
                        last={
                          index ===
                          application
                            .statusHistory
                            .length -
                            1
                        }
                      />
                    ),
                  )}
                </div>
              ) : (
                <div className="alert-info mt-6">
                  No status history is
                  available.
                </div>
              )}
            </section>

            {/* Job */}

            <section className="portal-card p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">
                    Opportunity
                  </p>

                  <h2 className="mt-2 text-xl font-black text-slate-900">
                    Job Information
                  </h2>
                </div>

                {job?._id && (
                  <Link
                    to={`/admin/jobs/${job._id}`}
                    className="btn-secondary"
                  >
                    View Job
                  </Link>
                )}
              </div>

              {job ? (
                <>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Detail
                      label="Job Title"
                      value={
                        job.title
                      }
                    />

                    <Detail
                      label="Location"
                      value={
                        job.location
                      }
                    />

                    <Detail
                      label="Work Mode"
                      value={formatValue(
                        job.workMode,
                      )}
                    />

                    <Detail
                      label="Employment"
                      value={formatValue(
                        job.employmentType,
                      )}
                    />

                    <Detail
                      label="Experience Level"
                      value={formatValue(
                        job.experienceLevel,
                      )}
                    />

                    <Detail
                      label="Openings"
                      value={
                        job.openings
                      }
                    />

                    <Detail
                      label="Job Status"
                      value={formatValue(
                        job.status,
                      )}
                    />

                    <Detail
                      label="Platform Status"
                      value={
                        job.isActive
                          ? "Active"
                          : "Inactive"
                      }
                    />
                  </div>

                  {job.description && (
                    <div className="mt-7 border-t border-slate-100 pt-6">
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                        Description
                      </p>

                      <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                        {
                          job.description
                        }
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="alert-error mt-6">
                  Job information is
                  unavailable.
                </div>
              )}
            </section>
          </div>

          {/* --------------------------------------------------
              Sidebar
          -------------------------------------------------- */}

          <aside className="space-y-6">
            {/* Status */}

            <section className="portal-card p-6">
              <p className="eyebrow">
                Application
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-900">
                Current Status
              </h2>

              <div className="mt-5">
                <span
                  className={statusClass(
                    application.status,
                  )}
                >
                  {formatValue(
                    application.status,
                  )}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Hiring-stage decisions
                are managed by the
                assigned recruiter. Admin
                access is for platform
                monitoring and auditing.
              </p>
            </section>

            {/* Resume */}

            <section className="portal-card p-6">
              <h2 className="font-black text-slate-900">
                Application Resume
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                View the resume associated
                with this candidate.
              </p>

              {resumeUrl ? (
                <a
                  href={
                    resumeUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary mt-5 w-full"
                >
                  View Resume
                </a>
              ) : (
                <div className="alert-info mt-5">
                  No resume is available.
                </div>
              )}
            </section>

            {/* Company */}

            <section className="portal-card p-6">
              <h2 className="font-black text-slate-900">
                Company
              </h2>

              {company ? (
                <>
                  <p className="mt-4 text-lg font-black text-slate-900">
                    {company.name}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-indigo-600">
                    {company.industry ||
                      "Industry not added"}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {company.location ||
                      "Location not added"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
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
                  </div>

                  <Link
                    to={`/admin/companies/${company._id}`}
                    className="btn-secondary mt-5 w-full"
                  >
                    View Company
                  </Link>
                </>
              ) : (
                <div className="alert-info mt-5">
                  Company unavailable.
                </div>
              )}
            </section>

            {/* Recruiter */}

            <section className="portal-card p-6">
              <h2 className="font-black text-slate-900">
                Recruiter
              </h2>

              {recruiter ? (
                <>
                  <div className="mt-5 space-y-4">
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
                      label="Designation"
                      value={
                        recruiter.designation
                      }
                    />

                    <Detail
                      label="Account"
                      value={
                        recruiter.isActive
                          ? "Active"
                          : "Inactive"
                      }
                    />
                  </div>

                  <Link
                    to={`/admin/users/${recruiter._id}`}
                    className="btn-secondary mt-5 w-full"
                  >
                    View Recruiter
                  </Link>
                </>
              ) : (
                <div className="alert-info mt-5">
                  Recruiter unavailable.
                </div>
              )}
            </section>

            {/* Record */}

            <section className="portal-card p-6">
              <h2 className="font-black text-slate-900">
                Record Information
              </h2>

              <div className="mt-5 space-y-4">
                <Detail
                  label="Application ID"
                  value={
                    application._id
                  }
                />

                <Detail
                  label="Applied At"
                  value={formatDateTime(
                    application.appliedAt,
                  )}
                />

                <Detail
                  label="Last Updated"
                  value={formatDateTime(
                    application.updatedAt,
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

function SummaryBox({
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

function TimelineItem({
  item,
  last,
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="h-3 w-3 shrink-0 rounded-full bg-indigo-600" />

        {!last && (
          <div className="mt-1 min-h-14 w-px flex-1 bg-indigo-200" />
        )}
      </div>

      <div className="pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-black text-slate-800">
            {formatValue(
              item.status,
            )}
          </p>

          <span
            className={statusClass(
              item.status,
            )}
          >
            {formatValue(
              item.status,
            )}
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          {formatDateTime(
            item.changedAt,
          )}
        </p>

        {item.changedBy && (
          <div className="mt-2 text-xs text-slate-500">
            Updated by{" "}
            <span className="font-bold text-slate-700">
              {item.changedBy.name ||
                "User"}
            </span>

            {item.changedBy
              .role && (
              <>
                {" "}
                (
                {formatValue(
                  item.changedBy
                    .role,
                )}
                )
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function statusClass(
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

function formatDateTime(
  value,
) {
  if (!value) {
    return "—";
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

export default AdminApplicationDetails;