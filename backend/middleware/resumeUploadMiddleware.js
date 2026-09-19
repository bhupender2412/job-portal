const multer =
  require("multer");

const path =
  require("path");

// --------------------------------------------------
// Memory Storage
// --------------------------------------------------

const storage =
  multer.memoryStorage();

// --------------------------------------------------
// File Validation
// --------------------------------------------------

const fileFilter = (
  req,
  file,
  callback,
) => {
  const extension =
    path
      .extname(
        file.originalname,
      )
      .toLowerCase();

  const isPdf =
    file.mimetype ===
      "application/pdf" &&
    extension === ".pdf";

  if (!isPdf) {
    return callback(
      new Error(
        "Only PDF resumes are allowed",
      ),
    );
  }

  callback(
    null,
    true,
  );
};

// --------------------------------------------------
// Upload
// --------------------------------------------------

const uploadResume =
  multer({
    storage,

    fileFilter,

    limits: {
      fileSize:
        2 * 1024 * 1024,
    },
  });

module.exports =
  uploadResume;