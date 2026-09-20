import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../../api/api";

function RecruiterApplicantDetails() {
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

  // --------------------------------------------------
  // Load Application
  // --------------------------------------------------

  const loadApplication =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            `/applications/recruiter/${applicationId}`,
          );

        setApplication(
          response.data.application,
        );
      } catch (error) {
        setApplication(null);

        setError(
          error.response?.data
            ?.message ||
            "Failed to load candidate application",
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  // --------------------------------------------------
  // Update Status
  // --------------------------------------------------

  const handleStatus =
    async (
      status,
    ) => {
      const destructive =
        status ===
        "rejected";

      if (destructive) {
        const confirmed =
          window.confirm(
            "Reject this candidate? This action becomes a final application state.",
          );

        if (!confirmed) {
          return;
        }
      }

      try {
        setUpdating(true);

        setMessage("");
        setError("");

        const response =
          await api.patch(
            `/applications/recruiter/${applicationId}/status`,
            {
              status,
            },
          );

        setApplication(
          response.data.application,
        );

        setMessage(
          response.data.message ||
            "Application status updated successfully",
        );
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to update application status",
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
            Loading candidate...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Missing
  // --------------------------------------------------

  if (
    error &&
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
              {error}
            </p>

            <Link
              to="/recruiter/applicants"
              className="btn-primary mt-6"
            >
              Back to Applicants
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

  const nextActions =
    getNextActions(
      application.status,
    );

  return (
    <main className="page-shell">
      <div className="page-container">
        <Link
          to="/recruiter/applicants"
          className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Applicants
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

        {/* Candidate Header */}
        <section className="portal-card mt-6 overflow-hidden">
          <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-7 text-white md:p-9">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10 text-2xl font-black">
                  {applicant
                    ?.avatar ? (
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
                  <span
                    className={statusClass(
                      application.status,
                    )}
                  >
                    {formatValue(
                      application.status,
                    )}
                  </span>

                  <h1 className="mt-4 text-3xl font-black tracking-tight">
                    {applicant?.name}
                  </h1>

                  <p className="mt-2 font-semibold text-indigo-200">
                    {applicant?.headline ||
                      "Job Seeker"}
                  </p>

                  <p className="mt-2 text-sm text-indigo-100/70">
                    Applied for{" "}
                    <strong>
                      {job?.title}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {applicant
                  ?.resumeUrl && (
                  <a
                    href={
                      application.resumeUrl ||
                      applicant.resumeUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
                  >
                    View Resume
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_340px]">
          {/* Main */}
          <div className="space-y-7">
            {/* Candidate Information */}
            <section className="portal-card p-6 md:p-8">
              <h2 className="text-xl font-black text-slate-900">
                Candidate Profile
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Detail
                  label="Email"
                  value={
                    applicant?.email
                  }
                />

                <Detail
                  label="Phone"
                  value={
                    applicant?.phone
                  }
                />

                <Detail
                  label="Location"
                  value={
                    applicant?.location
                  }
                />

                <Detail
                  label="Experience"
                  value={`${applicant?.experienceYears ?? 0} years`}
                />

                <Detail
                  label="Education"
                  value={
                    applicant?.education
                  }
                />

                <Detail
                  label="Applied"
                  value={formatDateTime(
                    application.appliedAt,
                  )}
                />
              </div>

              {applicant?.bio && (
                <div className="mt-7 border-t border-slate-100 pt-6">
                  <p className="text-sm font-black text-slate-900">
                    About Candidate
                  </p>

                  <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                    {applicant.bio}
                  </p>
                </div>
              )}

              {applicant?.skills
                ?.length >
                0 && (
                <div className="mt-7 border-t border-slate-100 pt-6">
                  <p className="text-sm font-black text-slate-900">
                    Skills
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {applicant.skills.map(
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

            {/* Cover Letter */}
            <section className="portal-card p-6 md:p-8">
              <h2 className="text-xl font-black text-slate-900">
                Cover Letter
              </h2>

              <p className="mt-5 whitespace-pre-line leading-7 text-slate-600">
                {application.coverLetter ||
                  "The candidate did not provide a cover letter."}
              </p>
            </section>

            {/* Status History */}
            <section className="portal-card p-6 md:p-8">
              <h2 className="text-xl font-black text-slate-900">
                Hiring Timeline
              </h2>

              <div className="mt-6 space-y-4">
                {application.statusHistory
                  ?.map(
                    (
                      item,
                      index,
                    ) => (
                      <TimelineItem
                        key={
                          item._id ||
                          index
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
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Actions */}
            <section className="portal-card p-6">
              <p className="eyebrow">
                Hiring Decision
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-900">
                Update Application
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Move the candidate
                through the supported
                recruitment stages.
              </p>

              {nextActions.length >
              0 ? (
                <div className="mt-5 space-y-3">
                  {nextActions.map(
                    (
                      action,
                    ) => (
                      <button
                        key={
                          action.status
                        }
                        type="button"
                        disabled={
                          updating
                        }
                        onClick={() =>
                          handleStatus(
                            action.status,
                          )
                        }
                        className={
                          action.status ===
                          "rejected"
                            ? "btn-danger w-full"
                            : "btn-primary w-full"
                        }
                      >
                        {updating
                          ? "Updating..."
                          : action.label}
                      </button>
                    ),
                  )}
                </div>
              ) : (
                <div className="alert-info mt-5">
                  This application is
                  in a final state and
                  cannot be changed.
                </div>
              )}
            </section>

            {/* Job */}
            <section className="portal-card p-6">
              <h2 className="font-black text-slate-900">
                Job Information
              </h2>

              <div className="mt-5 space-y-4">
                <Detail
                  label="Role"
                  value={
                    job?.title
                  }
                />

                <Detail
                  label="Company"
                  value={
                    company?.name
                  }
                />

                <Detail
                  label="Location"
                  value={
                    job?.location
                  }
                />

                <Detail
                  label="Work Mode"
                  value={formatValue(
                    job?.workMode,
                  )}
                />

                <Detail
                  label="Employment"
                  value={formatValue(
                    job?.employmentType,
                  )}
                />
              </div>

              {job?._id && (
                <Link
                  to={`/jobs/${job._id}`}
                  className="btn-secondary mt-5 w-full"
                >
                  View Public Job
                </Link>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

// --------------------------------------------------
// Allowed UI Actions
// --------------------------------------------------

function getNextActions(
  status,
) {
  if (
    status === "applied"
  ) {
    return [
      {
        status:
          "under-review",
        label:
          "Move to Under Review",
      },
      {
        status:
          "rejected",
        label:
          "Reject Candidate",
      },
    ];
  }

  if (
    status ===
    "under-review"
  ) {
    return [
      {
        status:
          "shortlisted",
        label:
          "Shortlist Candidate",
      },
      {
        status:
          "rejected",
        label:
          "Reject Candidate",
      },
    ];
  }

  if (
    status ===
    "shortlisted"
  ) {
    return [
      {
        status:
          "hired",
        label:
          "Hire Candidate",
      },
      {
        status:
          "rejected",
        label:
          "Reject Candidate",
      },
    ];
  }

  return [];
}

// --------------------------------------------------
// Components
// --------------------------------------------------

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
        {value || "—"}
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
        <div className="h-3 w-3 rounded-full bg-indigo-600" />

        {!last && (
          <div className="mt-1 h-full min-h-10 w-px bg-indigo-200" />
        )}
      </div>

      <div className="pb-5">
        <p className="font-bold text-slate-800">
          {formatValue(
            item.status,
          )}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {formatDateTime(
            item.changedAt,
          )}
        </p>

        {item.changedBy
          ?.name && (
          <p className="mt-1 text-xs text-slate-500">
            Updated by{" "}
            {
              item.changedBy
                .name
            }
          </p>
        )}
      </div>
    </div>
  );
}

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
      "shortlisted" ||
    status ===
      "under-review"
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

export default RecruiterApplicantDetails;