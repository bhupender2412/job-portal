const {
  rateLimit,
} = require(
  "express-rate-limit",
);

// --------------------------------------------------
// Authentication Rate Limiter
// --------------------------------------------------

const authLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit: 20,

    standardHeaders:
      "draft-7",

    legacyHeaders:
      false,

    message: {
      success: false,

      message:
        "Too many authentication attempts. Please try again later.",
    },
  });

module.exports = {
  authLimiter,
};