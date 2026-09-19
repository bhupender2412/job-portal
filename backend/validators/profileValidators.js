const { z } = require("zod");

// --------------------------------------------------
// Job Seeker Profile
// --------------------------------------------------

const updateJobSeekerProfileSchema =
  z
    .object({
      headline:
        z
          .string()
          .trim()
          .max(
            150,
            "Headline cannot exceed 150 characters",
          )
          .optional(),

      bio:
        z
          .string()
          .trim()
          .max(
            1000,
            "Bio cannot exceed 1000 characters",
          )
          .optional(),

      location:
        z
          .string()
          .trim()
          .max(
            120,
            "Location cannot exceed 120 characters",
          )
          .optional(),

      skills:
        z
          .array(
            z
              .string()
              .trim()
              .min(
                1,
                "Skill cannot be empty",
              )
              .max(
                50,
                "Skill cannot exceed 50 characters",
              ),
          )
          .max(
            30,
            "Maximum 30 skills are allowed",
          )
          .optional(),

      experienceYears:
        z
          .number()
          .min(
            0,
            "Experience cannot be negative",
          )
          .max(
            60,
            "Enter a valid experience value",
          )
          .optional(),

      education:
        z
          .string()
          .trim()
          .max(
            300,
            "Education cannot exceed 300 characters",
          )
          .optional(),

      resumeUrl:
        z
          .string()
          .trim()
          .max(
            500,
            "Resume URL is too long",
          )
          .optional(),
    })
    .refine(
      (data) =>
        Object.keys(data).length >
        0,
      {
        message:
          "Provide at least one profile field to update",
      },
    );

// --------------------------------------------------
// Recruiter Profile
// --------------------------------------------------

const updateRecruiterProfileSchema =
  z
    .object({
      bio:
        z
          .string()
          .trim()
          .max(
            1000,
            "Bio cannot exceed 1000 characters",
          )
          .optional(),

      location:
        z
          .string()
          .trim()
          .max(
            120,
            "Location cannot exceed 120 characters",
          )
          .optional(),

      companyName:
        z
          .string()
          .trim()
          .min(
            2,
            "Company name must be at least 2 characters",
          )
          .max(
            120,
            "Company name cannot exceed 120 characters",
          )
          .optional(),

      designation:
        z
          .string()
          .trim()
          .max(
            120,
            "Designation cannot exceed 120 characters",
          )
          .optional(),
    })
    .refine(
      (data) =>
        Object.keys(data).length >
        0,
      {
        message:
          "Provide at least one profile field to update",
      },
    );

module.exports = {
  updateJobSeekerProfileSchema,
  updateRecruiterProfileSchema,
};