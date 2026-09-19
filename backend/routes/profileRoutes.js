const express =
  require("express");

const {
  getProfile,
  updateJobSeekerProfile,
  updateRecruiterProfile,
  uploadResume:
    uploadResumeController,
} = require(
  "../controllers/profileController",
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
  updateJobSeekerProfileSchema,
  updateRecruiterProfileSchema,
} = require(
  "../validators/profileValidators",
);

const uploadResume =
  require(
    "../middleware/resumeUploadMiddleware",
  );

const router =
  express.Router();

// --------------------------------------------------
// Current User Profile
// --------------------------------------------------

router.get(
  "/me",
  protect,
  getProfile,
);

// --------------------------------------------------
// Job Seeker
// --------------------------------------------------

router.patch(
  "/jobseeker",
  protect,
  authorize(
    "jobseeker",
  ),
  validateBody(
    updateJobSeekerProfileSchema,
  ),
  updateJobSeekerProfile,
);


// --------------------------------------------------
// Job Seeker Resume Upload
// --------------------------------------------------

router.post(
  "/jobseeker/resume",
  protect,
  authorize(
    "jobseeker",
  ),
  uploadResume.single(
    "resume",
  ),
  uploadResumeController,
);

// --------------------------------------------------
// Recruiter
// --------------------------------------------------

router.patch(
  "/recruiter",
  protect,
  authorize(
    "recruiter",
  ),
  validateBody(
    updateRecruiterProfileSchema,
  ),
  updateRecruiterProfile,
);

module.exports = router;