const multer = require("multer");

// --------------------------------------------------
// Not Found
// --------------------------------------------------

const notFound = (
  req,
  res,
  next,
) => {
  const error =
    new Error(
      `Route not found: ${req.originalUrl}`,
    );

  res.status(404);

  next(error);
};

// --------------------------------------------------
// Global Error Handler
// --------------------------------------------------

const errorHandler = (
  error,
  req,
  res,
  next,
) => {
  let statusCode =
    res.statusCode === 200
      ? 500
      : res.statusCode;

  let message =
    error.message ||
    "Internal server error";

  // ----------------------------------------------
  // Multer Errors
  // ----------------------------------------------

  if (
    error instanceof
    multer.MulterError
  ) {
    statusCode = 400;

    if (
      error.code ===
      "LIMIT_FILE_SIZE"
    ) {
      message =
        "Resume file cannot exceed 2 MB";
    } else {
      message =
        error.message;
    }
  }

  // ----------------------------------------------
  // Mongo Duplicate Key
  // ----------------------------------------------

  if (error.code === 11000) {
    statusCode = 409;

    message =
      "A record with this value already exists";
  }

  // ----------------------------------------------
  // Invalid MongoDB ObjectId
  // ----------------------------------------------

  if (
    error.name ===
    "CastError"
  ) {
    statusCode = 400;

    message =
      "Invalid resource ID";
  }

  console.error(
    "Unhandled error:",
    error.message,
  );

  return res
    .status(statusCode)
    .json({
      success: false,
      message,
    });
};

module.exports = {
  notFound,
  errorHandler,
};