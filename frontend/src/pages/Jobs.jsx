import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchJobs,
} from "../features/jobs/jobsSlice";

import JobCard from "../components/jobs/JobCard";

function Jobs() {
  const dispatch =
    useDispatch();

  const {
    jobs,
    page,
    pages,
    total,
    loading,
    error,
  } = useSelector(
    (state) =>
      state.jobs,
  );

  const [
    filters,
    setFilters,
  ] = useState({
    search: "",
    location: "",
    workMode: "",
    employmentType: "",
    experienceLevel: "",
    skill: "",
    sort: "newest",
  });

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  // ------------------------------------------------
  // Load Jobs
  // ------------------------------------------------

  useEffect(() => {
    const params = {
      page:
        currentPage,

      limit: 6,

      sort:
        filters.sort,
    };

    Object.entries(
      filters,
    ).forEach(
      ([
        key,
        value,
      ]) => {
        if (
          value &&
          key !== "sort"
        ) {
          params[key] =
            value;
        }
      },
    );

    dispatch(
      fetchJobs(params),
    );
  }, [
    dispatch,
    currentPage,
    filters,
  ]);

  // ------------------------------------------------
  // Change
  // ------------------------------------------------

  const handleChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setFilters(
        (current) => ({
          ...current,

          [name]:
            value,
        }),
      );

      setCurrentPage(
        1,
      );
    };

  // ------------------------------------------------
  // Clear Filters
  // ------------------------------------------------

  const clearFilters =
    () => {
      setFilters({
        search: "",
        location: "",
        workMode: "",
        employmentType:
          "",
        experienceLevel:
          "",
        skill: "",
        sort: "newest",
      });

      setCurrentPage(
        1,
      );
    };

  return (
    <main className="page-shell">
      <div className="page-container">
        {/* Header */}
        <section className="rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 px-6 py-10 text-white md:px-10 md:py-12">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-200">
            Opportunities
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            Find a job that matches
            your skills.
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-indigo-100/75">
            Search current
            opportunities by role,
            location, work mode,
            experience and skills.
          </p>
        </section>

        {/* Search */}
        <section className="portal-card mt-8 p-5 md:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_auto]">
            <div>
              <label
                htmlFor="search"
                className="form-label"
              >
                Search
              </label>

              <input
                id="search"
                name="search"
                value={
                  filters.search
                }
                onChange={
                  handleChange
                }
                placeholder="MERN, React, Developer..."
                className="form-input"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="form-label"
              >
                Location
              </label>

              <input
                id="location"
                name="location"
                value={
                  filters.location
                }
                onChange={
                  handleChange
                }
                placeholder="Chandigarh, Remote..."
                className="form-input"
              />
            </div>

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

          {/* Filters */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect
              name="workMode"
              label="Work Mode"
              value={
                filters.workMode
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

            <FilterSelect
              name="employmentType"
              label="Employment"
              value={
                filters.employmentType
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

            <FilterSelect
              name="experienceLevel"
              label="Experience"
              value={
                filters.experienceLevel
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

            <div>
              <label
                htmlFor="skill"
                className="form-label"
              >
                Skill
              </label>

              <input
                id="skill"
                name="skill"
                value={
                  filters.skill
                }
                onChange={
                  handleChange
                }
                placeholder="React"
                className="form-input"
              />
            </div>

            <FilterSelect
              name="sort"
              label="Sort By"
              value={
                filters.sort
              }
              onChange={
                handleChange
              }
              showAll={
                false
              }
              options={[
                [
                  "newest",
                  "Newest",
                ],
                [
                  "oldest",
                  "Oldest",
                ],
                [
                  "salary-high",
                  "Salary: High",
                ],
                [
                  "salary-low",
                  "Salary: Low",
                ],
              ]}
            />
          </div>
        </section>

        {/* Results Header */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              Job Listings
            </p>

            <h2 className="mt-2 section-title">
              Available Opportunities
            </h2>
          </div>

          <p className="text-sm font-semibold text-slate-500">
            {total}{" "}
            {total === 1
              ? "job"
              : "jobs"}{" "}
            found
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert-error mt-6">
            {error}
          </div>
        )}

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
          jobs.length ===
            0 && (
            <div className="empty-state mt-6">
              <h3 className="text-2xl font-black text-slate-900">
                No jobs found
              </h3>

              <p className="mt-2 text-slate-500">
                Try changing or
                clearing your
                search filters.
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

        {/* Job Grid */}
        {!loading &&
          jobs.length >
            0 && (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map(
                (job) => (
                  <JobCard
                    key={
                      job._id
                    }
                    job={
                      job
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
// Select
// --------------------------------------------------

function FilterSelect({
  name,
  label,
  value,
  onChange,
  options,
  showAll = true,
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
        {showAll && (
          <option value="">
            All
          </option>
        )}

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

export default Jobs;