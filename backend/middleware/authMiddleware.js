const jwt = require("jsonwebtoken");

const User = require("../models/User");

// --------------------------------------------------
// Protect Route
// --------------------------------------------------

const protect = async (
  req,
  res,
  next,
) => {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith(
        "Bearer ",
      )
    ) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Authentication required",
        });
    }

    const token =
      authorization
        .split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Authentication required",
        });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET,
      );

    const user =
      await User.findById(
        decoded.id,
      );

    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "User account no longer exists",
        });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({
          success: false,
          message:
            "Your account has been disabled",
        });
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Authentication token has expired",
        });
    }

    if (
      error.name ===
      "JsonWebTokenError"
    ) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Invalid authentication token",
        });
    }

    console.error(
      "Authentication error:",
      error.message,
    );

    return res
      .status(401)
      .json({
        success: false,
        message:
          "Authentication failed",
      });
  }
};

// --------------------------------------------------
// Role Authorization
// --------------------------------------------------

const authorize =
  (...roles) =>
  (
    req,
    res,
    next,
  ) => {
    if (
      !req.user ||
      !roles.includes(
        req.user.role,
      )
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message:
            "You are not allowed to access this resource",
        });
    }

    next();
  };

module.exports = {
  protect,
  authorize,
};