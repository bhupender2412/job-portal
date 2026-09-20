import { Link } from "react-router-dom";

function JobCard({ job }) {
  const salary = formatSalary(job);

  return (
    <article className="portal-card portal-card-hover flex h-full flex-col p-6">
      {/* Company */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-100 font-black text-indigo-700">
          {job.company?.logoUrl ? (
            <img
              src={job.company.logoUrl}
              alt={job.company.name}
              className="h-full w-full object-cover"
            />
          ) : (
            job.company?.name?.charAt(0).toUpperCase() || "C"
          )}
        </div>

        <div className="min-w-0">
          <Link
            to={`/jobs/${job._id}`}
            className="text-lg font-black text-slate-900 transition hover:text-indigo-600"
          >
            {job.title}
          </Link>

          <p className="mt-1 truncate text-sm font-semibold text-indigo-600">
            {job.company?.name || "Company"}
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="badge badge-primary">
          {formatValue(job.employmentType)}
        </span>

        <span className="badge badge-neutral">{formatValue(job.workMode)}</span>

        <span className="badge badge-neutral">
          {formatValue(job.experienceLevel)}
        </span>

        {job.company?.isVerified && (
          <span className="badge badge-success">✓ Verified</span>
        )}
      </div>

      {/* Location */}
      <div className="mt-5 space-y-2 text-sm text-slate-500">
        <p>
          <span className="font-bold text-slate-700">Location:</span>{" "}
          {job.location}
        </p>

        <p>
          <span className="font-bold text-slate-700">Salary:</span> {salary}
        </p>

        <p>
          <span className="font-bold text-slate-700">Openings:</span>{" "}
          {job.openings || 1}
        </p>
      </div>

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {job.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-500">
        {job.description}
      </p>

      {/* Footer */}
      <div className="mt-auto border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-400">
            {formatDate(job.createdAt)}
          </span>

          <span className="text-xs font-semibold text-slate-500">
            {job.applicationCount || 0} applications
          </span>
        </div>

        <Link to={`/jobs/${job._id}`} className="btn-primary mt-4 w-full">
          View Details
        </Link>
      </div>
    </article>
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

function formatDate(date) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default JobCard;
