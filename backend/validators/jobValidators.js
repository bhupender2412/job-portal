const { z } = require("zod");

// --------------------------------------------------
// Reusable Job Fields
// --------------------------------------------------

const jobFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(
      2,
      "Job title must be at least 2 characters",
    )
    .max(
      150,
      "Job title cannot exceed 150 characters",
    ),

  description: z
    .string()
    .trim()
    .min(
      20,
      "Job description must be at least 20 characters",
    )
    .max(
      5000,
      "Job description cannot exceed 5000 characters",
    ),

  responsibilities: z
    .array(
      z
        .string()
        .trim()
        .min(
          1,
          "Responsibility cannot be empty",
        )
        .max(
          300,
          "Responsibility cannot exceed 300 characters",
        ),
    )
    .max(
      30,
      "Maximum 30 responsibilities are allowed",
    )
    .optional(),

  requirements: z
    .array(
      z
        .string()
        .trim()
        .min(
          1,
          "Requirement cannot be empty",
        )
        .max(
          300,
          "Requirement cannot exceed 300 characters",
        ),
    )
    .max(
      30,
      "Maximum 30 requirements are allowed",
    )
    .optional(),

  skills: z
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

  location: z
    .string()
    .trim()
    .min(
      2,
      "Location is required",
    )
    .max(
      150,
      "Location cannot exceed 150 characters",
    ),

  workMode: z.enum([
    "onsite",
    "hybrid",
    "remote",
  ]),

  employmentType: z.enum([
    "full-time",
    "part-time",
    "contract",
    "internship",
    "freelance",
  ]),

  experienceLevel: z.enum([
    "fresher",
    "junior",
    "mid",
    "senior",
    "lead",
  ]),

  minExperience: z
    .number()
    .min(
      0,
      "Minimum experience cannot be negative",
    )
    .max(
      60,
      "Enter a valid minimum experience",
    )
    .optional(),

  maxExperience: z
    .number()
    .min(
      0,
      "Maximum experience cannot be negative",
    )
    .max(
      60,
      "Enter a valid maximum experience",
    )
    .nullable()
    .optional(),

  salaryMin: z
    .number()
    .min(
      0,
      "Minimum salary cannot be negative",
    )
    .nullable()
    .optional(),

  salaryMax: z
    .number()
    .min(
      0,
      "Maximum salary cannot be negative",
    )
    .nullable()
    .optional(),

  salaryCurrency: z
    .string()
    .trim()
    .min(
      3,
      "Currency code must be at least 3 characters",
    )
    .max(
      10,
      "Currency code is too long",
    )
    .optional(),

  salaryPeriod: z
    .enum([
      "year",
      "month",
      "hour",
    ])
    .optional(),

  openings: z
    .number()
    .int()
    .min(
      1,
      "At least one opening is required",
    )
    .max(
      1000,
      "Maximum 1000 openings are allowed",
    )
    .optional(),

  applicationDeadline: z
    .string()
    .datetime({
      offset: true,
    })
    .nullable()
    .optional(),

  status: z
    .enum([
      "draft",
      "published",
    ])
    .optional(),
});

// --------------------------------------------------
// Shared Range Validation
// --------------------------------------------------

const validateJobRanges = (
  data,
  ctx,
) => {
  if (
    data.minExperience !==
      undefined &&
    data.maxExperience !==
      undefined &&
    data.maxExperience !==
      null &&
    data.maxExperience <
      data.minExperience
  ) {
    ctx.addIssue({
      code:
        z.ZodIssueCode.custom,

      path: [
        "maxExperience",
      ],

      message:
        "Maximum experience cannot be less than minimum experience",
    });
  }

  if (
    data.salaryMin !==
      undefined &&
    data.salaryMin !==
      null &&
    data.salaryMax !==
      undefined &&
    data.salaryMax !==
      null &&
    data.salaryMax <
      data.salaryMin
  ) {
    ctx.addIssue({
      code:
        z.ZodIssueCode.custom,

      path: [
        "salaryMax",
      ],

      message:
        "Maximum salary cannot be less than minimum salary",
    });
  }
};

// --------------------------------------------------
// Create Job
// --------------------------------------------------

const createJobSchema =
  jobFieldsSchema.superRefine(
    validateJobRanges,
  );

// --------------------------------------------------
// Update Job
// --------------------------------------------------

const updateJobSchema =
  jobFieldsSchema
    .partial()
    .refine(
      (data) =>
        Object.keys(data).length >
        0,
      {
        message:
          "Provide at least one job field to update",
      },
    )
    .superRefine(
      validateJobRanges,
    );

// --------------------------------------------------
// Update Status
// --------------------------------------------------

const updateJobStatusSchema =
  z.object({
    status: z.enum([
      "draft",
      "published",
      "closed",
    ]),
  });

module.exports = {
  createJobSchema,
  updateJobSchema,
  updateJobStatusSchema,
};