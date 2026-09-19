const express = require("express");

const {
  createJob,
  getMyJobs,
  getMyJobById,
  updateMyJob,
  updateMyJobStatus,
  deactivateMyJob,

  getPublicJobs,
  getPublicJobById,
} = require(
  "../controllers/jobController",
);

const {
  protect,
  authorize,
} = require(
  "../middleware/authMiddleware",
);

const {
  validateBody,
} = require(
  "../middleware/validateMiddleware",
);

const {
  createJobSchema,
  updateJobSchema,
  updateJobStatusSchema,
} = require(
  "../validators/jobValidators",
);

const router =
  express.Router();

// --------------------------------------------------
// Recruiter - Create Job
// --------------------------------------------------

router.post(
  "/",
  protect,
  authorize(
    "recruiter",
  ),
  validateBody(
    createJobSchema,
  ),
  createJob,
);

// --------------------------------------------------
// Recruiter - Get My Jobs
// --------------------------------------------------

router.get(
  "/my",
  protect,
  authorize(
    "recruiter",
  ),
  getMyJobs,
);

// --------------------------------------------------
// Public Job Board
// --------------------------------------------------

router.get(
  "/",
  getPublicJobs,
);

router.get(
  "/:jobId",
  getPublicJobById,
);

// --------------------------------------------------
// Recruiter - Get One Job
// --------------------------------------------------

router.get(
  "/my/:jobId",
  protect,
  authorize(
    "recruiter",
  ),
  getMyJobById,
);

// --------------------------------------------------
// Recruiter - Update Job
// --------------------------------------------------

router.patch(
  "/my/:jobId",
  protect,
  authorize(
    "recruiter",
  ),
  validateBody(
    updateJobSchema,
  ),
  updateMyJob,
);

// --------------------------------------------------
// Recruiter - Update Job Status
// --------------------------------------------------

router.patch(
  "/my/:jobId/status",
  protect,
  authorize(
    "recruiter",
  ),
  validateBody(
    updateJobStatusSchema,
  ),
  updateMyJobStatus,
);

// --------------------------------------------------
// Recruiter - Deactivate Job
// --------------------------------------------------

router.delete(
  "/my/:jobId",
  protect,
  authorize(
    "recruiter",
  ),
  deactivateMyJob,
);

module.exports = router;