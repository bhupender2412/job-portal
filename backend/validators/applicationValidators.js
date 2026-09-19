const {
  z,
} = require("zod");

const applyToJobSchema =
  z.object({
    coverLetter:
      z
        .string()
        .trim()
        .max(
          3000,
          "Cover letter cannot exceed 3000 characters",
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
  });

const updateApplicationStatusSchema =
  z.object({
    status: z.enum([
      "under-review",
      "shortlisted",
      "rejected",
      "hired",
    ]),
  });
  
module.exports = {
  applyToJobSchema,
  updateApplicationStatusSchema,
};