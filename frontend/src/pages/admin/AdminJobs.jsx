import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import api from "../../api/api";

function AdminJobs() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const initialCompanyId =
    searchParams.get(
      "companyId",
    ) || "";

  const [
    jobs,
    setJobs,
  ] = useState([]);

  const [
    companies,
    setCompanies,
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
    active,
    setActive,
  ] = useState("");

  const [
    companyId,
    setCompanyId,
  ] = useState(
    initialCompanyId,
  );

  const [
    workMode,
    setWorkMode,
  ] = useState("");

  const [
    employmentType,
    setEmploymentType,
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
    actionLoading,
    setActionLoading,
  ] = useState("");

  const [
    restoreJob,
    setRestoreJob,
  ] = useState(null);

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
  // Load Companies For Filter
  // --------------------------------------------------

  useEffect(() => {
    const loadCompanies =
      async () => {
        try {
          const response =
            await api.get(
              "/admin/companies",
              {
                params: {
                  page: 1,
                  limit: 50,
                },
              },
            );

          setCompanies(
            response.data
              .companies ||
              [],
          );
        } catch (error) {
          console.error(
            "Failed to load company filter:",
            error.response?.data
              ?.message ||
              error.message,
          );
        }
      };

    loadCompanies();
  }, []);

  // --------------------------------------------------
  // Load Jobs
  // --------------------------------------------------

  const loadJobs =
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

          if (active) {
            params.active =
              active;
          }

          if (companyId) {
            params.companyId =
              companyId;
          }

          if (workMode) {
            params.workMode =
              workMode;
          }

          if (
            employmentType
          ) {
            params.employmentType =
              employmentType;
          }

          const response =
            await api.get(
              "/admin/jobs",
              {
                params,
              },
            );

          setJobs(
            response.data.jobs ||
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
          setJobs([]);

          setError(
            error.response?.data
              ?.message ||
              "Failed to load jobs",
          );
        } finally {
          setLoading(false);
        }
      },
      [
        search,
        status,
        active,
        companyId,
        workMode,
        employmentType,
        page,
      ],
    );

  useEffect(() => {
    const timer =
      setTimeout(() => {
        loadJobs();
      }, 300);

    return () =>
      clearTimeout(timer);
  }, [loadJobs]);

  // --------------------------------------------------
  // Keep Company Filter In URL
  // --------------------------------------------------

  useEffect(() => {
    if (companyId) {
      setSearchParams({
        companyId,
      });
    } else {
      setSearchParams({});
    }
  }, [
    companyId,
    setSearchParams,
  ]);

  // --------------------------------------------------
  // Disable Job
  // --------------------------------------------------

  const handleDisable =
    async (
      job,
    ) => {
      const confirmed =
        window.confirm(
          `Disable "${job.title}"? It will be closed and removed from the public job board.`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(
          job._id,
        );

        setMessage("");
        setError("");

        const response =
          await api.patch(
            `/admin/jobs/${job._id}/moderate`,
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

        await loadJobs();
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to disable job",
        );
      } finally {
        setActionLoading("");
      }
    };

  // --------------------------------------------------
  // Open Restore Modal
  // --------------------------------------------------

  const openRestore =
    (job) => {
      setRestoreJob(job);

      setRestoreStatus(
        "draft",
      );

      setMessage("");
      setError("");
    };

  // --------------------------------------------------
  // Restore Job
  // --------------------------------------------------

  const handleRestore =
    async () => {
      if (!restoreJob) {
        return;
      }

      try {
        setActionLoading(
          restoreJob._id,
        );

        setMessage("");
        setError("");

        const response =
          await api.patch(
            `/admin/jobs/${restoreJob._id}/moderate`,
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

        setRestoreJob(null);

        await loadJobs();
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to restore job",
        );
      } finally {
        setActionLoading("");
      }
    };

  // --------------------------------------------------
  // Clear Filters
  // --------------------------------------------------

  const clearFilters =
    () => {
      setSearch("");
      setStatus("");
      setActive("");
      setCompanyId("");
      setWorkMode("");
      setEmploymentType("");
      setPage(1);

      setSearchParams({});
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
            Job Management
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-indigo-100/75">
            Review every job listing,
            inspect ownership and
            moderate jobs that should
            no longer appear publicly.
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

        {/* Filters */}

        <section className="portal-card mt-8 p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label
                htmlFor="jobSearch"
                className="form-label"
              >
                Search Jobs
              </label>

              <input
                id="jobSearch"
                value={search}
                onChange={(
                  event,
                ) => {
                  setSearch(
                    event.target.value,
                  );

                  setPage(1);
                }}
                placeholder="Title, location, skill..."
                className="form-input"
              />
            </div>

            <FilterSelect
              label="Job Status"
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

              <option value="draft">
                Draft
              </option>

              <option value="published">
                Published
              </option>

              <option value="closed">
                Closed
              </option>
            </FilterSelect>

            <FilterSelect
              label="Platform Status"
              value={active}
              onChange={(
                event,
              ) => {
                setActive(
                  event.target.value,
                );

                setPage(1);
              }}
            >
              <option value="">
                All Jobs
              </option>

              <option value="true">
                Active
              </option>

              <option value="false">
                Inactive
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
              label="Work Mode"
              value={workMode}
              onChange={(
                event,
              ) => {
                setWorkMode(
                  event.target.value,
                );

                setPage(1);
              }}
            >
              <option value="">
                All Modes
              </option>

              <option value="onsite">
                Onsite
              </option>

              <option value="hybrid">
                Hybrid
              </option>

              <option value="remote">
                Remote
              </option>
            </FilterSelect>

            <FilterSelect
              label="Employment"
              value={
                employmentType
              }
              onChange={(
                event,
              ) => {
                setEmploymentType(
                  event.target.value,
                );

                setPage(1);
              }}
            >
              <option value="">
                All Types
              </option>

              <option value="full-time">
                Full Time
              </option>

              <option value="part-time">
                Part Time
              </option>

              <option value="contract">
                Contract
              </option>

              <option value="internship">
                Internship
              </option>

              <option value="freelance">
                Freelance
              </option>
            </FilterSelect>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={
                clearFilters
              }
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </section>

        {/* Results Header */}

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              Listings
            </p>

            <h2 className="mt-2 section-title">
              Platform jobs
            </h2>
          </div>

          <p className="text-sm font-semibold text-slate-500">
            {total}{" "}
            {total === 1
              ? "job"
              : "jobs"}
          </p>
        </div>

        {/* Loading */}

        {loading && (
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading jobs...
              </p>
            </div>
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          jobs.length === 0 && (
            <div className="empty-state mt-6">
              <h3 className="text-2xl font-black text-slate-900">
                No jobs found
              </h3>

              <p className="mt-2 text-slate-500">
                Try changing your
                moderation filters.
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

        {/* Jobs */}

        {!loading &&
          jobs.length > 0 && (
            <div className="mt-6 space-y-5">
              {jobs.map(
                (job) => (
                  <AdminJobCard
                    key={
                      job._id
                    }
                    job={job}
                    loading={
                      actionLoading ===
                      job._id
                    }
                    onDisable={
                      handleDisable
                    }
                    onRestore={
                      openRestore
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
                        current - 1,
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
                        current + 1,
                      ),
                  )
                }
                className="btn-secondary"
              >
                Next
              </button>
            </div>
          )}

        {/* Restore Dialog */}

        {restoreJob && (
          <RestoreDialog
            job={restoreJob}
            status={
              restoreStatus
            }
            setStatus={
              setRestoreStatus
            }
            loading={
              actionLoading ===
              restoreJob._id
            }
            onRestore={
              handleRestore
            }
            onCancel={() =>
              setRestoreJob(null)
            }
          />
        )}
      </div>
    </main>
  );
}

// --------------------------------------------------
// Job Card
// --------------------------------------------------

function AdminJobCard({
  job,
  loading,
  onDisable,
  onRestore,
}) {
  return (
    <article className="portal-card p-6">
      <div className="flex flex-col justify-between gap-6 xl:flex-row">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-black text-slate-900">
              {job.title}
            </h3>

            <span
              className={jobStatusClass(
                job.status,
              )}
            >
              {formatValue(
                job.status,
              )}
            </span>

            <span
              className={
                job.isActive
                  ? "badge badge-success"
                  : "badge badge-danger"
              }
            >
              {job.isActive
                ? "Active"
                : "Inactive"}
            </span>

            {job.company
              ?.isVerified && (
              <span className="badge badge-primary">
                ✓ Verified Company
              </span>
            )}
          </div>

          <p className="mt-2 font-semibold text-indigo-600">
            {job.company?.name ||
              "Company unavailable"}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="badge badge-neutral">
              {formatValue(
                job.workMode,
              )}
            </span>

            <span className="badge badge-neutral">
              {formatValue(
                job.employmentType,
              )}
            </span>

            <span className="badge badge-neutral">
              {formatValue(
                job.experienceLevel,
              )}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-sm text-slate-500">
            <span>
              <strong className="text-slate-700">
                Location:
              </strong>{" "}
              {job.location}
            </span>

            <span>
              <strong className="text-slate-700">
                Recruiter:
              </strong>{" "}
              {job.recruiter
                ?.name ||
                "Unavailable"}
            </span>

            <span>
              <strong className="text-slate-700">
                Applications:
              </strong>{" "}
              {job.applicationCount ||
                0}
            </span>

            <span>
              <strong className="text-slate-700">
                Created:
              </strong>{" "}
              {formatDate(
                job.createdAt,
              )}
            </span>
          </div>

          {job.company &&
            !job.company
              .isActive && (
              <div className="alert-error mt-5">
                The owning company is
                inactive. This job
                cannot be restored until
                the company is active.
              </div>
            )}

          {job.recruiter &&
            !job.recruiter
              .isActive && (
              <div className="alert-info mt-5">
                The recruiter account
                for this job is
                currently inactive.
              </div>
            )}
        </div>

        <div className="flex shrink-0 flex-wrap items-start gap-3">
          <Link
            to={`/admin/jobs/${job._id}`}
            className="btn-primary"
          >
            View Details
          </Link>

          {job.isActive ? (
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                onDisable(job)
              }
              className="btn-danger"
            >
              {loading
                ? "Updating..."
                : "Disable"}
            </button>
          ) : (
            <button
              type="button"
              disabled={
                loading ||
                job.company
                  ?.isActive ===
                  false
              }
              onClick={() =>
                onRestore(job)
              }
              className="btn-secondary"
            >
              {loading
                ? "Updating..."
                : "Restore"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// --------------------------------------------------
// Restore Dialog
// --------------------------------------------------

function RestoreDialog({
  job,
  status,
  setStatus,
  loading,
  onRestore,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <p className="eyebrow">
          Restore Job
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-900">
          {job.title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Choose how this job should
          return to the platform.
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
            value={status}
            onChange={(
              event,
            ) =>
              setStatus(
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

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onRestore}
            className="btn-primary flex-1"
          >
            {loading
              ? "Restoring..."
              : "Restore Job"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
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
// Helpers
// --------------------------------------------------

function jobStatusClass(
  status,
) {
  if (
    status === "published"
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

export default AdminJobs;