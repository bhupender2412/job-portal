const { z } = require("zod");

const registerSchema =
  z.object({
    name:
      z
        .string()
        .trim()
        .min(
          2,
          "Name must be at least 2 characters",
        )
        .max(
          80,
          "Name cannot exceed 80 characters",
        ),

    email:
      z
        .string()
        .trim()
        .email(
          "Enter a valid email address",
        )
        .toLowerCase(),

    phone:
      z
        .string()
        .trim()
        .min(
          10,
          "Enter a valid phone number",
        )
        .max(
          15,
          "Enter a valid phone number",
        ),

    password:
      z
        .string()
        .min(
          6,
          "Password must be at least 6 characters",
        )
        .max(
          100,
          "Password is too long",
        ),

    role:
      z
        .enum([
          "jobseeker",
          "recruiter",
        ])
        .default(
          "jobseeker",
        ),
  });

const loginSchema =
  z.object({
    email:
      z
        .string()
        .trim()
        .email(
          "Enter a valid email address",
        )
        .toLowerCase(),

    password:
      z
        .string()
        .min(
          1,
          "Password is required",
        ),
  });

module.exports = {
  registerSchema,
  loginSchema,
};