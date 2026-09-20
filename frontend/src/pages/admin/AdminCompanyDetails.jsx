import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../../api/api";

function AdminCompanyDetails() {
  const {
    companyId,
  } = useParams();

  const [
    company,
    setCompany,
  ] = useState(null);

  const [
    jobStats,
    setJobStats,
  ] = useState({
    total: 0,
    published: 0,
    draft: 0,
    closed: 0,
  });

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
  // Load Company
  // --------------------------------------------------

  const loadCompany =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            `/admin/companies/${companyId}`,
          );

        setCompany(
          response.data.company,
        );

        setJobStats(
          response.data.jobStats || {
            total: 0,
            published: 0,
            draft: 0,
            closed: 0,
          },
        );
      } catch (error) {
        setCompany(null);

        setError(
          error.response?.data
            ?.message ||
            "Failed to load company",
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadCompany();
  }, [companyId]);

  // --------------------------------------------------
  // Verification
  // --------------------------------------------------

  const handleVerification =
    async () => {
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
          "verification",
        );

        setMessage("");
        setError("");

        const response =
          await api.patch(
            `/admin/companies/${companyId}/verification`,
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

        await loadCompany();
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
  // Status
  // --------------------------------------------------

  const handleStatus =
    async () => {
      const nextActive =
        !company.isActive;

      const confirmed =
        window.confirm(
          nextActive
            ? `Activate ${company.name}? Existing jobs will remain in their current state.`
            : `Deactivate ${company.name}? All active jobs belonging to this company will also be closed and disabled.`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(
          "status",
        );

        setMessage("");
        setError("");

        const response =
          await api.patch(
            `/admin/companies/${companyId}/status`,
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

        await loadCompany();
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
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading company...
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
    !company
  ) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <div className="empty-state">
            <h1 className="text-3xl font-black text-slate-900">
              Company unavailable
            </h1>

            <p className="mt-3 text-slate-500">
              {error}
            </p>

            <Link
              to="/admin/companies"
              className="btn-primary mt-6"
            >
              Back to Companies
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const recruiter =
    company.recruiter;

  return (
    <main className="page-shell">
      <div className="page-container">
        <Link
          to="/admin/companies"
          className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Companies
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

        {/* Company Header */}

        <section className="portal-card mt-6 overflow-hidden">
          <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-7 text-white md:p-9">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-start">
              <div className="flex items-start gap-5">
                <CompanyLogo
                  company={
                    company
                  }
                />

                <div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        company.isVerified
                          ? "bg-emerald-400/15 text-emerald-200"
                          : "bg-amber-400/15 text-amber-200"
                      }`}
                    >
                      {company.isVerified
                        ? "✓ Verified"
                        : "Unverified"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        company.isActive
                          ? "bg-emerald-400/15 text-emerald-200"
                          : "bg-red-400/15 text-red-200"
                      }`}
                    >
                      {company.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                    {company.name}
                  </h1>

                  <p className="mt-2 font-semibold text-indigo-200">
                    {company.industry ||
                      "Industry not added"}
                  </p>

                  <p className="mt-2 text-sm text-indigo-100/70">
                    {company.location ||
                      "Location not added"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={
                    Boolean(
                      actionLoading,
                    )
                  }
                  onClick={
                    handleVerification
                  }
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
                >
                  {actionLoading ===
                  "verification"
                    ? "Updating..."
                    : company.isVerified
                      ? "Remove Verification"
                      : "Verify Company"}
                </button>

                <button
                  type="button"
                  disabled={
                    Boolean(
                      actionLoading,
                    )
                  }
                  onClick={
                    handleStatus
                  }
                  className={`rounded-xl px-5 py-3 text-sm font-bold text-white transition ${
                    company.isActive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {actionLoading ===
                  "status"
                    ? "Updating..."
                    : company.isActive
                      ? "Deactivate"
                      : "Activate"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Job Statistics */}

        <section className="mt-8">
          <p className="eyebrow">
            Job Activity
          </p>

          <h2 className="mt-2 section-title">
            Company job statistics
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Jobs"
              value={
                jobStats.total
              }
            />

            <StatCard
              label="Published"
              value={
                jobStats.published
              }
            />

            <StatCard
              label="Draft"
              value={
                jobStats.draft
              }
            />

            <StatCard
              label="Closed"
              value={
                jobStats.closed
              }
            />
          </div>
        </section>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_340px]">
          {/* Main */}

          <div className="space-y-7">
            <section className="portal-card p-6 md:p-8">
              <h2 className="text-xl font-black text-slate-900">
                Company Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Detail
                  label="Company Name"
                  value={
                    company.name
                  }
                />

                <Detail
                  label="Industry"
                  value={
                    company.industry
                  }
                />

                <Detail
                  label="Location"
                  value={
                    company.location
                  }
                />

                <Detail
                  label="Company Email"
                  value={
                    company.companyEmail
                  }
                />

                <Detail
                  label="Company Size"
                  value={
                    company.companySize
                  }
                />

                <Detail
                  label="Founded"
                  value={
                    company.foundedYear
                  }
                />

                <Detail
                  label="Slug"
                  value={
                    company.slug
                  }
                />

                <Detail
                  label="Created"
                  value={formatDateTime(
                    company.createdAt,
                  )}
                />
              </div>

              {company.description && (
                <div className="mt-7 border-t border-slate-100 pt-6">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                    Description
                  </p>

                  <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                    {
                      company.description
                    }
                  </p>
                </div>
              )}

              {company.website && (
                <a
                  href={
                    company.website
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary mt-6"
                >
                  Visit Company Website
                </a>
              )}
            </section>

            {/* Recruiter */}

            <section className="portal-card p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">
                    Recruiter
                  </p>

                  <h2 className="mt-2 text-xl font-black text-slate-900">
                    Company owner
                  </h2>
                </div>

                {recruiter?._id && (
                  <Link
                    to={`/admin/users/${recruiter._id}`}
                    className="btn-secondary"
                  >
                    View Recruiter
                  </Link>
                )}
              </div>

              {recruiter ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
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

                  <Detail
                    label="Joined"
                    value={formatDateTime(
                      recruiter.createdAt,
                    )}
                  />
                </div>
              ) : (
                <div className="alert-info mt-6">
                  Recruiter information
                  is unavailable.
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}

          <aside className="space-y-6">
            <section className="portal-card p-6">
              <p className="eyebrow">
                Moderation
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-900">
                Company Status
              </h2>

              <div className="mt-5 space-y-3">
                <StatusRow
                  label="Verification"
                  value={
                    company.isVerified
                      ? "Verified"
                      : "Unverified"
                  }
                  positive={
                    company.isVerified
                  }
                />

                <StatusRow
                  label="Platform Access"
                  value={
                    company.isActive
                      ? "Active"
                      : "Inactive"
                  }
                  positive={
                    company.isActive
                  }
                />
              </div>

              {!company.isActive && (
                <div className="alert-error mt-5">
                  This company is
                  disabled. Its active
                  jobs were closed when
                  the company was
                  deactivated.
                </div>
              )}

              {!company.isVerified && (
                <div className="alert-info mt-5">
                  This company has not
                  been verified by an
                  Admin.
                </div>
              )}
            </section>

            <section className="portal-card p-6">
              <h2 className="font-black text-slate-900">
                Job Management
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review all job listings
                belonging to this
                company from the Admin
                jobs area.
              </p>

              <Link
                to={`/admin/jobs?companyId=${company._id}`}
                className="btn-primary mt-5 w-full"
              >
                View Company Jobs
              </Link>
            </section>

            <section className="portal-card p-6">
              <h2 className="font-black text-slate-900">
                Record Information
              </h2>

              <div className="mt-5 space-y-4">
                <Detail
                  label="Company ID"
                  value={
                    company._id
                  }
                />

                <Detail
                  label="Last Updated"
                  value={formatDateTime(
                    company.updatedAt,
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

function CompanyLogo({
  company,
}) {
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10 text-2xl font-black text-white">
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

function StatusRow({
  label,
  value,
  positive,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-semibold text-slate-500">
        {label}
      </span>

      <span
        className={
          positive
            ? "badge badge-success"
            : "badge badge-danger"
        }
      >
        {value}
      </span>
    </div>
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

export default AdminCompanyDetails;