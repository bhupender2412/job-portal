import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";

import api from "../api/api";

function JobDetails() {
  const { jobId } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [isSaved, setIsSaved] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);

  const [application, setApplication] = useState(null);

  const [coverLetter, setCoverLetter] = useState("");

  const [applyLoading, setApplyLoading] = useState(false);

  const [actionMessage, setActionMessage] = useState("");

  const [actionError, setActionError] = useState("");

  const isJobSeeker = user?.role === "jobseeker";

  // ------------------------------------------------
  // Load Job
  // ------------------------------------------------

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await api.get(`/jobs/${jobId}`);

        setJob(response.data.job);
      } catch (error) {
        setJob(null);

        setError(error.response?.data?.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  // ------------------------------------------------
  // Load Job Seeker State
  // ------------------------------------------------

  useEffect(() => {
    if (!isAuthenticated || !isJobSeeker) {
      setIsSaved(false);

      setApplication(null);

      return;
    }

    const loadUserJobState = async () => {
      try {
        const [savedResponse, applicationResponse] = await Promise.all([
          api.get(`/saved-jobs/${jobId}/status`),

          api.get(`/applications/jobs/${jobId}/status`),
        ]);

        setIsSaved(savedResponse.data.isSaved);

        setApplication(applicationResponse.data.application);
      } catch (error) {
        console.error(
          "Failed to load job seeker state:",
          error.response?.data?.message || error.message,
        );
      }
    };

    loadUserJobState();
  }, [jobId, isAuthenticated, isJobSeeker]);

  // ------------------------------------------------
  // Save / Unsave
  // ------------------------------------------------

  const handleSaveJob = async () => {
    setActionMessage("");

    setActionError("");

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: location,
        },
      });

      return;
    }

    if (!isJobSeeker) {
      setActionError("Saved jobs are available to Job Seekers only.");

      return;
    }

    try {
      setSaveLoading(true);

      if (isSaved) {
        await api.delete(`/saved-jobs/${jobId}`);

        setIsSaved(false);

        setActionMessage("Job removed from saved jobs.");
      } else {
        await api.post(`/saved-jobs/${jobId}`);

        setIsSaved(true);

        setActionMessage("Job saved successfully.");
      }
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Saved job action failed",
      );
    } finally {
      setSaveLoading(false);
    }
  };

  // ------------------------------------------------
  // Apply
  // ------------------------------------------------

  const handleApply = async (event) => {
    event.preventDefault();

    setActionMessage("");

    setActionError("");

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: location,
        },
      });

      return;
    }

    if (!isJobSeeker) {
      setActionError("Only Job Seekers can apply for jobs.");

      return;
    }

    if (application) {
      setActionError("You have already applied to this job.");

      return;
    }

    try {
      setApplyLoading(true);

      const response = await api.post(`/applications/jobs/${jobId}`, {
        coverLetter: coverLetter.trim(),
      });

      setApplication(response.data.application);

      setCoverLetter("");

      setActionMessage(
        response.data.message || "Application submitted successfully.",
      );

      // Refresh application count.
      const jobResponse = await api.get(`/jobs/${jobId}`);

      setJob(jobResponse.data.job);
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Failed to submit application",
      );
    } finally {
      setApplyLoading(false);
    }
  };

  // ------------------------------------------------
  // Loading
  // ------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------
  // Error
  // ------------------------------------------------

  if (error || !job) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <div className="empty-state">
            <p className="eyebrow">Job Unavailable</p>

            <h1 className="mt-3 text-3xl font-black text-slate-900">
              This job could not be opened.
            </h1>

            <p className="mt-3 text-slate-500">
              {error || "The job is no longer available."}
            </p>

            <Link to="/jobs" className="btn-primary mt-6">
              Browse Jobs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const salary = formatSalary(job);

  return (
    <main className="page-shell">
      <div className="page-container">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-indigo-600">
            Home
          </Link>

          <span>/</span>

          <Link to="/jobs" className="hover:text-indigo-600">
            Jobs
          </Link>

          <span>/</span>

          <span className="font-semibold text-slate-700">{job.title}</span>
        </div>

        {/* Header */}
        <section className="portal-card mt-6 overflow-hidden">
          <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-7 text-white md:p-9">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-start">
              <div className="flex items-start gap-5">
                <CompanyLogo company={job.company} />

                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-indigo-100">
                      {formatValue(job.employmentType)}
                    </span>

                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-indigo-100">
                      {formatValue(job.workMode)}
                    </span>

                    {job.company?.isVerified && (
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">
                        ✓ Verified Company
                      </span>
                    )}
                  </div>

                  <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                    {job.title}
                  </h1>

                  <p className="mt-3 text-lg font-semibold text-indigo-200">
                    {job.company?.name}
                  </p>

                  <p className="mt-2 text-sm text-indigo-100/70">
                    {job.location}
                  </p>
                </div>
              </div>

              {(!isAuthenticated || isJobSeeker) && (
                <button
                  type="button"
                  onClick={handleSaveJob}
                  disabled={saveLoading}
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20 disabled:opacity-50"
                >
                  {saveLoading
                    ? "Updating..."
                    : isSaved
                      ? "♥ Saved"
                      : "♡ Save Job"}
                </button>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            <InfoBox label="Salary" value={salary} />

            <InfoBox label="Experience" value={formatExperience(job)} />

            <InfoBox label="Openings" value={job.openings || 1} />

            <InfoBox label="Applications" value={job.applicationCount || 0} />
          </div>
        </section>

        {(actionMessage || actionError) && (
          <div
            className={actionError ? "alert-error mt-6" : "alert-success mt-6"}
          >
            {actionError || actionMessage}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main */}
          <div className="space-y-7">
            <ContentSection title="About the role">
              <p className="whitespace-pre-line leading-7 text-slate-600">
                {job.description}
              </p>
            </ContentSection>

            {job.responsibilities?.length > 0 && (
              <ContentSection title="Responsibilities">
                <BulletList items={job.responsibilities} />
              </ContentSection>
            )}

            {job.requirements?.length > 0 && (
              <ContentSection title="Requirements">
                <BulletList items={job.requirements} />
              </ContentSection>
            )}

            {job.skills?.length > 0 && (
              <ContentSection title="Skills">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </ContentSection>
            )}

            <ContentSection title="Company">
              <div className="flex items-start gap-4">
                <CompanyLogo company={job.company} dark={false} />

                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {job.company?.name}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-indigo-600">
                    {job.company?.industry || "Company"}
                  </p>

                  {job.company?.description && (
                    <p className="mt-4 leading-7 text-slate-600">
                      {job.company.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    {job.company?.companySize && (
                      <span>{job.company.companySize} employees</span>
                    )}

                    {job.company?.foundedYear && (
                      <span>Founded {job.company.foundedYear}</span>
                    )}
                  </div>

                  {job.company?.website && (
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex text-sm font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Visit company website
                    </a>
                  )}
                </div>
              </div>
            </ContentSection>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section className="portal-card p-6">
              <p className="eyebrow">Apply Now</p>

              <h2 className="mt-2 text-xl font-black text-slate-900">
                Interested in this role?
              </h2>

              {!isAuthenticated && (
                <>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Sign in as a Job Seeker to save and apply for this job.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/login", {
                        state: {
                          from: location,
                        },
                      })
                    }
                    className="btn-primary mt-5 w-full"
                  >
                    Sign In to Apply
                  </button>
                </>
              )}

              {isAuthenticated && !isJobSeeker && (
                <div className="alert-info mt-5">
                  Job applications are available to Job Seekers only.
                </div>
              )}

              {isJobSeeker && application && (
                <div className="mt-5">
                  <div className="alert-success">
                    You already applied to this job.
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Application Status
                    </p>

                    <span
                      className={`mt-2 ${applicationStatusClass(
                        application.status,
                      )}`}
                    >
                      {formatValue(application.status)}
                    </span>

                    <Link
                      to="/applications"
                      className="btn-secondary mt-5 w-full"
                    >
                      View Applications
                    </Link>
                  </div>
                </div>
              )}

              {isJobSeeker && !application && (
                <form onSubmit={handleApply} className="mt-5">
                  <label htmlFor="coverLetter" className="form-label">
                    Cover Letter
                    <span className="ml-1 font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(event) => setCoverLetter(event.target.value)}
                    maxLength={3000}
                    placeholder="Briefly explain why you're interested in this opportunity..."
                    className="form-textarea"
                  />

                  <p className="mt-2 text-right text-xs text-slate-400">
                    {coverLetter.length}
                    /3000
                  </p>

                  <button
                    type="submit"
                    disabled={applyLoading}
                    className="btn-primary mt-4 w-full"
                  >
                    {applyLoading ? "Submitting..." : "Submit Application"}
                  </button>

                  {user?.resumeUrl ? (
                    <p className="mt-3 text-xs leading-5 text-emerald-600">
                      ✓ Your uploaded resume will be attached.
                    </p>
                  ) : (
                    <p className="mt-3 text-xs leading-5 text-amber-600">
                      You have not uploaded a resume yet. You can still apply
                      and add one from your profile.
                    </p>
                  )}
                </form>
              )}
            </section>

            <section className="portal-card p-6">
              <p className="text-sm font-extrabold text-slate-900">
                Job Details
              </p>

              <div className="mt-4 space-y-4 text-sm">
                <SideDetail
                  label="Work Mode"
                  value={formatValue(job.workMode)}
                />

                <SideDetail
                  label="Employment"
                  value={formatValue(job.employmentType)}
                />

                <SideDetail
                  label="Level"
                  value={formatValue(job.experienceLevel)}
                />

                <SideDetail label="Posted" value={formatDate(job.createdAt)} />

                <SideDetail
                  label="Deadline"
                  value={
                    job.applicationDeadline
                      ? formatDate(job.applicationDeadline)
                      : "No deadline"
                  }
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

function ContentSection({ title, children }) {
  return (
    <section className="portal-card p-6 md:p-8">
      <h2 className="text-xl font-black text-slate-900">{title}</h2>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-3 text-slate-600">
          <span className="mt-1 font-black text-indigo-600">✓</span>

          <span className="leading-7">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-extrabold text-slate-800">{value}</p>
    </div>
  );
}

function SideDetail({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-500">{label}</span>

      <span className="text-right font-bold text-slate-800">{value}</span>
    </div>
  );
}

function CompanyLogo({ company, dark = true }) {
  return (
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl font-black ${
        dark ? "bg-white/10 text-white" : "bg-indigo-100 text-indigo-700"
      }`}
    >
      {company?.logoUrl ? (
        <img
          src={company.logoUrl}
          alt={company.name}
          className="h-full w-full object-cover"
        />
      ) : (
        company?.name?.charAt(0).toUpperCase() || "C"
      )}
    </div>
  );
}

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function formatValue(value) {
  if (!value) {
    return "—";
  }

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatExperience(job) {
  const min = job.minExperience ?? 0;

  const max = job.maxExperience;

  if (min === 0 && (max === null || max === undefined)) {
    return "Fresher";
  }

  if (max !== null && max !== undefined) {
    return `${min} – ${max} years`;
  }

  return `${min}+ years`;
}

function formatSalary(job) {
  if (job.salaryMin == null && job.salaryMax == null) {
    return "Not disclosed";
  }

  const currency =
    job.salaryCurrency === "INR" ? "₹" : `${job.salaryCurrency || ""} `;

  const period = job.salaryPeriod ? ` / ${job.salaryPeriod}` : "";

  if (job.salaryMin != null && job.salaryMax != null) {
    return `${currency}${Number(job.salaryMin).toLocaleString(
      "en-IN",
    )} – ${currency}${Number(job.salaryMax).toLocaleString("en-IN")}${period}`;
  }

  if (job.salaryMin != null) {
    return `${currency}${Number(job.salaryMin).toLocaleString(
      "en-IN",
    )}+${period}`;
  }

  return `Up to ${currency}${Number(job.salaryMax).toLocaleString(
    "en-IN",
  )}${period}`;
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function applicationStatusClass(status) {
  if (status === "hired") {
    return "badge badge-success";
  }

  if (status === "rejected" || status === "withdrawn") {
    return "badge badge-danger";
  }

  if (status === "shortlisted" || status === "under-review") {
    return "badge badge-warning";
  }

  return "badge badge-primary";
}

export default JobDetails;
