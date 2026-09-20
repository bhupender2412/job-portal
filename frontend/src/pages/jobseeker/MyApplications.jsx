import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  clearApplicationFeedback,
  fetchMyApplications,
  withdrawMyApplication,
} from "../../features/applications/applicationsSlice";

function MyApplications() {
  const dispatch =
    useDispatch();

  const {
    applications,
    page,
    pages,
    total,
    loading,
    withdrawingId,
    error,
    message,
  } = useSelector(
    (state) =>
      state.applications,
  );

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  // ------------------------------------------------
  // Load
  // ------------------------------------------------

  useEffect(() => {
    const params = {
      page:
        currentPage,

      limit: 6,
    };

    if (status) {
      params.status =
        status;
    }

    dispatch(
      fetchMyApplications(
        params,
      ),
    );
  }, [
    dispatch,
    status,
    currentPage,
  ]);

  useEffect(() => {
    return () => {
      dispatch(
        clearApplicationFeedback(),
      );
    };
  }, [dispatch]);

  // ------------------------------------------------
  // Withdraw
  // ------------------------------------------------

  const handleWithdraw =
    async (
      applicationId,
    ) => {
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

        dispatch(
          fetchMyApplications({
            page:
              currentPage,

            limit: 6,

            ...(status
              ? {
                  status,
                }
              : {}),
          }),
        );
      } catch {
        // Redux stores the error.
      }
    };

  return (
    <main className="page-shell">
      <div className="page-container">
        {/* Header */}
        <section className="rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 px-7 py-9 text-white md:px-10 md:py-11">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-200">
            Job Seeker
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            Track your applications.
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-indigo-100/75">
            Follow every opportunity
            from your first application
            through the recruiter hiring
            process.
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

        {/* Controls */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">
              Applications
            </p>

            <h2 className="mt-2 section-title">
              Application history
            </h2>

            <p className="mt-2 text-sm font-semibold text-slate-500">
              {total}{" "}
              {total === 1
                ? "application"
                : "applications"}
            </p>
          </div>

          <div className="w-full sm:w-64">
            <label
              htmlFor="status"
              className="form-label"
            >
              Status
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

                setCurrentPage(
                  1,
                );
              }}
              className="form-select"
            >
              <option value="">
                All Applications
              </option>

              <option value="applied">
                Applied
              </option>

              <option value="under-review">
                Under Review
              </option>

              <option value="shortlisted">
                Shortlisted
              </option>

              <option value="hired">
                Hired
              </option>

              <option value="rejected">
                Rejected
              </option>

              <option value="withdrawn">
                Withdrawn
              </option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading applications...
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          applications.length ===
            0 && (
            <div className="empty-state mt-6">
              <h3 className="text-2xl font-black text-slate-900">
                No applications found
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-slate-500">
                {status
                  ? "You have no applications with this status."
                  : "Start exploring jobs and submit your first application."}
              </p>

              <Link
                to="/jobs"
                className="btn-primary mt-6"
              >
                Browse Jobs
              </Link>
            </div>
          )}

        {/* Applications */}
        {!loading &&
          applications.length >
            0 && (
            <div className="mt-6 space-y-5">
              {applications.map(
                (
                  application,
                ) => (
                  <ApplicationCard
                    key={
                      application._id
                    }
                    application={
                      application
                    }
                    withdrawing={
                      withdrawingId ===
                      application._id
                    }
                    onWithdraw={
                      handleWithdraw
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
                  setCurrentPage(
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
                  page >=
                  pages
                }
                onClick={() =>
                  setCurrentPage(
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

function ApplicationCard({
  application,
  withdrawing,
  onWithdraw,
}) {
  const job =
    application.job;

  const company =
    application.company;

  const canWithdraw =
    ![
      "withdrawn",
      "rejected",
      "hired",
    ].includes(
      application.status,
    );

  return (
    <article className="portal-card p-6">
      <div className="flex flex-col justify-between gap-6 lg:flex-row">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-100 font-black text-indigo-700">
            {company
              ?.logoUrl ? (
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

          <div className="min-w-0">
            <h3 className="text-xl font-black text-slate-900">
              {job?.title ||
                "Job unavailable"}
            </h3>

            <p className="mt-1 font-semibold text-indigo-600">
              {company?.name ||
                "Company"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={statusClass(
                  application.status,
                )}
              >
                {formatValue(
                  application.status,
                )}
              </span>

              {job?.workMode && (
                <span className="badge badge-neutral">
                  {formatValue(
                    job.workMode,
                  )}
                </span>
              )}

              {job
                ?.employmentType && (
                <span className="badge badge-neutral">
                  {formatValue(
                    job.employmentType,
                  )}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              {job?.location && (
                <span>
                  <strong className="text-slate-700">
                    Location:
                  </strong>{" "}
                  {job.location}
                </span>
              )}

              <span>
                <strong className="text-slate-700">
                  Applied:
                </strong>{" "}
                {formatDate(
                  application.appliedAt,
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-start gap-3 lg:justify-end">
          <Link
            to={`/applications/${application._id}`}
            className="btn-primary"
          >
            View Application
          </Link>

          {job?._id && (
            <Link
              to={`/jobs/${job._id}`}
              className="btn-secondary"
            >
              View Job
            </Link>
          )}

          {canWithdraw && (
            <button
              type="button"
              disabled={
                withdrawing
              }
              onClick={() =>
                onWithdraw(
                  application._id,
                )
              }
              className="btn-secondary"
            >
              {withdrawing
                ? "Withdrawing..."
                : "Withdraw"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <ProgressSteps
          status={
            application.status
          }
        />
      </div>
    </article>
  );
}

function ProgressSteps({
  status,
}) {
  if (
    status === "rejected"
  ) {
    return (
      <p className="text-sm font-bold text-red-600">
        Application was not
        selected for this role.
      </p>
    );
  }

  if (
    status === "withdrawn"
  ) {
    return (
      <p className="text-sm font-bold text-slate-500">
        You withdrew this
        application.
      </p>
    );
  }

  const steps = [
    "applied",
    "under-review",
    "shortlisted",
    "hired",
  ];

  const currentIndex =
    steps.indexOf(
      status,
    );

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {steps.map(
        (
          step,
          index,
        ) => {
          const reached =
            index <=
            currentIndex;

          return (
            <div
              key={step}
              className={`rounded-xl border px-3 py-3 text-center text-xs font-bold ${
                reached
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              {formatValue(
                step,
              )}
            </div>
          );
        },
      )}
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

export default MyApplications;