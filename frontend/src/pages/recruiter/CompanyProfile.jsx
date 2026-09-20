import {
  useEffect,
  useState,
} from "react";

import api from "../../api/api";

const emptyForm = {
  name: "",
  description: "",
  industry: "",
  location: "",
  website: "",
  companyEmail: "",
  logoUrl: "",
  companySize: "",
  foundedYear: "",
};

function CompanyProfile() {
  const [
    company,
    setCompany,
  ] = useState(null);

  const [
    formData,
    setFormData,
  ] = useState(
    emptyForm,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    hasCompany,
    setHasCompany,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  // ------------------------------------------------
  // Load Company
  // ------------------------------------------------

  useEffect(() => {
    const loadCompany =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await api.get(
              "/companies/my",
            );

          const currentCompany =
            response.data.company;

          setCompany(
            currentCompany,
          );

          setHasCompany(
            true,
          );

          fillForm(
            currentCompany,
          );
        } catch (error) {
          if (
            error.response
              ?.status ===
            404
          ) {
            setHasCompany(
              false,
            );

            setCompany(
              null,
            );

            setFormData(
              emptyForm,
            );

            return;
          }

          setError(
            error.response?.data
              ?.message ||
              "Failed to load company profile",
          );
        } finally {
          setLoading(
            false,
          );
        }
      };

    loadCompany();
  }, []);

  // ------------------------------------------------
  // Fill Form
  // ------------------------------------------------

  const fillForm = (
    data,
  ) => {
    setFormData({
      name:
        data?.name ||
        "",

      description:
        data?.description ||
        "",

      industry:
        data?.industry ||
        "",

      location:
        data?.location ||
        "",

      website:
        data?.website ||
        "",

      companyEmail:
        data?.companyEmail ||
        "",

      logoUrl:
        data?.logoUrl ||
        "",

      companySize:
        data?.companySize ||
        "",

      foundedYear:
        data?.foundedYear ??
        "",
    });
  };

  // ------------------------------------------------
  // Change
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
  // Save
  // ------------------------------------------------

  const handleSubmit =
    async (
      event,
    ) => {
      event.preventDefault();

      setMessage("");
      setError("");

      const name =
        formData.name.trim();

      const description =
        formData.description.trim();

      const industry =
        formData.industry.trim();

      const location =
        formData.location.trim();

      if (
        !name ||
        !description ||
        !industry ||
        !location
      ) {
        setError(
          "Company name, description, industry and location are required.",
        );

        return;
      }

      const payload = {
        name,
        description,
        industry,
        location,
      };

      if (
        formData.website.trim()
      ) {
        payload.website =
          formData.website.trim();
      }

      if (
        formData.companyEmail.trim()
      ) {
        payload.companyEmail =
          formData.companyEmail.trim();
      }

      if (
        formData.logoUrl.trim()
      ) {
        payload.logoUrl =
          formData.logoUrl.trim();
      }

      if (
        formData.companySize.trim()
      ) {
        payload.companySize =
          formData.companySize.trim();
      }

      if (
        formData.foundedYear
      ) {
        payload.foundedYear =
          Number(
            formData.foundedYear,
          );
      }

      try {
        setSaving(true);

        const response =
          hasCompany
            ? await api.patch(
                "/companies/my",
                payload,
              )
            : await api.post(
                "/companies",
                payload,
              );

        const updatedCompany =
          response.data.company;

        setCompany(
          updatedCompany,
        );

        setHasCompany(
          true,
        );

        fillForm(
          updatedCompany,
        );

        setMessage(
          response.data
            .message ||
            (hasCompany
              ? "Company updated successfully"
              : "Company created successfully"),
        );
      } catch (error) {
        const responseData =
          error.response
            ?.data;

        if (
          Array.isArray(
            responseData
              ?.errors,
          ) &&
          responseData
            .errors.length >
            0
        ) {
          setError(
            responseData.errors
              .map(
                (item) =>
                  item.message,
              )
              .join(" • "),
          );
        } else {
          setError(
            responseData
              ?.message ||
              "Failed to save company",
          );
        }
      } finally {
        setSaving(false);
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
            Loading company...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="page-shell">
      <div className="page-container">
        {/* Hero */}
        <section className="rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 px-7 py-9 text-white md:px-10 md:py-11">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-200">
            Recruiter
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            Manage your company profile.
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-indigo-100/75">
            Keep your company
            information accurate so
            candidates understand the
            organization behind each
            opportunity.
          </p>
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

        {!hasCompany && (
          <div className="alert-info mt-6">
            You haven't created a
            company profile yet. Complete
            the form below before
            publishing jobs.
          </div>
        )}

        <div className="mt-8 grid gap-7 lg:grid-cols-[320px_1fr]">
          {/* ----------------------------------------
              Company Summary
          ---------------------------------------- */}

          <aside className="space-y-6">
            <section className="portal-card p-6">
              <CompanyLogo
                company={
                  company
                }
                formData={
                  formData
                }
              />

              <h2 className="mt-5 text-xl font-black text-slate-900">
                {company?.name ||
                  formData.name ||
                  "Your Company"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {company?.industry ||
                  formData.industry ||
                  "Industry not added"}
              </p>

              {company && (
                <div className="mt-5 flex flex-wrap gap-2">
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
              )}

              <div className="mt-6 border-t border-slate-100 pt-5">
                <Info
                  label="Location"
                  value={
                    company
                      ?.location ||
                    formData.location
                  }
                />

                <Info
                  label="Company Size"
                  value={
                    company
                      ?.companySize ||
                    formData.companySize
                  }
                />

                <Info
                  label="Founded"
                  value={
                    company
                      ?.foundedYear ||
                    formData.foundedYear
                  }
                />

                {company?.slug && (
                  <Info
                    label="Slug"
                    value={
                      company.slug
                    }
                  />
                )}
              </div>

              {company?.website && (
                <a
                  href={
                    company.website
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary mt-5 w-full"
                >
                  Visit Website
                </a>
              )}
            </section>

            {company &&
              !company.isVerified && (
                <div className="alert-info">
                  Company verification is
                  controlled by the
                  platform Admin.
                </div>
              )}

            {company &&
              !company.isActive && (
                <div className="alert-error">
                  This company is
                  currently inactive.
                  Contact the platform
                  administrator for
                  moderation details.
                </div>
              )}
          </aside>

          {/* ----------------------------------------
              Form
          ---------------------------------------- */}

          <section className="portal-card p-6 md:p-8">
            <p className="eyebrow">
              Company Information
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              {hasCompany
                ? "Edit company"
                : "Create company"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              These details are shown
              with your public job
              listings.
            </p>

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-8 space-y-6"
            >
              {/* Name / Industry */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="form-label"
                  >
                    Company Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="TechNova Solutions"
                    className="form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="industry"
                    className="form-label"
                  >
                    Industry
                  </label>

                  <input
                    id="industry"
                    name="industry"
                    value={
                      formData.industry
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Information Technology"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="form-label"
                >
                  Company Description
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
                  placeholder="Tell candidates about your company, products, culture and work..."
                  className="form-textarea min-h-40"
                />
              </div>

              {/* Location / Email */}
              <div className="grid gap-5 md:grid-cols-2">
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
                      formData.location
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Chandigarh, India"
                    className="form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="companyEmail"
                    className="form-label"
                  >
                    Company Email
                  </label>

                  <input
                    id="companyEmail"
                    name="companyEmail"
                    type="email"
                    value={
                      formData.companyEmail
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="careers@example.com"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label
                  htmlFor="website"
                  className="form-label"
                >
                  Website
                </label>

                <input
                  id="website"
                  name="website"
                  type="url"
                  value={
                    formData.website
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://example.com"
                  className="form-input"
                />
              </div>

              {/* Logo URL */}
              <div>
                <label
                  htmlFor="logoUrl"
                  className="form-label"
                >
                  Logo URL
                </label>

                <input
                  id="logoUrl"
                  name="logoUrl"
                  type="url"
                  value={
                    formData.logoUrl
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://example.com/logo.png"
                  className="form-input"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Company logo upload can
                  be added later. For now,
                  provide an image URL.
                </p>
              </div>

              {/* Size / Founded */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="companySize"
                    className="form-label"
                  >
                    Company Size
                  </label>

                  <input
                    id="companySize"
                    name="companySize"
                    value={
                      formData.companySize
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="11-50"
                    className="form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="foundedYear"
                    className="form-label"
                  >
                    Founded Year
                  </label>

                  <input
                    id="foundedYear"
                    name="foundedYear"
                    type="number"
                    min="1800"
                    max={
                      new Date()
                        .getFullYear()
                    }
                    value={
                      formData.foundedYear
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="2020"
                    className="form-input"
                  />
                </div>
              </div>

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
                    : hasCompany
                      ? "Save Changes"
                      : "Create Company"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

// --------------------------------------------------
// Logo
// --------------------------------------------------

function CompanyLogo({
  company,
  formData,
}) {
  const name =
    company?.name ||
    formData.name ||
    "Company";

  const logoUrl =
    formData.logoUrl ||
    company?.logoUrl;

  return (
    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-indigo-100 text-3xl font-black text-indigo-700">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={(
            event,
          ) => {
            event.currentTarget.style.display =
              "none";
          }}
        />
      ) : (
        name
          .charAt(0)
          .toUpperCase()
      )}
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
    <div className="mb-4 last:mb-0">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-700">
        {value || "Not added"}
      </p>
    </div>
  );
}

export default CompanyProfile;