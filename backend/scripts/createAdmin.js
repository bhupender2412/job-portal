const dns = require("dns");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

if (
  process.env.NODE_ENV !==
  "production"
) {
  dns.setServers([
    "8.8.8.8",
    "1.1.1.1",
  ]);
}

const connectDB =
  require("../config/db");

const User =
  require("../models/User");

const createAdmin =
  async () => {
    try {
      await connectDB();

      const adminEmail =
        process.env.ADMIN_EMAIL;

      const adminPassword =
        process.env.ADMIN_PASSWORD;

      const adminName =
        process.env.ADMIN_NAME ||
        "Job Portal Admin";

      if (
        !adminEmail ||
        !adminPassword
      ) {
        throw new Error(
          "ADMIN_EMAIL and ADMIN_PASSWORD are required",
        );
      }

      const existingUser =
        await User.findOne({
          email:
            adminEmail.toLowerCase(),
        }).select(
          "+password",
        );

      if (existingUser) {
        if (
          existingUser.role !==
          "admin"
        ) {
          existingUser.role =
            "admin";

          existingUser.isActive =
            true;

          existingUser.password =
            adminPassword;

          await existingUser.save();

          console.log(
            `Existing user promoted to admin: ${existingUser.email}`,
          );

          return;
        }

        existingUser.password =
          adminPassword;

        existingUser.isActive =
          true;

        await existingUser.save();

        console.log(
          `Admin account updated: ${existingUser.email}`,
        );

        return;
      }

      const admin =
        await User.create({
          name:
            adminName,

          email:
            adminEmail.toLowerCase(),

          phone:
            "",

          password:
            adminPassword,

          role:
            "admin",

          isActive:
            true,
        });

      console.log(
        `Admin created successfully: ${admin.email}`,
      );
    } catch (error) {
      console.error(
        "Create admin failed:",
        error.message,
      );

      process.exitCode = 1;
    } finally {
      await mongoose.disconnect();

      console.log(
        "Database connection closed.",
      );
    }
  };

createAdmin();