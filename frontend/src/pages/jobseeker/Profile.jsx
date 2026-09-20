import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import api from "../../api/api";

import {
  verifySession,
} from "../../features/auth/authSlice";

function Profile() {
  const dispatch =
    useDispatch();

  const {
    user: authUser,
  } = useSelector(
    (state) =>
      state.auth,
  );

  const [
    profile,
    setProfile,
  ] = useState(null);

  const [
    formData,
    setFormData,
  ] = useState({
    headline: "",
    bio: "",
    location: "",
    skills: "",
    experienceYears: 0,
    education: "",
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    resumeUploading,
    setResumeUploading,
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
  // Load Profile
  // ------------------------------------------------

  useEffect(() => {
    const loadProfile =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await api.get(
              "/profile/me",
            );

          const user =
            response.data.user;

          setProfile(user);

          setFormData({
            headline:
              user.headline ||
              "",

            bio:
              user.bio ||
              "",

            location:
              user.location ||
              "",

            skills:
              Array.isArray(
                user.skills,
              )
                ? user.skills.join(
                    ", ",
                  )
                : "",

            experienceYears:
              user.experienceYears ??
              0,

            education:
              user.education ||
              "",
          });
        } catch (error) {
          setError(
            error.response?.data
              ?.message ||
              "Failed to load profile",
          );
        } finally {
          setLoading(false);
        }
      };

    loadProfile();
  }, []);

  // ------------------------------------------------
  // Change Form
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
  // Save Profile
  // ------------------------------------------------

  const handleSubmit =
    async (
      event,
    ) => {
      event.preventDefault();

      try {
        setSaving(true);

        setMessage("");
        setError("");

        const skills =
          formData.skills
            .split(",")
            .map(
              (skill) =>
                skill.trim(),
            )
            .filter(Boolean);

        const response =
          await api.patch(
            "/profile/jobseeker",
            {
              headline:
                formData.headline.trim(),

              bio:
                formData.bio.trim(),

              location:
                formData.location.trim(),

              skills,

              experienceYears:
                Number(
                  formData.experienceYears,
                ) || 0,

              education:
                formData.education.trim(),
            },
          );

        setProfile(
          response.data.user,
        );

        setMessage(
          response.data.message ||
            "Profile updated successfully",
        );

        // Refresh Redux auth user.
        dispatch(
          verifySession(),
        );
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to update profile",
        );
      } finally {
        setSaving(false);
      }
    };

  // ------------------------------------------------
  // Resume Upload
  // ------------------------------------------------

  const handleResumeUpload =
    async (
      event,
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      setMessage("");
      setError("");

      if (
        file.type !==
        "application/pdf"
      ) {
        setError(
          "Only PDF resumes are allowed.",
        );

        event.target.value =
          "";

        return;
      }

      if (
        file.size >
        2 * 1024 * 1024
      ) {
        setError(
          "Resume file cannot exceed 2 MB.",
        );

        event.target.value =
          "";

        return;
      }

      try {
        setResumeUploading(
          true,
        );

        const data =
          new FormData();

        data.append(
          "resume",
          file,
        );

        const response =
          await api.post(
            "/profile/jobseeker/resume",
            data,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            },
          );

        setProfile(
          response.data.user,
        );

        setMessage(
          response.data.message ||
            "Resume uploaded successfully",
        );

        dispatch(
          verifySession(),
        );
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Failed to upload resume",
        );
      } finally {
        setResumeUploading(
          false,
        );

        event.target.value =
          "";
      }
    };

  // ------------------------------------------------
  // Non Job Seeker
  // ------------------------------------------------

  if (
    authUser?.role !==
    "jobseeker"
  ) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <div className="empty-state">
            <p className="eyebrow">
              Profile
            </p>

            <h1 className="mt-3 text-3xl font-black text-slate-900">
              Job Seeker profile only
            </h1>

            <p className="mt-3 text-slate-500">
              This profile editor is
              available to Job Seeker
              accounts.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ------------------------------------------------
  // Loading
  // ------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="page-shell">
      <div className="page-container">
        {/* Header */}
        <section className="rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 px-7 py-9 text-white md:px-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-200">
            Job Seeker Profile
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            Build your professional profile.
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-indigo-100/75">
            Keep your skills,
            experience, education and
            resume updated before
            applying for opportunities.
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

        <div className="mt-8 grid gap-7 lg:grid-cols-[320px_1fr]">
          {/* Left Sidebar */}
          <aside className="space-y-6">
            <section className="portal-card p-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-3xl font-black text-indigo-700">
                {profile?.name
                  ?.charAt(0)
                  .toUpperCase() ||
                  "U"}
              </div>

              <h2 className="mt-5 text-xl font-black text-slate-900">
                {profile?.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {profile?.email}
              </p>

              <span className="badge badge-primary mt-4">
                Job Seeker
              </span>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <ProfileInfo
                  label="Phone"
                  value={
                    profile?.phone ||
                    "Not added"
                  }
                />

                <ProfileInfo
                  label="Member Since"
                  value={formatDate(
                    profile?.createdAt,
                  )}
                />
              </div>
            </section>

            {/* Resume */}
            <section className="portal-card p-6">
              <p className="eyebrow">
                Resume
              </p>

              <h2 className="mt-2 text-lg font-black text-slate-900">
                Your Resume
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Upload a PDF resume.
                Maximum file size is
                2 MB.
              </p>

              {profile?.resumeUrl ? (
                <a
                  href={
                    profile.resumeUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary mt-5 w-full"
                >
                  View Current Resume
                </a>
              ) : (
                <div className="alert-info mt-5">
                  No resume uploaded yet.
                </div>
              )}

              <label className="btn-primary mt-4 w-full cursor-pointer">
                {resumeUploading
                  ? "Uploading..."
                  : profile?.resumeUrl
                    ? "Replace Resume"
                    : "Upload Resume"}

                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={
                    handleResumeUpload
                  }
                  disabled={
                    resumeUploading
                  }
                  className="hidden"
                />
              </label>
            </section>
          </aside>

          {/* Main Form */}
          <section className="portal-card p-6 md:p-8">
            <div>
              <p className="eyebrow">
                Professional Information
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Profile details
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                This information helps
                recruiters understand
                your background.
              </p>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-8 space-y-6"
            >
              <div>
                <label
                  htmlFor="headline"
                  className="form-label"
                >
                  Professional Headline
                </label>

                <input
                  id="headline"
                  name="headline"
                  value={
                    formData.headline
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="MERN Stack Developer"
                  className="form-input"
                />
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="form-label"
                >
                  About You
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  value={
                    formData.bio
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Tell recruiters about your interests, experience and career goals..."
                  className="form-textarea min-h-40"
                />
              </div>

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
                    placeholder="Himachal Pradesh, India"
                    className="form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="experienceYears"
                    className="form-label"
                  >
                    Experience
                  </label>

                  <input
                    id="experienceYears"
                    name="experienceYears"
                    type="number"
                    min="0"
                    max="60"
                    step="0.5"
                    value={
                      formData.experienceYears
                    }
                    onChange={
                      handleChange
                    }
                    className="form-input"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Enter years of
                    professional experience.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="education"
                  className="form-label"
                >
                  Education
                </label>

                <input
                  id="education"
                  name="education"
                  value={
                    formData.education
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="B.Tech in Computer Science and Engineering"
                  className="form-input"
                />
              </div>

              <div>
                <label
                  htmlFor="skills"
                  className="form-label"
                >
                  Skills
                </label>

                <input
                  id="skills"
                  name="skills"
                  value={
                    formData.skills
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="JavaScript, React, Node.js, Express, MongoDB"
                  className="form-input"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Separate skills with
                  commas.
                </p>

                {formData.skills
                  .trim() && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.skills
                      .split(",")
                      .map(
                        (skill) =>
                          skill.trim(),
                      )
                      .filter(Boolean)
                      .map(
                        (skill) => (
                          <span
                            key={
                              skill
                            }
                            className="badge badge-primary"
                          >
                            {skill}
                          </span>
                        ),
                      )}
                  </div>
                )}
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
                    ? "Saving Changes..."
                    : "Save Profile"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function ProfileInfo({
  label,
  value,
}) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function formatDate(
  date,
) {
  if (!date) {
    return "—";
  }

  return new Date(
    date,
  ).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
}

export default Profile;