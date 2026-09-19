const { z } = require("zod");

const companySizeValues = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

const createCompanySchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Company name must be at least 2 characters",
    )
    .max(
      120,
      "Company name cannot exceed 120 characters",
    ),

  description: z
    .string()
    .trim()
    .max(
      2000,
      "Description cannot exceed 2000 characters",
    )
    .optional(),

  industry: z
    .string()
    .trim()
    .max(
      100,
      "Industry cannot exceed 100 characters",
    )
    .optional(),

  location: z
    .string()
    .trim()
    .max(
      150,
      "Location cannot exceed 150 characters",
    )
    .optional(),

  website: z
    .string()
    .trim()
    .url("Enter a valid website URL")
    .or(z.literal(""))
    .optional(),

  companyEmail: z
    .string()
    .trim()
    .email("Enter a valid company email")
    .or(z.literal(""))
    .optional(),

  logoUrl: z
    .string()
    .trim()
    .url("Enter a valid logo URL")
    .or(z.literal(""))
    .optional(),

  companySize: z
    .enum(companySizeValues)
    .optional(),

  foundedYear: z
    .number()
    .int()
    .min(
      1800,
      "Enter a valid founded year",
    )
    .max(
      new Date().getFullYear(),
      "Founded year cannot be in the future",
    )
    .optional(),
});

const updateCompanySchema = createCompanySchema
  .partial()
  .refine(
    (data) =>
      Object.keys(data).length > 0,
    {
      message:
        "Provide at least one company field to update",
    },
  );

module.exports = {
  createCompanySchema,
  updateCompanySchema,
};