import {
  useEffect,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  clearApplicationFeedback,
  clearCurrentApplication,
  fetchMyApplicationById,
  withdrawMyApplication,
} from "../../features/applications/applicationsSlice";

function ApplicationDetails() {
  const {
    applicationId,
  } = useParams();

  const dispatch =
    useDispatch();

  const {
    currentApplication:
      application,

    detailsLoading,
    withdrawingId,
    error,
    message,
  } = useSelector(
    (state) =>
      state.applications,
  );

  useEffect(() => {
    dispatch(
      fetchMyApplicationById(
        applicationId,
      ),
    );

    return () => {
      dispatch(
        clearCurrentApplication(),
      );

      dispatch(
        clearApplicationFeedback(),
      );
    };
  }, [
    applicationId,
    dispatch,
  ]);

  const handleWithdraw =
    async () => {
      const confirmed =
        window.confirm(
          "Are you sure you want to withdraw this application?",
        );

      if (!confirmed) {
        return;
      }

      try {
        await dispatch(
          withdrawMyApplication(
            applicationId,
          ),
        ).unwrap();
      } catch {
        // Redux stores error.
      }
    };

  if (detailsLoading) {
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
              to="/applications"
              className="btn-primary mt-6"
            >
              Back to Applications
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const canWithdraw =
    ![
      "withdrawn",
      "rejected",
      "hired",
    ].includes(
      application.status,
    );

  return (
    <main className="page-shell">
      <div className="page-container">
        <Link
          to="/applications"
          className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Applications
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

        <section className="portal-card mt-6 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div>
              <p className="eyebrow">
                Application
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-900">
                {application.job
                  ?.title ||
                  "Job Application"}
              </h1>

              <p className="mt-2 font-semibold text-indigo-600">
                {application.company
                  ?.name}
              </p>
            </div>

            <div className="flex flex-wrap items-start gap-3">
              <span
                className={statusClass(
                  application.status,
                )}
              >
                {formatValue(
                  application.status,
                )}
              </span>

              {canWithdraw && (
                <button
                  type="button"
                  disabled={
                    withdrawingId ===
                    application._id
                  }
                  onClick={
                    handleWithdraw
                  }
                  className="btn-secondary"
                >
                  {withdrawingId ===
                  application._id
                    ? "Withdrawing..."
                    : "Withdraw"}
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_340px]">
          <div className="space-y-7">
            {/* Timeline */}
            <section className="portal-card p-6 md:p-8">
              <h2 className="text-xl font-black text-slate-900">
                Application Progress
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

            {/* Job */}
            <section className="portal-card p-6 md:p-8">
              <h2 className="text-xl font-black text-slate-900">
                Job Information
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Detail
                  label="Location"
                  value={
                    application.job
                      ?.location
                  }
                />

                <Detail
                  label="Work Mode"
                  value={formatValue(
                    application.job
                      ?.workMode,
                  )}
                />

                <Detail
                  label="Employment"
                  value={formatValue(
                    application.job
                      ?.employmentType,
                  )}
                />

                <Detail
                  label="Experience"
                  value={formatValue(
                    application.job
                      ?.experienceLevel,
                  )}
                />
              </div>

              {application.job
                ?._id && (
                <Link
                  to={`/jobs/${application.job._id}`}
                  className="btn-secondary mt-6"
                >
                  View Job
                </Link>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            {/* Summary */}
            <section className="portal-card p-6">
              <h2 className="font-black text-slate-900">
                Application Summary
              </h2>

              <div className="mt-5 space-y-4">
                <Detail
                  label="Applied On"
                  value={formatDate(
                    application.appliedAt,
                  )}
                />

                <Detail
                  label="Current Status"
                  value={formatValue(
                    application.status,
                  )}
                />

                <Detail
                  label="Company"
                  value={
                    application.company
                      ?.name
                  }
                />

                <Detail
                  label="Recruiter"
                  value={
                    application.recruiter
                      ?.name ||
                    "Recruitment Team"
                  }
                />
              </div>
            </section>

            {/* Resume */}
            <section className="portal-card p-6">
              <h2 className="font-black text-slate-900">
                Application Resume
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This is the resume
                attached when the
                application was
                submitted.
              </p>

              {application.resumeUrl ? (
                <a
                  href={
                    application.resumeUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary mt-5 w-full"
                >
                  View Resume
                </a>
              ) : (
                <div className="alert-info mt-5">
                  No resume was attached
                  to this application.
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
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

function Detail({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-700">
        {value || "—"}
      </p>
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

export default ApplicationDetails;