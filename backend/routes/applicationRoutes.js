const express =
  require("express");

const {
  applyToJob,
  getMyApplications,
  getMyApplicationById,
  withdrawApplication,

  getRecruiterApplications,
  getRecruiterApplicationById,
  updateApplicationStatus,
} = require(
  "../controllers/applicationController",
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
  applyToJobSchema,
  updateApplicationStatusSchema,
} = require(
  "../validators/applicationValidators",
);

const router =
  express.Router();

// --------------------------------------------------
// Job Seeker - Apply
// --------------------------------------------------

router.post(
  "/jobs/:jobId",
  protect,
  authorize(
    "jobseeker",
  ),
  validateBody(
    applyToJobSchema,
  ),
  applyToJob,
);

// --------------------------------------------------
// Job Seeker - My Applications
// --------------------------------------------------

router.get(
  "/my",
  protect,
  authorize(
    "jobseeker",
  ),
  getMyApplications,
);

router.get(
  "/my/:applicationId",
  protect,
  authorize(
    "jobseeker",
  ),
  getMyApplicationById,
);

router.patch(
  "/my/:applicationId/withdraw",
  protect,
  authorize(
    "jobseeker",
  ),
  withdrawApplication,
);

// --------------------------------------------------
// Recruiter - Applicant Management
// --------------------------------------------------

router.get(
  "/recruiter",
  protect,
  authorize(
    "recruiter",
  ),
  getRecruiterApplications,
);

router.get(
  "/recruiter/:applicationId",
  protect,
  authorize(
    "recruiter",
  ),
  getRecruiterApplicationById,
);

router.patch(
  "/recruiter/:applicationId/status",
  protect,
  authorize(
    "recruiter",
  ),
  validateBody(
    updateApplicationStatusSchema,
  ),
  updateApplicationStatus,
);

module.exports = router;