const express = require("express");

const {
  getRecruiterDashboard,
} = require(
  "../controllers/recruiterController",
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
// All Recruiter Routes
// --------------------------------------------------

router.use(
  protect,
  authorize("recruiter"),
);

// --------------------------------------------------
// Dashboard
// --------------------------------------------------

router.get(
  "/dashboard",
  getRecruiterDashboard,
);

module.exports = router;