const mongoose =
  require("mongoose");

const SavedJob =
  require(
    "../models/SavedJob",
  );

const Job =
  require("../models/Job");

// --------------------------------------------------
// Save Job
// --------------------------------------------------

const saveJob = async (
  req,
  res,
) => {
  try {
    const {
      jobId,
    } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        jobId,
      )
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Invalid job ID",
        });
    }

    const now =
      new Date();

    const job =
      await Job.findOne({
        _id: jobId,

        status:
          "published",

        isActive:
          true,

        $or: [
          {
            applicationDeadline:
              null,
          },

          {
            applicationDeadline: {
              $gte: now,
            },
          },
        ],
      });

    if (!job) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Job is not available",
        });
    }

    const existingSavedJob =
      await SavedJob.findOne({
        user:
          req.user._id,

        job:
          job._id,
      });

    if (
      existingSavedJob
    ) {
      return res
        .status(409)
        .json({
          success: false,

          message:
            "Job is already saved",
        });
    }

    const savedJob =
      await SavedJob.create({
        user:
          req.user._id,

        job:
          job._id,
      });

    await savedJob.populate({
      path: "job",

      populate: {
        path: "company",

        select:
          "name slug logoUrl industry location",
      },
    });

    return res
      .status(201)
      .json({
        success: true,

        message:
          "Job saved successfully",

        savedJob,
      });
  } catch (error) {
    if (
      error.code === 11000
    ) {
      return res
        .status(409)
        .json({
          success: false,

          message:
            "Job is already saved",
        });
    }

    console.error(
      "Save job error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Failed to save job",
      });
  }
};

// --------------------------------------------------
// Get Saved Jobs
// --------------------------------------------------

const getSavedJobs =
  async (
    req,
    res,
  ) => {
    try {
      const {
        page = 1,
        limit = 10,
      } = req.query;

      const currentPage =
        Math.max(
          Number(page) || 1,
          1,
        );

      const pageSize =
        Math.min(
          Math.max(
            Number(limit) ||
              10,
            1,
          ),
          50,
        );

      const [
        savedJobs,
        total,
      ] =
        await Promise.all([
          SavedJob.find({
            user:
              req.user._id,
          })
            .populate({
              path: "job",

              populate: {
                path:
                  "company",

                select:
                  "name slug logoUrl industry location isVerified",
              },
            })
            .sort({
              savedAt: -1,
            })
            .skip(
              (currentPage -
                1) *
                pageSize,
            )
            .limit(
              pageSize,
            ),

          SavedJob.countDocuments({
            user:
              req.user._id,
          }),
        ]);

      return res
        .status(200)
        .json({
          success: true,

          savedJobs,

          page:
            currentPage,

          pages:
            Math.max(
              Math.ceil(
                total /
                  pageSize,
              ),
              1,
            ),

          total,

          limit:
            pageSize,
        });
    } catch (error) {
      console.error(
        "Get saved jobs error:",
        error.message,
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to load saved jobs",
        });
    }
  };

// --------------------------------------------------
// Check Saved Status
// --------------------------------------------------

const checkSavedJob =
  async (
    req,
    res,
  ) => {
    try {
      const {
        jobId,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          jobId,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid job ID",
          });
      }

      const savedJob =
        await SavedJob.findOne({
          user:
            req.user._id,

          job:
            jobId,
        });

      return res
        .status(200)
        .json({
          success: true,

          isSaved:
            Boolean(
              savedJob,
            ),

          savedJobId:
            savedJob?._id ||
            null,
        });
    } catch (error) {
      console.error(
        "Check saved job error:",
        error.message,
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to check saved job",
        });
    }
  };

// --------------------------------------------------
// Remove Saved Job
// --------------------------------------------------

const removeSavedJob =
  async (
    req,
    res,
  ) => {
    try {
      const {
        jobId,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          jobId,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid job ID",
          });
      }

      const savedJob =
        await SavedJob.findOneAndDelete({
          user:
            req.user._id,

          job:
            jobId,
        });

      if (!savedJob) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Saved job not found",
          });
      }

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Job removed from saved jobs",
        });
    } catch (error) {
      console.error(
        "Remove saved job error:",
        error.message,
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to remove saved job",
        });
    }
  };

module.exports = {
  saveJob,
  getSavedJobs,
  checkSavedJob,
  removeSavedJob,
};