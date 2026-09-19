const { z } = require("zod");

const updateUserStatusSchema =
  z.object({
    isActive:
      z.boolean(),
  });

const updateCompanyStatusSchema =
  z.object({
    isActive:
      z.boolean(),
  });

const updateCompanyVerificationSchema =
  z.object({
    isVerified:
      z.boolean(),
  });

const updateJobModerationSchema =
  z
    .object({
      isActive:
        z.boolean(),

      status:
        z
          .enum([
            "draft",
            "published",
            "closed",
          ])
          .optional(),
    })
    .superRefine(
      (data, ctx) => {
        if (
          data.isActive &&
          !data.status
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            path: [
              "status",
            ],

            message:
              "Status is required when reactivating a job",
          });
        }

        if (
          data.isActive &&
          data.status ===
            "closed"
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            path: [
              "status",
            ],

            message:
              "An active job cannot have closed status",
          });
        }
      },
    );

module.exports = {
  updateUserStatusSchema,
  updateCompanyStatusSchema,
  updateCompanyVerificationSchema,
  updateJobModerationSchema,
};