const dns = require("dns");
const dotenv = require("dotenv");

dotenv.config();

// --------------------------------------------------
// Local DNS workaround for MongoDB Atlas SRV lookup
// --------------------------------------------------

if (
  process.env.NODE_ENV !== "production"
) {
  dns.setServers([
    "8.8.8.8",
    "1.1.1.1",
  ]);
}

const app = require("./app");
const connectDB = require("./config/db");

const PORT =
  process.env.PORT || 5000;

// --------------------------------------------------
// Start Server
// --------------------------------------------------

const startServer = async () => {
  try {
    // ----------------------------------------------
    // Validate Required Environment Variables
    // ----------------------------------------------

    const requiredEnv = [
      "MONGO_URI",
      "JWT_SECRET",
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ];

    for (const key of requiredEnv) {
      if (!process.env[key]) {
        throw new Error(
          `${key} is missing`,
        );
      }
    }

    // ----------------------------------------------
    // Production Validation
    // ----------------------------------------------

    if (
      process.env.NODE_ENV ===
      "production"
    ) {
      if (
        !process.env.CLIENT_URL
      ) {
        throw new Error(
          "CLIENT_URL is missing in production",
        );
      }

      if (
        process.env.JWT_SECRET.length <
        32
      ) {
        throw new Error(
          "JWT_SECRET must be at least 32 characters in production",
        );
      }
    }

    // ----------------------------------------------
    // Connect Database
    // ----------------------------------------------

    await connectDB();

    // ----------------------------------------------
    // Start HTTP Server
    // ----------------------------------------------

    const server = app.listen(
      PORT,
      () => {
        console.log(
          `Server running on port ${PORT}`,
        );

        console.log(
          `Environment: ${
            process.env.NODE_ENV ||
            "development"
          }`,
        );

        console.log(
          `Allowed frontend origins: ${
            process.env.CLIENT_URL ||
            "http://localhost:5173"
          }`,
        );
      },
    );

    // ----------------------------------------------
    // Graceful Shutdown
    // ----------------------------------------------

    const shutdown = (
      signal,
    ) => {
      console.log(
        `${signal} received. Shutting down server...`,
      );

      server.close(() => {
        console.log(
          "HTTP server closed.",
        );

        process.exit(0);
      });
    };

    process.on(
      "SIGTERM",
      () =>
        shutdown("SIGTERM"),
    );

    process.on(
      "SIGINT",
      () =>
        shutdown("SIGINT"),
    );
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message,
    );

    process.exit(1);
  }
};

startServer();