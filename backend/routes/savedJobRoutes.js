const express =
  require("express");

const {
  saveJob,
  getSavedJobs,
  checkSavedJob,
  removeSavedJob,
} = require(
  "../controllers/savedJobController",
);

const {
  protect,
  authorize,
} = require(
  "../middleware/authMiddleware",
);

const router =
  express.Router();

// All Saved Job routes are Job Seeker only.

router.use(
  protect,
  authorize(
    "jobseeker",
  ),
);

// --------------------------------------------------
// Saved Jobs
// --------------------------------------------------

router.get(
  "/",
  getSavedJobs,
);

router.post(
  "/:jobId",
  saveJob,
);

router.get(
  "/:jobId/status",
  checkSavedJob,
);

router.delete(
  "/:jobId",
  removeSavedJob,
);

module.exports = router;