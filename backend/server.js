const dns = require("dns");
const dotenv = require("dotenv");

dotenv.config();

// Local DNS workaround for MongoDB Atlas SRV lookup
if (
  process.env.NODE_ENV !==
  "production"
) {
  dns.setServers([
    "8.8.8.8",
    "1.1.1.1",
  ]);
}

const app =
  require("./app");

const connectDB =
  require("./config/db");

const PORT =
  process.env.PORT || 5000;

const startServer =
  async () => {
    try {
      if (
        !process.env.MONGO_URI
      ) {
        throw new Error(
          "MONGO_URI is missing"
        );
      }

      await connectDB();

      const server =
        app.listen(
          PORT,
          () => {
            console.log(
              `Server running on port ${PORT}`
            );

            console.log(
              `Environment: ${
                process.env.NODE_ENV ||
                "development"
              }`
            );

            console.log(
              `Allowed frontend: ${
                process.env.CLIENT_URL ||
                "http://localhost:5173"
              }`
            );
          }
        );

      const shutdown = (
        signal
      ) => {
        console.log(
          `${signal} received. Shutting down server...`
        );

        server.close(
          () => {
            console.log(
              "HTTP server closed."
            );

            process.exit(0);
          }
        );
      };

      process.on(
        "SIGTERM",
        () =>
          shutdown(
            "SIGTERM"
          )
      );

      process.on(
        "SIGINT",
        () =>
          shutdown(
            "SIGINT"
          )
      );
    } catch (error) {
      console.error(
        "Failed to start server:",
        error.message
      );

      process.exit(1);
    }
  };

startServer();