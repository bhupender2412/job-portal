import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import api from "../../api/api";

function AdminCompanies() {
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
    verified,
    setVerified,
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
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  // --------------------------------------------------
  // Load Companies
  // --------------------------------------------------

  const loadCompanies =
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

          if (verified) {
            params.verified =
              verified;
          }

          const response =
            await api.get(
              "/admin/companies",
              {
                params,
              },
            );

          setCompanies(
            response.data
              .companies ||
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
          setCompanies([]);

          setError(
            error.response?.data
              ?.message ||
              "Failed to load companies",
          );
        } finally {
          setLoading(false);
        }
      },
      [
        search,
        status,
        verified,
        page,
      ],
    );

  useEffect(() => {
    const timer =
      setTimeout(() => {
        loadCompanies();
      }, 300);

    return () =>
      clearTimeout(timer);
  }, [loadCompanies]);

  // --------------------------------------------------
  // Verification
  // --------------------------------------------------

  const handleVerification =
    async (
      company,
    ) => {
      const nextVerified =
        !company.isVerified;

      if (
        company.isVerified
      ) {
        const confirmed =
          window.confirm(
            `Remove verification from ${company.name}?`,
          );

        if (!confirmed) {
          return;
        }
      }

      try {
        setActionLoading(
          `${company._id}-verify`,
        );

        setMessage("");
        setError("");

        const response =
          await api.patch(
            `/admin/companies/${company._id}/verification`,
            {
              isVerified:
                nextVerified,
            },
          );

        setMessage(
          response.data
            .message ||
            "Company verification updated",
        );

        await loadCompanies();
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to update company verification",
        );
      } finally {
        setActionLoading("");
      }
    };

  // --------------------------------------------------
  // Activate / Deactivate
  // --------------------------------------------------

  const handleStatus =
    async (
      company,
    ) => {
      const nextActive =
        !company.isActive;

      if (!nextActive) {
        const confirmed =
          window.confirm(
            `Deactivate ${company.name}? Active jobs belonging to this company will also be closed and disabled.`,
          );

        if (!confirmed) {
          return;
        }
      } else {
        const confirmed =
          window.confirm(
            `Activate ${company.name}? Existing jobs will remain in their current state.`,
          );

        if (!confirmed) {
          return;
        }
      }

      try {
        setActionLoading(
          `${company._id}-status`,
        );

        setMessage("");
        setError("");

        const response =
          await api.patch(
            `/admin/companies/${company._id}/status`,
            {
              isActive:
                nextActive,
            },
          );

        let successMessage =
          response.data
            .message ||
          "Company status updated";

        if (
          !nextActive &&
          response.data
            .affectedJobs >
            0
        ) {
          successMessage +=
            ` ${response.data.affectedJobs} job(s) were also disabled.`;
        }

        setMessage(
          successMessage,
        );

        await loadCompanies();
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to update company status",
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
      setVerified("");
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
            Company Management
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-indigo-100/75">
            Review recruiter companies,
            verify legitimate
            organizations and control
            access to the job platform.
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
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
            <div>
              <label
                htmlFor="companySearch"
                className="form-label"
              >
                Search
              </label>

              <input
                id="companySearch"
                value={search}
                onChange={(
                  event,
                ) => {
                  setSearch(
                    event.target.value,
                  );

                  setPage(1);
                }}
                placeholder="Company, industry, location..."
                className="form-input"
              />
            </div>

            <div>
              <label
                htmlFor="companyStatus"
                className="form-label"
              >
                Status
              </label>

              <select
                id="companyStatus"
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
                  All Companies
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="verification"
                className="form-label"
              >
                Verification
              </label>

              <select
                id="verification"
                value={verified}
                onChange={(
                  event,
                ) => {
                  setVerified(
                    event.target.value,
                  );

                  setPage(1);
                }}
                className="form-select"
              >
                <option value="">
                  All
                </option>

                <option value="true">
                  Verified
                </option>

                <option value="false">
                  Unverified
                </option>
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

        {/* Header */}

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              Companies
            </p>

            <h2 className="mt-2 section-title">
              Registered organizations
            </h2>
          </div>

          <p className="text-sm font-semibold text-slate-500">
            {total}{" "}
            {total === 1
              ? "company"
              : "companies"}
          </p>
        </div>

        {/* Loading */}

        {loading && (
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading companies...
              </p>
            </div>
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          companies.length ===
            0 && (
            <div className="empty-state mt-6">
              <h3 className="text-2xl font-black text-slate-900">
                No companies found
              </h3>

              <p className="mt-2 text-slate-500">
                Try changing your search
                or moderation filters.
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

        {/* Companies */}

        {!loading &&
          companies.length >
            0 && (
            <div className="mt-6 space-y-5">
              {companies.map(
                (
                  company,
                ) => (
                  <CompanyCard
                    key={
                      company._id
                    }
                    company={
                      company
                    }
                    verificationLoading={
                      actionLoading ===
                      `${company._id}-verify`
                    }
                    statusLoading={
                      actionLoading ===
                      `${company._id}-status`
                    }
                    onVerification={
                      handleVerification
                    }
                    onStatus={
                      handleStatus
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
// Company Card
// --------------------------------------------------

function CompanyCard({
  company,
  verificationLoading,
  statusLoading,
  onVerification,
  onStatus,
}) {
  return (
    <article className="portal-card p-6">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <CompanyLogo
            company={
              company
            }
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black text-slate-900">
                {company.name}
              </h3>

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

            <p className="mt-2 font-semibold text-indigo-600">
              {company.industry ||
                "Industry not added"}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <span>
                <strong className="text-slate-700">
                  Location:
                </strong>{" "}
                {company.location ||
                  "Not added"}
              </span>

              <span>
                <strong className="text-slate-700">
                  Recruiter:
                </strong>{" "}
                {company.recruiter
                  ?.name ||
                  "Not available"}
              </span>

              <span>
                <strong className="text-slate-700">
                  Created:
                </strong>{" "}
                {formatDate(
                  company.createdAt,
                )}
              </span>
            </div>

            {company.recruiter
              ?.email && (
              <p className="mt-2 text-sm text-slate-500">
                {
                  company.recruiter
                    .email
                }
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            to={`/admin/companies/${company._id}`}
            className="btn-primary"
          >
            View Details
          </Link>

          <button
            type="button"
            disabled={
              verificationLoading ||
              statusLoading
            }
            onClick={() =>
              onVerification(
                company,
              )
            }
            className="btn-secondary"
          >
            {verificationLoading
              ? "Updating..."
              : company.isVerified
                ? "Remove Verification"
                : "Verify"}
          </button>

          <button
            type="button"
            disabled={
              statusLoading ||
              verificationLoading
            }
            onClick={() =>
              onStatus(
                company,
              )
            }
            className={
              company.isActive
                ? "btn-danger"
                : "btn-secondary"
            }
          >
            {statusLoading
              ? "Updating..."
              : company.isActive
                ? "Deactivate"
                : "Activate"}
          </button>
        </div>
      </div>
    </article>
  );
}

// --------------------------------------------------
// Company Logo
// --------------------------------------------------

function CompanyLogo({
  company,
}) {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-100 text-xl font-black text-indigo-700">
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
  );
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

export default AdminCompanies;