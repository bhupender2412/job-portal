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
  clearSavedJobsMessage,
  fetchSavedJobs,
  removeSavedJob,
} from "../../features/savedJobs/savedJobsSlice";

function SavedJobs() {
  const dispatch =
    useDispatch();

  const {
    savedJobs,
    page,
    pages,
    total,
    loading,
    removingId,
    error,
    message,
  } = useSelector(
    (state) =>
      state.savedJobs,
  );

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  // ------------------------------------------------
  // Load Saved Jobs
  // ------------------------------------------------

  useEffect(() => {
    dispatch(
      fetchSavedJobs({
        page:
          currentPage,

        limit: 6,
      }),
    );
  }, [
    dispatch,
    currentPage,
  ]);

  // ------------------------------------------------
  // Clear Feedback
  // ------------------------------------------------

  useEffect(() => {
    return () => {
      dispatch(
        clearSavedJobsMessage(),
      );
    };
  }, [dispatch]);

  // ------------------------------------------------
  // Remove Job
  // ------------------------------------------------

  const handleRemove =
    async (
      jobId,
    ) => {
      try {
        await dispatch(
          removeSavedJob(
            jobId,
          ),
        ).unwrap();

        // If last item on a page was removed,
        // return to previous page.
        if (
          savedJobs.length ===
            1 &&
          currentPage > 1
        ) {
          setCurrentPage(
            (current) =>
              current - 1,
          );
        }
      } catch {
        // Redux already stores the error.
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
            Saved opportunities.
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-indigo-100/75">
            Keep interesting roles in
            one place and return when
            you're ready to apply.
          </p>
        </section>

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

        {/* Header */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              Saved Jobs
            </p>

            <h2 className="mt-2 section-title">
              Your shortlist
            </h2>
          </div>

          <p className="text-sm font-semibold text-slate-500">
            {total}{" "}
            {total === 1
              ? "saved job"
              : "saved jobs"}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading saved jobs...
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          savedJobs.length ===
            0 && (
            <div className="empty-state mt-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                ♡
              </div>

              <h3 className="mt-5 text-2xl font-black text-slate-900">
                No saved jobs yet
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-slate-500">
                Browse current
                opportunities and save
                roles that interest you.
              </p>

              <Link
                to="/jobs"
                className="btn-primary mt-6"
              >
                Explore Jobs
              </Link>
            </div>
          )}

        {/* Grid */}
        {!loading &&
          savedJobs.length >
            0 && (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {savedJobs.map(
                (saved) => (
                  <SavedJobCard
                    key={
                      saved._id
                    }
                    saved={
                      saved
                    }
                    removing={
                      removingId ===
                      saved.job?._id
                    }
                    onRemove={
                      handleRemove
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
                        1,
                        current -
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
                        pages,
                        current +
                          1,
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
// Saved Job Card
// --------------------------------------------------

function SavedJobCard({
  saved,
  removing,
  onRemove,
}) {
  const job =
    saved.job;

  if (!job) {
    return (
      <article className="portal-card p-6">
        <div className="alert-error">
          This saved job is no
          longer available.
        </div>
      </article>
    );
  }

  const isAvailable =
    job.status ===
      "published" &&
    job.isActive !==
      false;

  return (
    <article className="portal-card portal-card-hover flex h-full flex-col p-6">
      {/* Company */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-100 font-black text-indigo-700">
          {job.company
            ?.logoUrl ? (
            <img
              src={
                job.company
                  .logoUrl
              }
              alt={
                job.company
                  .name
              }
              className="h-full w-full object-cover"
            />
          ) : (
            job.company?.name
              ?.charAt(0)
              .toUpperCase() ||
            "C"
          )}
        </div>

        <div className="min-w-0">
          <Link
            to={
              isAvailable
                ? `/jobs/${job._id}`
                : "#"
            }
            className={`text-lg font-black ${
              isAvailable
                ? "text-slate-900 transition hover:text-indigo-600"
                : "text-slate-500"
            }`}
          >
            {job.title}
          </Link>

          <p className="mt-1 truncate text-sm font-semibold text-indigo-600">
            {job.company
              ?.name ||
              "Company"}
          </p>
        </div>
      </div>

      {/* Availability */}
      {!isAvailable && (
        <div className="alert-info mt-5">
          This job is no longer
          accepting applications.
        </div>
      )}

      {/* Tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="badge badge-primary">
          {formatValue(
            job.employmentType,
          )}
        </span>

        <span className="badge badge-neutral">
          {formatValue(
            job.workMode,
          )}
        </span>

        <span className="badge badge-neutral">
          {formatValue(
            job.experienceLevel,
          )}
        </span>

        {job.company
          ?.isVerified && (
          <span className="badge badge-success">
            ✓ Verified
          </span>
        )}
      </div>

      {/* Details */}
      <div className="mt-5 space-y-2 text-sm text-slate-500">
        <p>
          <span className="font-bold text-slate-700">
            Location:
          </span>{" "}
          {job.location ||
            "Not specified"}
        </p>

        <p>
          <span className="font-bold text-slate-700">
            Salary:
          </span>{" "}
          {formatSalary(
            job,
          )}
        </p>
      </div>

      {/* Skills */}
      {job.skills?.length >
        0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {job.skills
            .slice(0, 4)
            .map(
              (skill) => (
                <span
                  key={
                    skill
                  }
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                >
                  {skill}
                </span>
              ),
            )}
        </div>
      )}

      <div className="mt-auto border-t border-slate-100 pt-5">
        <p className="text-xs font-semibold text-slate-400">
          Saved{" "}
          {formatDate(
            saved.savedAt ||
              saved.createdAt,
          )}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {isAvailable ? (
            <Link
              to={`/jobs/${job._id}`}
              className="btn-primary"
            >
              View Details
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="btn-secondary"
            >
              Unavailable
            </button>
          )}

          <button
            type="button"
            disabled={
              removing
            }
            onClick={() =>
              onRemove(
                job._id,
              )
            }
            className="btn-secondary"
          >
            {removing
              ? "Removing..."
              : "Remove"}
          </button>
        </div>
      </div>
    </article>
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
    job.salaryMin !=
      null &&
    job.salaryMax !=
      null
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
    job.salaryMin !=
    null
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
    return "recently";
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

export default SavedJobs;