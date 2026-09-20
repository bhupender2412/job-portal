import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import api from "../../api/api";

function AdminApplications() {
  const [
    applications,
    setApplications,
  ] = useState([]);

  const [
    companies,
    setCompanies,
  ] = useState([]);

  const [
    jobs,
    setJobs,
  ] = useState([]);

  const [
    recruiters,
    setRecruiters,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    companyId,
    setCompanyId,
  ] = useState("");

  const [
    jobId,
    setJobId,
  ] = useState("");

  const [
    recruiterId,
    setRecruiterId,
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
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // --------------------------------------------------
  // Load Filter Options
  // --------------------------------------------------

  useEffect(() => {
    const loadFilters =
      async () => {
        try {
          const [
            companiesResponse,
            jobsResponse,
            recruitersResponse,
          ] =
            await Promise.all([
              api.get(
                "/admin/companies",
                {
                  params: {
                    page: 1,
                    limit: 50,
                  },
                },
              ),

              api.get(
                "/admin/jobs",
                {
                  params: {
                    page: 1,
                    limit: 50,
                  },
                },
              ),

              api.get(
                "/admin/users",
                {
                  params: {
                    role: "recruiter",
                    page: 1,
                    limit: 50,
                  },
                },
              ),
            ]);

          setCompanies(
            companiesResponse
              .data
              .companies ||
              [],
          );

          setJobs(
            jobsResponse
              .data
              .jobs ||
              [],
          );

          setRecruiters(
            recruitersResponse
              .data
              .users ||
              [],
          );
        } catch (error) {
          console.error(
            "Failed to load application filters:",
            error.response?.data
              ?.message ||
              error.message,
          );
        }
      };

    loadFilters();
  }, []);

  // --------------------------------------------------
  // Load Applications
  // --------------------------------------------------

  const loadApplications =
    useCallback(
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

          if (companyId) {
            params.companyId =
              companyId;
          }

          if (recruiterId) {
            params.recruiterId =
              recruiterId;
          }

          const response =
            await api.get(
              "/admin/applications",
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
          setApplications([]);

          setError(
            error.response?.data
              ?.message ||
              "Failed to load applications",
          );
        } finally {
          setLoading(false);
        }
      },
      [
        search,
        status,
        jobId,
        companyId,
        recruiterId,
        page,
      ],
    );

  useEffect(() => {
    const timer =
      setTimeout(() => {
        loadApplications();
      }, 300);

    return () =>
      clearTimeout(timer);
  }, [loadApplications]);

  // --------------------------------------------------
  // Clear Filters
  // --------------------------------------------------

  const clearFilters =
    () => {
      setSearch("");
      setStatus("");
      setCompanyId("");
      setJobId("");
      setRecruiterId("");
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
            Application Management
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-indigo-100/75">
            Monitor hiring activity
            across candidates,
            recruiters, companies and
            job listings.
          </p>
        </section>

        {error && (
          <div className="alert-error mt-6">
            {error}
          </div>
        )}

        {/* Filters */}

        <section className="portal-card mt-8 p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label
                htmlFor="applicationSearch"
                className="form-label"
              >
                Search
              </label>

              <input
                id="applicationSearch"
                value={search}
                onChange={(
                  event,
                ) => {
                  setSearch(
                    event.target.value,
                  );

                  setPage(1);
                }}
                placeholder="Candidate, job, company..."
                className="form-input"
              />
            </div>

            <FilterSelect
              label="Status"
              value={status}
              onChange={(
                event,
              ) => {
                setStatus(
                  event.target.value,
                );

                setPage(1);
              }}
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
            </FilterSelect>

            <FilterSelect
              label="Company"
              value={companyId}
              onChange={(
                event,
              ) => {
                setCompanyId(
                  event.target.value,
                );

                setPage(1);
              }}
            >
              <option value="">
                All Companies
              </option>

              {companies.map(
                (company) => (
                  <option
                    key={
                      company._id
                    }
                    value={
                      company._id
                    }
                  >
                    {company.name}
                  </option>
                ),
              )}
            </FilterSelect>

            <FilterSelect
              label="Job"
              value={jobId}
              onChange={(
                event,
              ) => {
                setJobId(
                  event.target.value,
                );

                setPage(1);
              }}
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
            </FilterSelect>

            <FilterSelect
              label="Recruiter"
              value={recruiterId}
              onChange={(
                event,
              ) => {
                setRecruiterId(
                  event.target.value,
                );

                setPage(1);
              }}
            >
              <option value="">
                All Recruiters
              </option>

              {recruiters.map(
                (recruiter) => (
                  <option
                    key={
                      recruiter._id
                    }
                    value={
                      recruiter._id
                    }
                  >
                    {recruiter.name}
                  </option>
                ),
              )}
            </FilterSelect>

            <div className="flex items-end">
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </section>

        {/* Results */}

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              Applications
            </p>

            <h2 className="mt-2 section-title">
              Platform hiring activity
            </h2>
          </div>

          <p className="text-sm font-semibold text-slate-500">
            {total}{" "}
            {total === 1
              ? "application"
              : "applications"}
          </p>
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

              <p className="mt-2 text-slate-500">
                Try changing your
                search or application
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

        {/* Application Cards */}

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

// --------------------------------------------------
// Application Card
// --------------------------------------------------

function ApplicationCard({
  application,
}) {
  const applicant =
    application.applicant;

  const job =
    application.job;

  const company =
    application.company;

  const recruiter =
    application.recruiter;

  return (
    <article className="portal-card p-6">
      <div className="flex flex-col justify-between gap-6 xl:flex-row">
        <div className="flex min-w-0 items-start gap-4">
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
            <div className="flex flex-wrap items-center gap-2">
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

              {applicant &&
                !applicant.isActive && (
                  <span className="badge badge-danger">
                    Candidate Inactive
                  </span>
                )}
            </div>

            <p className="mt-1 text-sm font-semibold text-slate-600">
              {applicant?.email ||
                "Email unavailable"}
            </p>

            {applicant?.headline && (
              <p className="mt-1 text-sm font-semibold text-indigo-600">
                {applicant.headline}
              </p>
            )}

            <div className="mt-4 grid gap-3 text-sm text-slate-500 sm:grid-cols-2 lg:grid-cols-4">
              <Info
                label="Job"
                value={
                  job?.title
                }
              />

              <Info
                label="Company"
                value={
                  company?.name
                }
              />

              <Info
                label="Recruiter"
                value={
                  recruiter?.name
                }
              />

              <Info
                label="Applied"
                value={formatDate(
                  application.appliedAt,
                )}
              />
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

        <div className="flex shrink-0 flex-wrap items-start gap-3">
          <Link
            to={`/admin/applications/${application._id}`}
            className="btn-primary"
          >
            View Details
          </Link>

          {job?._id && (
            <Link
              to={`/admin/jobs/${job._id}`}
              className="btn-secondary"
            >
              View Job
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

// --------------------------------------------------
// Filter Select
// --------------------------------------------------

function FilterSelect({
  label,
  value,
  onChange,
  children,
}) {
  return (
    <div>
      <label className="form-label">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="form-select"
      >
        {children}
      </select>
    </div>
  );
}

// --------------------------------------------------
// Info
// --------------------------------------------------

function Info({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-700">
        {value ||
          "Unavailable"}
      </p>
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

export default AdminApplications;