const helmet =
  require("helmet");

const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes =
  require("./routes/authRoutes");

const profileRoutes =
  require("./routes/profileRoutes");

const companyRoutes =
  require("./routes/companyRoutes");

const jobRoutes =
  require("./routes/jobRoutes");

const applicationRoutes =
  require(
    "./routes/applicationRoutes",
  );

const savedJobRoutes =
  require(
    "./routes/savedJobRoutes",
  );

const adminRoutes =
  require("./routes/adminRoutes");

const {
  notFound,
  errorHandler,
} = require(
  "./middleware/errorMiddleware",
);

const recruiterRoutes =
  require("./routes/recruiterRoutes");

// --------------------------------------------------
// Allowed Frontend Origins
// --------------------------------------------------

const allowedOrigins = (
  process.env.CLIENT_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) =>
    origin.trim(),
  )
  .filter(Boolean);

// --------------------------------------------------
// Basic Security Headers
// --------------------------------------------------

app.disable(
  "x-powered-by",
);

app.use(
  helmet(),
);


// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(
  cors({
    origin: (
      origin,
      callback,
    ) => {
      // Allow requests without a browser origin,
      // such as curl, Postman and server-to-server calls.
      if (!origin) {
        return callback(
          null,
          true,
        );
      }

      if (
        allowedOrigins.includes(
          origin,
        )
      ) {
        return callback(
          null,
          true,
        );
      }

      return callback(
        new Error(
          "Not allowed by CORS",
        ),
      );
    },

    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "100kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "100kb",
  }),
);

// --------------------------------------------------
// Root Route
// --------------------------------------------------

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Job Portal API is running",
    });
  }
);

// --------------------------------------------------
// Health Route
// --------------------------------------------------

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Job Portal API is healthy",
      environment:
        process.env.NODE_ENV ||
        "development",
      timestamp:
        new Date().toISOString(),
    });
  }
);

app.use(
  "/api/auth",
  authRoutes,
);

app.use(
  "/api/profile",
  profileRoutes,
);

app.use(
  "/api/companies",
  companyRoutes,
);

app.use(
  "/api/jobs",
  jobRoutes,
);

app.use(
  "/api/applications",
  applicationRoutes,
);

app.use(
  "/api/saved-jobs",
  savedJobRoutes,
);

app.use(
  "/api/admin",
  adminRoutes,
);

app.use(
  "/api/recruiter",
  recruiterRoutes,
);

// --------------------------------------------------
// Error Handling
// --------------------------------------------------

app.use(notFound);

app.use(errorHandler);

module.exports = app;