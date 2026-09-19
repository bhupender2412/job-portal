const User = require("../models/User");

const cloudinary =
  require("../config/cloudinary");

// --------------------------------------------------
// Format User Profile
// --------------------------------------------------

const formatProfile = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,

    headline: user.headline,
    bio: user.bio,
    location: user.location,
    skills: user.skills,

    experienceYears:
      user.experienceYears,

    education: user.education,

    resumeUrl:
      user.resumeUrl,

    companyName:
      user.companyName,

    designation:
      user.designation,

    isActive:
      user.isActive,

    lastLoginAt:
      user.lastLoginAt,

    createdAt:
      user.createdAt,

    updatedAt:
      user.updatedAt,
  };
};

// --------------------------------------------------
// Get Own Profile
// --------------------------------------------------

const getProfile = async (
  req,
  res,
) => {
  try {
    const user =
      await User.findById(
        req.user._id,
      );

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "User profile not found",
        });
    }

    return res
      .status(200)
      .json({
        success: true,

        user:
          formatProfile(
            user,
          ),
      });
  } catch (error) {
    console.error(
      "Get profile error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Failed to load profile",
      });
  }
};

// --------------------------------------------------
// Update Job Seeker Profile
// --------------------------------------------------

const updateJobSeekerProfile =
  async (
    req,
    res,
  ) => {
    try {
      const updates = {
        ...req.body,
      };

      // Clean duplicate or empty skills.
      if (
        Array.isArray(
          updates.skills,
        )
      ) {
        updates.skills = [
          ...new Set(
            updates.skills
              .map((skill) =>
                skill.trim(),
              )
              .filter(Boolean),
          ),
        ];
      }

      const user =
        await User.findByIdAndUpdate(
          req.user._id,
          {
            $set:
              updates,
          },
          {
            returnDocument:
              "after",

            runValidators:
              true,
          },
        );

      if (!user) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "User profile not found",
          });
      }

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Job seeker profile updated successfully",

          user:
            formatProfile(
              user,
            ),
        });
    } catch (error) {
      console.error(
        "Update job seeker profile error:",
        error.message,
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to update profile",
        });
    }
  };

// --------------------------------------------------
// Update Recruiter Profile
// --------------------------------------------------

const updateRecruiterProfile =
  async (
    req,
    res,
  ) => {
    try {
      const user =
        await User.findByIdAndUpdate(
          req.user._id,
          {
            $set:
              req.body,
          },
          {
            returnDocument:
              "after",

            runValidators:
              true,
          },
        );

      if (!user) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "User profile not found",
          });
      }

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Recruiter profile updated successfully",

          user:
            formatProfile(
              user,
            ),
        });
    } catch (error) {
      console.error(
        "Update recruiter profile error:",
        error.message,
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to update profile",
        });
    }
  };

// --------------------------------------------------
// Upload Job Seeker Resume
// --------------------------------------------------

const uploadResume = async (
  req,
  res,
) => {
  let newPublicId = "";

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Resume PDF is required",
        });
    }

    const user =
      await User.findById(
        req.user._id,
      );

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "User profile not found",
        });
    }

    // ------------------------------------------------
    // Upload New Resume To Cloudinary
    // ------------------------------------------------

    const uploadResult =
      await new Promise(
        (
          resolve,
          reject,
        ) => {
          const publicId =
            `resume-${user._id}-${Date.now()}.pdf`;

          const stream =
            cloudinary.uploader
              .upload_stream(
                {
                  folder:
                    "job-portal/resumes",

                  resource_type:
                    "raw",

                  public_id:
                    publicId,
                },

                (
                  error,
                  result,
                ) => {
                  if (error) {
                    return reject(
                      error,
                    );
                  }

                  resolve(
                    result,
                  );
                },
              );

          stream.end(
            req.file.buffer,
          );
        },
      );

    newPublicId =
      uploadResult.public_id;

    const oldPublicId =
      user.resumePublicId;

    // ------------------------------------------------
    // Save New Resume Information
    // ------------------------------------------------

    user.resumeUrl =
      uploadResult.secure_url;

    user.resumePublicId =
      uploadResult.public_id;

    await user.save();

    // ------------------------------------------------
    // Delete Previous Cloudinary Resume
    // ------------------------------------------------

    if (
      oldPublicId &&
      oldPublicId !==
        uploadResult.public_id
    ) {
      try {
        await cloudinary.uploader.destroy(
          oldPublicId,
          {
            resource_type:
              "raw",
          },
        );
      } catch (cleanupError) {
        console.warn(
          "Old resume cleanup failed:",
          cleanupError.message,
        );
      }
    }

    return res
      .status(200)
      .json({
        success: true,

        message:
          "Resume uploaded successfully",

        resumeUrl:
          user.resumeUrl,

        user:
          formatProfile(
            user,
          ),
      });
  } catch (error) {
    console.error(
      "Upload resume error:",
      error.message,
    );

    // If Cloudinary upload succeeded but saving
    // the user failed, remove the unused asset.
    if (newPublicId) {
      try {
        await cloudinary.uploader.destroy(
          newPublicId,
          {
            resource_type:
              "raw",
          },
        );
      } catch (cleanupError) {
        console.warn(
          "Failed to clean new resume:",
          cleanupError.message,
        );
      }
    }

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Failed to upload resume",
      });
  }
};

module.exports = {
  getProfile,
  updateJobSeekerProfile,
  updateRecruiterProfile,
  uploadResume,
};