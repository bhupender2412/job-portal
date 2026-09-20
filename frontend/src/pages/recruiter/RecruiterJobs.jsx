import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import api from "../../api/api";

const emptyForm = {
  title: "",
  description: "",
  responsibilities: "",
  requirements: "",
  skills: "",

  location: "",
  workMode: "onsite",
  employmentType:
    "full-time",
  experienceLevel:
    "fresher",

  minExperience: 0,
  maxExperience: "",

  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "INR",
  salaryPeriod: "year",

  openings: 1,
  applicationDeadline: "",

  status: "draft",
};

function RecruiterJobs() {
  const [
    jobs,
    setJobs,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] = useState("");

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingJobId,
    setEditingJobId,
  ] = useState(null);

  const [
    formData,
    setFormData,
  ] = useState(
    emptyForm,
  );

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  // ------------------------------------------------
  // Load Jobs
  // ------------------------------------------------

  const loadJobs =
    async () => {
      try {
        setLoading(true);
        setError("");

        const params = {};

        if (filter) {
          params.status =
            filter;
        }

        const response =
          await api.get(
            "/jobs/my",
            {
              params,
            },
          );

        setJobs(
          response.data.jobs ||
            [],
        );
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to load recruiter jobs",
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadJobs();
  }, [filter]);

  // ------------------------------------------------
  // Form Change
  // ------------------------------------------------

  const handleChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setFormData(
        (current) => ({
          ...current,

          [name]:
            value,
        }),
      );

      setMessage("");
      setError("");
    };

  // ------------------------------------------------
  // Start Create
  // ------------------------------------------------

  const handleCreate =
    () => {
      setEditingJobId(
        null,
      );

      setFormData(
        emptyForm,
      );

      setShowForm(true);

      setMessage("");
      setError("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  // ------------------------------------------------
  // Start Edit
  // ------------------------------------------------

  const handleEdit =
    async (
      jobId,
    ) => {
      try {
        setActionLoading(
          jobId,
        );

        setMessage("");
        setError("");

        const response =
          await api.get(
            `/jobs/my/${jobId}`,
          );

        const job =
          response.data.job;

        setEditingJobId(
          job._id,
        );

        setFormData({
          title:
            job.title ||
            "",

          description:
            job.description ||
            "",

          responsibilities:
            arrayToText(
              job.responsibilities,
            ),

          requirements:
            arrayToText(
              job.requirements,
            ),

          skills:
            arrayToText(
              job.skills,
            ),

          location:
            job.location ||
            "",

          workMode:
            job.workMode ||
            "onsite",

          employmentType:
            job.employmentType ||
            "full-time",

          experienceLevel:
            job.experienceLevel ||
            "fresher",

          minExperience:
            job.minExperience ??
            0,

          maxExperience:
            job.maxExperience ??
            "",

          salaryMin:
            job.salaryMin ??
            "",

          salaryMax:
            job.salaryMax ??
            "",

          salaryCurrency:
            job.salaryCurrency ||
            "INR",

          salaryPeriod:
            job.salaryPeriod ||
            "year",

          openings:
            job.openings ||
            1,

          applicationDeadline:
            formatDateInput(
              job.applicationDeadline,
            ),

          status:
            job.status ||
            "draft",
        });

        setShowForm(true);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to load job",
        );
      } finally {
        setActionLoading("");
      }
    };

  // ------------------------------------------------
  // Cancel Form
  // ------------------------------------------------

  const handleCancel =
    () => {
      setShowForm(false);

      setEditingJobId(
        null,
      );

      setFormData(
        emptyForm,
      );

      setError("");
    };

  // ------------------------------------------------
  // Save Job
  // ------------------------------------------------

  const handleSubmit =
    async (
      event,
    ) => {
      event.preventDefault();

      setMessage("");
      setError("");

      if (
        !formData.title.trim() ||
        !formData.description.trim() ||
        !formData.location.trim()
      ) {
        setError(
          "Title, description and location are required.",
        );

        return;
      }

      const payload = {
        title:
          formData.title.trim(),

        description:
          formData.description.trim(),

        responsibilities:
          textToArray(
            formData.responsibilities,
          ),

        requirements:
          textToArray(
            formData.requirements,
          ),

        skills:
          textToArray(
            formData.skills,
          ),

        location:
          formData.location.trim(),

        workMode:
          formData.workMode,

        employmentType:
          formData.employmentType,

        experienceLevel:
          formData.experienceLevel,

        minExperience:
          Number(
            formData.minExperience,
          ) || 0,

        maxExperience:
          formData.maxExperience ===
          ""
            ? null
            : Number(
                formData.maxExperience,
              ),

        salaryMin:
          formData.salaryMin ===
          ""
            ? null
            : Number(
                formData.salaryMin,
              ),

        salaryMax:
          formData.salaryMax ===
          ""
            ? null
            : Number(
                formData.salaryMax,
              ),

        salaryCurrency:
          formData.salaryCurrency,

        salaryPeriod:
          formData.salaryPeriod,

        openings:
          Number(
            formData.openings,
          ) || 1,

        applicationDeadline:
          formData.applicationDeadline ||
          null,
      };

      // Status is sent on creation.
      if (!editingJobId) {
        payload.status =
          formData.status;
      }

      try {
        setSaving(true);

        const response =
          editingJobId
            ? await api.patch(
                `/jobs/my/${editingJobId}`,
                payload,
              )
            : await api.post(
                "/jobs",
                payload,
              );

        setMessage(
          response.data
            .message ||
            (editingJobId
              ? "Job updated successfully"
              : "Job created successfully"),
        );

        setShowForm(false);

        setEditingJobId(
          null,
        );

        setFormData(
          emptyForm,
        );

        await loadJobs();
      } catch (error) {
        const data =
          error.response?.data;

        if (
          Array.isArray(
            data?.errors,
          ) &&
          data.errors.length >
            0
        ) {
          setError(
            data.errors
              .map(
                (item) =>
                  item.message,
              )
              .join(" • "),
          );
        } else {
          setError(
            data?.message ||
              "Failed to save job",
          );
        }
      } finally {
        setSaving(false);
      }
    };

  // ------------------------------------------------
  // Change Status
  // ------------------------------------------------

  const handleStatus =
    async (
      jobId,
      status,
    ) => {
      try {
        setActionLoading(
          jobId,
        );

        setMessage("");
        setError("");

        const response =
          await api.patch(
            `/jobs/my/${jobId}/status`,
            {
              status,
            },
          );

        setMessage(
          response.data
            .message ||
            `Job moved to ${status}`,
        );

        await loadJobs();
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to update job status",
        );
      } finally {
        setActionLoading("");
      }
    };

  // ------------------------------------------------
  // Deactivate
  // ------------------------------------------------

  const handleDeactivate =
    async (
      jobId,
    ) => {
      const confirmed =
        window.confirm(
          "Deactivate this job? It will no longer appear on the public job board.",
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(
          jobId,
        );

        setMessage("");
        setError("");

        const response =
          await api.delete(
            `/jobs/my/${jobId}`,
          );

        setMessage(
          response.data
            .message ||
            "Job deactivated successfully",
        );

        await loadJobs();
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to deactivate job",
        );
      } finally {
        setActionLoading("");
      }
    };

  return (
    <main className="page-shell">
      <div className="page-container">
        {/* Hero */}
        <section className="rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 px-7 py-9 text-white md:px-10 md:py-11">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-200">
                Recruiter
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                Manage your job listings.
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-indigo-100/75">
                Create opportunities,
                manage drafts, publish
                jobs and monitor candidate
                interest.
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleCreate
              }
              className="rounded-xl bg-white px-5 py-3 text-sm font-black text-indigo-700 transition hover:bg-indigo-50"
            >
              + Create Job
            </button>
          </div>
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

        {/* ------------------------------------------------
            Create / Edit Form
        ------------------------------------------------ */}

        {showForm && (
          <section className="portal-card mt-8 p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">
                  {editingJobId
                    ? "Edit Job"
                    : "New Opportunity"}
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  {editingJobId
                    ? "Update job listing"
                    : "Create a job listing"}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  handleCancel
                }
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-8 space-y-6"
            >
              <div>
                <label
                  htmlFor="title"
                  className="form-label"
                >
                  Job Title
                </label>

                <input
                  id="title"
                  name="title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Junior MERN Stack Developer"
                  className="form-input"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="form-label"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Describe the role, team and opportunity..."
                  className="form-textarea min-h-40"
                />
              </div>

              <ListField
                name="responsibilities"
                label="Responsibilities"
                value={
                  formData.responsibilities
                }
                onChange={
                  handleChange
                }
                placeholder="Build React interfaces, Develop APIs, Collaborate with the team"
              />

              <ListField
                name="requirements"
                label="Requirements"
                value={
                  formData.requirements
                }
                onChange={
                  handleChange
                }
                placeholder="JavaScript fundamentals, React knowledge, MongoDB basics"
              />

              <ListField
                name="skills"
                label="Skills"
                value={
                  formData.skills
                }
                onChange={
                  handleChange
                }
                placeholder="JavaScript, React, Node.js, Express, MongoDB"
              />

              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  name="location"
                  label="Location"
                  value={
                    formData.location
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Chandigarh, India"
                />

                <SelectField
                  name="workMode"
                  label="Work Mode"
                  value={
                    formData.workMode
                  }
                  onChange={
                    handleChange
                  }
                  options={[
                    [
                      "onsite",
                      "Onsite",
                    ],
                    [
                      "hybrid",
                      "Hybrid",
                    ],
                    [
                      "remote",
                      "Remote",
                    ],
                  ]}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  name="employmentType"
                  label="Employment Type"
                  value={
                    formData.employmentType
                  }
                  onChange={
                    handleChange
                  }
                  options={[
                    [
                      "full-time",
                      "Full Time",
                    ],
                    [
                      "part-time",
                      "Part Time",
                    ],
                    [
                      "contract",
                      "Contract",
                    ],
                    [
                      "internship",
                      "Internship",
                    ],
                    [
                      "freelance",
                      "Freelance",
                    ],
                  ]}
                />

                <SelectField
                  name="experienceLevel"
                  label="Experience Level"
                  value={
                    formData.experienceLevel
                  }
                  onChange={
                    handleChange
                  }
                  options={[
                    [
                      "fresher",
                      "Fresher",
                    ],
                    [
                      "junior",
                      "Junior",
                    ],
                    [
                      "mid",
                      "Mid",
                    ],
                    [
                      "senior",
                      "Senior",
                    ],
                    [
                      "lead",
                      "Lead",
                    ],
                  ]}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  name="minExperience"
                  label="Minimum Experience"
                  type="number"
                  min="0"
                  step="0.5"
                  value={
                    formData.minExperience
                  }
                  onChange={
                    handleChange
                  }
                />

                <InputField
                  name="maxExperience"
                  label="Maximum Experience"
                  type="number"
                  min="0"
                  step="0.5"
                  value={
                    formData.maxExperience
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Optional"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  name="salaryMin"
                  label="Minimum Salary"
                  type="number"
                  min="0"
                  value={
                    formData.salaryMin
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="300000"
                />

                <InputField
                  name="salaryMax"
                  label="Maximum Salary"
                  type="number"
                  min="0"
                  value={
                    formData.salaryMax
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="600000"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  name="salaryCurrency"
                  label="Currency"
                  value={
                    formData.salaryCurrency
                  }
                  onChange={
                    handleChange
                  }
                  options={[
                    [
                      "INR",
                      "INR",
                    ],
                    [
                      "USD",
                      "USD",
                    ],
                    [
                      "EUR",
                      "EUR",
                    ],
                  ]}
                />

                <SelectField
                  name="salaryPeriod"
                  label="Salary Period"
                  value={
                    formData.salaryPeriod
                  }
                  onChange={
                    handleChange
                  }
                  options={[
                    [
                      "year",
                      "Per Year",
                    ],
                    [
                      "month",
                      "Per Month",
                    ],
                    [
                      "hour",
                      "Per Hour",
                    ],
                  ]}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  name="openings"
                  label="Openings"
                  type="number"
                  min="1"
                  value={
                    formData.openings
                  }
                  onChange={
                    handleChange
                  }
                />

                <InputField
                  name="applicationDeadline"
                  label="Application Deadline"
                  type="date"
                  value={
                    formData.applicationDeadline
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              {!editingJobId && (
                <SelectField
                  name="status"
                  label="Initial Status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                  options={[
                    [
                      "draft",
                      "Save as Draft",
                    ],
                    [
                      "published",
                      "Publish Immediately",
                    ],
                  ]}
                />
              )}

              <div className="border-t border-slate-100 pt-6">
                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="btn-primary"
                >
                  {saving
                    ? "Saving..."
                    : editingJobId
                      ? "Save Changes"
                      : "Create Job"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ------------------------------------------------
            Filters
        ------------------------------------------------ */}

        <section className="portal-card mt-8 p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">
                Job Listings
              </p>

              <h2 className="mt-2 section-title">
                My jobs
              </h2>
            </div>

            <div className="w-full sm:w-56">
              <label
                htmlFor="filter"
                className="form-label"
              >
                Status
              </label>

              <select
                id="filter"
                value={
                  filter
                }
                onChange={(
                  event,
                ) =>
                  setFilter(
                    event.target.value,
                  )
                }
                className="form-select"
              >
                <option value="">
                  All Jobs
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
              </select>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------
            Loading
        ------------------------------------------------ */}

        {loading && (
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading your jobs...
              </p>
            </div>
          </div>
        )}

        {/* ------------------------------------------------
            Empty
        ------------------------------------------------ */}

        {!loading &&
          jobs.length ===
            0 && (
            <div className="empty-state mt-6">
              <h3 className="text-2xl font-black text-slate-900">
                No jobs found
              </h3>

              <p className="mt-2 text-slate-500">
                {filter
                  ? "You don't have any jobs with this status."
                  : "Create your first opportunity to start receiving applications."}
              </p>

              {!filter && (
                <button
                  type="button"
                  onClick={
                    handleCreate
                  }
                  className="btn-primary mt-6"
                >
                  Create Job
                </button>
              )}
            </div>
          )}

        {/* ------------------------------------------------
            Jobs
        ------------------------------------------------ */}

        {!loading &&
          jobs.length >
            0 && (
            <div className="mt-6 space-y-5">
              {jobs.map(
                (job) => (
                  <RecruiterJobCard
                    key={
                      job._id
                    }
                    job={job}
                    loading={
                      actionLoading ===
                      job._id
                    }
                    onEdit={
                      handleEdit
                    }
                    onStatus={
                      handleStatus
                    }
                    onDeactivate={
                      handleDeactivate
                    }
                  />
                ),
              )}
            </div>
          )}
      </div>
    </main>
  );
}

// --------------------------------------------------
// Job Card
// --------------------------------------------------

function RecruiterJobCard({
  job,
  loading,
  onEdit,
  onStatus,
  onDeactivate,
}) {
  return (
    <article className="portal-card p-6">
      <div className="flex flex-col justify-between gap-6 xl:flex-row">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
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

            {!job.isActive && (
              <span className="badge badge-danger">
                Inactive
              </span>
            )}
          </div>

          <p className="mt-2 font-semibold text-indigo-600">
            {job.company
              ?.name ||
              "Company"}
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
                Openings:
              </strong>{" "}
              {job.openings ||
                1}
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
        </div>

        <div className="flex shrink-0 flex-wrap items-start gap-3">
          <button
            type="button"
            disabled={
              loading
            }
            onClick={() =>
              onEdit(
                job._id,
              )
            }
            className="btn-secondary"
          >
            Edit
          </button>

          {job.status ===
            "draft" &&
            job.isActive !==
              false && (
              <button
                type="button"
                disabled={
                  loading
                }
                onClick={() =>
                  onStatus(
                    job._id,
                    "published",
                  )
                }
                className="btn-primary"
              >
                Publish
              </button>
            )}

          {job.status ===
            "published" &&
            job.isActive !==
              false && (
              <button
                type="button"
                disabled={
                  loading
                }
                onClick={() =>
                  onStatus(
                    job._id,
                    "closed",
                  )
                }
                className="btn-secondary"
              >
                Close
              </button>
            )}

          {job.status ===
            "published" &&
            job.isActive !==
              false && (
              <Link
                to={`/jobs/${job._id}`}
                className="btn-secondary"
              >
                Public View
              </Link>
            )}

          {job.isActive !==
            false && (
            <button
              type="button"
              disabled={
                loading
              }
              onClick={() =>
                onDeactivate(
                  job._id,
                )
              }
              className="btn-danger"
            >
              Deactivate
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// --------------------------------------------------
// Reusable Fields
// --------------------------------------------------

function InputField({
  name,
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  min,
  max,
  step,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="form-label"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={
          placeholder
        }
        min={min}
        max={max}
        step={step}
        className="form-input"
      />
    </div>
  );
}

function SelectField({
  name,
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="form-label"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={
          onChange
        }
        className="form-select"
      >
        {options.map(
          ([
            optionValue,
            optionLabel,
          ]) => (
            <option
              key={
                optionValue
              }
              value={
                optionValue
              }
            >
              {optionLabel}
            </option>
          ),
        )}
      </select>
    </div>
  );
}

function ListField({
  name,
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="form-label"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={
          onChange
        }
        placeholder={
          placeholder
        }
        className="form-textarea"
      />

      <p className="mt-2 text-xs text-slate-400">
        Separate each item with
        a comma or new line.
      </p>
    </div>
  );
}

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function textToArray(
  value,
) {
  return [
    ...new Set(
      value
        .split(
          /[\n,]+/,
        )
        .map(
          (item) =>
            item.trim(),
        )
        .filter(Boolean),
    ),
  ];
}

function arrayToText(
  items,
) {
  if (
    !Array.isArray(
      items,
    )
  ) {
    return "";
  }

  return items.join(
    ", ",
  );
}

function formatDateInput(
  value,
) {
  if (!value) {
    return "";
  }

  return new Date(
    value,
  )
    .toISOString()
    .split("T")[0];
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

function jobStatusClass(
  status,
) {
  if (
    status ===
    "published"
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

export default RecruiterJobs;