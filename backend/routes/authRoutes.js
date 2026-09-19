const express =
  require("express");

const {
  register,
  login,
  getMe,
} = require(
  "../controllers/authController",
);

const {
  registerSchema,
  loginSchema,
} = require(
  "../validators/authValidators",
);

const {
  validateBody,
} = require(
  "../middleware/validateMiddleware",
);

const {
  protect,
} = require(
  "../middleware/authMiddleware",
);

const router =
  express.Router();

// --------------------------------------------------
// Public
// --------------------------------------------------

router.post(
  "/register",
  validateBody(
    registerSchema,
  ),
  register,
);

router.post(
  "/login",
  validateBody(
    loginSchema,
  ),
  login,
);

// --------------------------------------------------
// Protected
// --------------------------------------------------

router.get(
  "/me",
  protect,
  getMe,
);

module.exports = router;