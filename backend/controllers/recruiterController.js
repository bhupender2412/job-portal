const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");

// --------------------------------------------------
// Recruiter Dashboard
// --------------------------------------------------

const getRecruiterDashboard = async (
  req,
  res,
) => {
  try {
    const recruiterId =
      req.user._id;

    const company =
      await Company.findOne({
        recruiter:
          recruiterId,
      }).select(
        "name slug industry location logoUrl isVerified isActive createdAt",
      );

    const [
      totalJobs,
      publishedJobs,
      draftJobs,
      closedJobs,
      activeJobs,

      totalApplications,
      appliedApplications,
      underReviewApplications,
      shortlistedApplications,
      hiredApplications,
      rejectedApplications,
      withdrawnApplications,

      recentJobs,
      recentApplications,
    ] = await Promise.all([
      // --------------------------------------------
      // Jobs
      // --------------------------------------------

      Job.countDocuments({
        recruiter:
          recruiterId,
      }),

      Job.countDocuments({
        recruiter:
          recruiterId,

        status:
          "published",
      }),

      Job.countDocuments({
        recruiter:
          recruiterId,

        status:
          "draft",
      }),

      Job.countDocuments({
        recruiter:
          recruiterId,

        status:
          "closed",
      }),

      Job.countDocuments({
        recruiter:
          recruiterId,

        isActive:
          true,
      }),

      // --------------------------------------------
      // Applications
      // --------------------------------------------

      Application.countDocuments({
        recruiter:
          recruiterId,
      }),

      Application.countDocuments({
        recruiter:
          recruiterId,

        status:
          "applied",
      }),

      Application.countDocuments({
        recruiter:
          recruiterId,

        status:
          "under-review",
      }),

      Application.countDocuments({
        recruiter:
          recruiterId,

        status:
          "shortlisted",
      }),

      Application.countDocuments({
        recruiter:
          recruiterId,

        status:
          "hired",
      }),

      Application.countDocuments({
        recruiter:
          recruiterId,

        status:
          "rejected",
      }),

      Application.countDocuments({
        recruiter:
          recruiterId,

        status:
          "withdrawn",
      }),

      // --------------------------------------------
      // Recent Jobs
      // --------------------------------------------

      Job.find({
        recruiter:
          recruiterId,
      })
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select(
          "title location workMode employmentType status isActive applicationCount createdAt",
        ),

      // --------------------------------------------
      // Recent Applications
      // --------------------------------------------

      Application.find({
        recruiter:
          recruiterId,
      })
        .populate({
          path:
            "applicant",

          select:
            "name email headline avatar",
        })
        .populate({
          path:
            "job",

          select:
            "title",
        })
        .sort({
          appliedAt: -1,
        })
        .limit(5)
        .select(
          "applicant job status appliedAt",
        ),
    ]);

    return res
      .status(200)
      .json({
        success: true,

        company:
          company || null,

        stats: {
          jobs: {
            total:
              totalJobs,

            published:
              publishedJobs,

            draft:
              draftJobs,

            closed:
              closedJobs,

            active:
              activeJobs,

            inactive:
              totalJobs -
              activeJobs,
          },

          applications: {
            total:
              totalApplications,

            applied:
              appliedApplications,

            underReview:
              underReviewApplications,

            shortlisted:
              shortlistedApplications,

            hired:
              hiredApplications,

            rejected:
              rejectedApplications,

            withdrawn:
              withdrawnApplications,
          },
        },

        recentJobs,

        recentApplications,
      });
  } catch (error) {
    console.error(
      "Recruiter dashboard error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Failed to load recruiter dashboard",
      });
  }
};

module.exports = {
  getRecruiterDashboard,
};