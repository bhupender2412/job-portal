const express =
  require("express");

const {
  createCompany,
  getMyCompany,
  updateMyCompany,
  getCompanyBySlug,
} = require(
  "../controllers/companyController",
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
  createCompanySchema,
  updateCompanySchema,
} = require(
  "../validators/companyValidators",
);

const router =
  express.Router();

// --------------------------------------------------
// Recruiter Routes
// --------------------------------------------------

router.post(
  "/",
  protect,
  authorize(
    "recruiter",
  ),
  validateBody(
    createCompanySchema,
  ),
  createCompany,
);

router.get(
  "/my",
  protect,
  authorize(
    "recruiter",
  ),
  getMyCompany,
);

router.patch(
  "/my",
  protect,
  authorize(
    "recruiter",
  ),
  validateBody(
    updateCompanySchema,
  ),
  updateMyCompany,
);

// --------------------------------------------------
// Public Route
// --------------------------------------------------

router.get(
  "/slug/:slug",
  getCompanyBySlug,
);

module.exports = router;