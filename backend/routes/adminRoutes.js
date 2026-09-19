const express = require("express");

const {
  getDashboardStats,

  getUsers,
  getUserById,
  updateUserStatus,

  getCompanies,
  getCompanyById,
  updateCompanyVerification,
  updateCompanyStatus,

  getJobs,
  getJobById,
  moderateJob,
  getApplications,
  getApplicationById,
} = require(
  "../controllers/adminController",
);
const {
  validateBody,
} = require(
  "../middleware/validateMiddleware",
);

const {
  updateUserStatusSchema,
  updateCompanyStatusSchema,
  updateCompanyVerificationSchema,
  updateJobModerationSchema,
} = require(
  "../validators/adminValidators",
);

const {
  protect,
  authorize,
} = require(
  "../middleware/authMiddleware",
);

const router =
  express.Router();

// --------------------------------------------------
// All Admin Routes
// --------------------------------------------------

router.use(
  protect,
  authorize("admin"),
);

// --------------------------------------------------
// Dashboard
// --------------------------------------------------

router.get(
  "/dashboard",
  getDashboardStats,
);

// --------------------------------------------------
// Users
// --------------------------------------------------

router.get(
  "/users",
  getUsers,
);

router.get(
  "/users/:userId",
  getUserById,
);

router.patch(
  "/users/:userId/status",
  validateBody(
    updateUserStatusSchema,
  ),
  updateUserStatus,
);

// --------------------------------------------------
// Companies
// --------------------------------------------------

router.get(
  "/companies",
  getCompanies,
);

router.get(
  "/companies/:companyId",
  getCompanyById,
);

router.patch(
  "/companies/:companyId/verification",
  validateBody(
    updateCompanyVerificationSchema,
  ),
  updateCompanyVerification,
);

router.patch(
  "/companies/:companyId/status",
  validateBody(
    updateCompanyStatusSchema,
  ),
  updateCompanyStatus,
);

// --------------------------------------------------
// Jobs
// --------------------------------------------------

router.get(
  "/jobs",
  getJobs,
);

router.get(
  "/jobs/:jobId",
  getJobById,
);

router.patch(
  "/jobs/:jobId/moderation",
  validateBody(
    updateJobModerationSchema,
  ),
  moderateJob,
);

// --------------------------------------------------
// Applications
// --------------------------------------------------

router.get(
  "/applications",
  getApplications,
);

router.get(
  "/applications/:applicationId",
  getApplicationById,
);

module.exports = router;