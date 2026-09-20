import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import api from "../../api/api";

function RecruiterApplicants() {
  const [
    applications,
    setApplications,
  ] = useState([]);

  const [
    jobs,
    setJobs,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    jobId,
    setJobId,
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
    error,
    setError,
  ] = useState("");

  // --------------------------------------------------
  // Load Recruiter Jobs
  // --------------------------------------------------

  useEffect(() => {
    const loadJobs =
      async () => {
        try {
          const response =
            await api.get(
              "/jobs/my",
            );

          setJobs(
            response.data.jobs ||
              [],
          );
        } catch (error) {
          console.error(
            "Failed to load recruiter jobs:",
            error.response?.data
              ?.message ||
              error.message,
          );
        }
      };

    loadJobs();
  }, []);

  // --------------------------------------------------
  // Load Applicants
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

            if (status) {
              params.status =
                status;
            }

            if (jobId) {
              params.jobId =
                jobId;
            }

            const response =
              await api.get(
                "/applications/recruiter",
                {
                  params,
                },
              );

            setApplications(
              response.data
                .applications ||
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
            setApplications(
              [],
            );

            setError(
              error.response?.data
                ?.message ||
                "Failed to load applicants",
            );
          } finally {
            setLoading(false);
          }
        },
        300,
      );

    return () =>
      clearTimeout(
        timer,
      );
  }, [
    search,
    status,
    jobId,
    page,
  ]);

  // --------------------------------------------------
  // Clear Filters
  // --------------------------------------------------

  const clearFilters =
    () => {
      setSearch("");
      setStatus("");
      setJobId("");
      setPage(1);
    };

  return (
    <main className="page-shell">
      <div className="page-container">
        {/* Hero */}
        <section className="rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 px-7 py-9 text-white md:px-10 md:py-11">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-200">
            Recruitment Pipeline
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            Review and manage applicants.
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-indigo-100/75">
            Review candidate profiles,
            resumes and application
            progress across your job
            listings.
          </p>
        </section>

        {/* Filters */}
        <section className="portal-card mt-8 p-5 md:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
            <div>
              <label
                htmlFor="search"
                className="form-label"
              >
                Search Candidate
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
                placeholder="Name, email, headline or skill..."
                className="form-input"
              />
            </div>

            <div>
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

                  setPage(1);
                }}
                className="form-select"
              >
                <option value="">
                  All Statuses
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

            <div>
              <label
                htmlFor="jobId"
                className="form-label"
              >
                Job
              </label>

              <select
                id="jobId"
                value={jobId}
                onChange={(
                  event,
                ) => {
                  setJobId(
                    event.target.value,
                  );

                  setPage(1);
                }}
                className="form-select"
              >
                <option value="">
                  All Jobs
                </option>

                {jobs.map(
                  (job) => (
                    <option
                      key={
                        job._id
                      }
                      value={
                        job._id
                      }
                    >
                      {job.title}
                    </option>
                  ),
                )}
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

        {/* Results */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              Candidates
            </p>

            <h2 className="mt-2 section-title">
              Applicant pipeline
            </h2>
          </div>

          <p className="text-sm font-semibold text-slate-500">
            {total}{" "}
            {total === 1
              ? "application"
              : "applications"}
          </p>
        </div>

        {error && (
          <div className="alert-error mt-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading applicants...
              </p>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          applications.length ===
            0 && (
            <div className="empty-state mt-6">
              <h3 className="text-2xl font-black text-slate-900">
                No applicants found
              </h3>

              <p className="mt-2 text-slate-500">
                Applications submitted
                to your job listings
                will appear here.
              </p>
            </div>
          )}

        {!loading &&
          applications.length >
            0 && (
            <div className="mt-6 space-y-5">
              {applications.map(
                (
                  application,
                ) => (
                  <ApplicantCard
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
                  page >= pages
                }
                onClick={() =>
                  setPage(
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

function ApplicantCard({
  application,
}) {
  const applicant =
    application.applicant;

  const job =
    application.job;

  return (
    <article className="portal-card p-6">
      <div className="flex flex-col justify-between gap-6 lg:flex-row">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-xl font-black text-indigo-700">
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

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-black text-slate-900">
                {applicant?.name ||
                  "Candidate"}
              </h3>

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

            <p className="mt-1 text-sm font-semibold text-indigo-600">
              {applicant?.headline ||
                "Job Seeker"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {applicant?.email}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <span>
                <strong className="text-slate-700">
                  Applied For:
                </strong>{" "}
                {job?.title}
              </span>

              <span>
                <strong className="text-slate-700">
                  Experience:
                </strong>{" "}
                {applicant
                  ?.experienceYears ??
                  0}{" "}
                years
              </span>

              <span>
                <strong className="text-slate-700">
                  Applied:
                </strong>{" "}
                {formatDate(
                  application.appliedAt,
                )}
              </span>
            </div>

            {applicant?.skills
              ?.length >
              0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {applicant.skills
                  .slice(0, 6)
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
          </div>
        </div>

        <div className="flex shrink-0 items-start">
          <Link
            to={`/recruiter/applicants/${application._id}`}
            className="btn-primary"
          >
            Review Candidate
          </Link>
        </div>
      </div>
    </article>
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

export default RecruiterApplicants;