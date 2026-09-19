const mongoose =
  require("mongoose");

const Application =
  require(
    "../models/Application",
  );

const Job =
  require("../models/Job");

const User =
  require("../models/User");

// --------------------------------------------------
// Apply To Job
// --------------------------------------------------

const applyToJob = async (
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

    // Only an active, published and non-expired
    // job can accept applications.
    const job =
      await Job.findOne({
        _id:
          jobId,

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
      }).populate({
        path: "company",

        select:
          "name slug",
      });

    if (!job) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Job is not available for applications",
        });
    }

    // Extra readable check before MongoDB's
    // unique compound index catches duplicates.
    const existingApplication =
      await Application.findOne({
        job:
          job._id,

        applicant:
          req.user._id,
      });

    if (
      existingApplication
    ) {
      return res
        .status(409)
        .json({
          success: false,

          message:
            "You have already applied to this job",
        });
    }

    const resumeUrl =
      req.body.resumeUrl?.trim() ||
      req.user.resumeUrl ||
      "";

    const application =
      await Application.create({
        job:
          job._id,

        applicant:
          req.user._id,

        company:
          job.company._id,

        recruiter:
          job.recruiter,

        resumeUrl,

        coverLetter:
          req.body.coverLetter ||
          "",

        statusHistory: [
          {
            status:
              "applied",

            changedBy:
              req.user._id,
          },
        ],
      });

    // Increment only after successful application.
    await Job.updateOne(
      {
        _id:
          job._id,
      },
      {
        $inc: {
          applicationCount:
            1,
        },
      },
    );

    await application.populate([
      {
        path: "job",

        select:
          "title location workMode employmentType experienceLevel status",
      },

      {
        path: "company",

        select:
          "name slug logoUrl industry location",
      },

      {
        path: "applicant",

        select:
          "name email phone headline skills experienceYears education resumeUrl",
      },
    ]);

    return res
      .status(201)
      .json({
        success: true,

        message:
          "Application submitted successfully",

        application,
      });
  } catch (error) {
    // Protection against a race where two
    // duplicate requests arrive simultaneously.
    if (
      error.code === 11000
    ) {
      return res
        .status(409)
        .json({
          success: false,

          message:
            "You have already applied to this job",
        });
    }

    console.error(
      "Apply to job error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Failed to submit application",
      });
  }
};

// --------------------------------------------------
// Job Seeker - My Applications
// --------------------------------------------------

const getMyApplications = async (
  req,
  res,
) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const validStatuses = [
      "applied",
      "under-review",
      "shortlisted",
      "rejected",
      "hired",
      "withdrawn",
    ];

    const filter = {
      applicant: req.user._id,
    };

    if (
      status &&
      validStatuses.includes(status)
    ) {
      filter.status = status;
    }

    const currentPage = Math.max(
      Number(page) || 1,
      1,
    );

    const pageSize = Math.min(
      Math.max(
        Number(limit) || 10,
        1,
      ),
      50,
    );

    const [
      applications,
      total,
    ] = await Promise.all([
      Application.find(filter)
        .populate({
          path: "job",
          select:
            "title location workMode employmentType experienceLevel salaryMin salaryMax salaryCurrency salaryPeriod status isActive",
        })
        .populate({
          path: "company",
          select:
            "name slug logoUrl industry location",
        })
        .sort({
          appliedAt: -1,
        })
        .skip(
          (currentPage - 1) *
            pageSize,
        )
        .limit(pageSize),

      Application.countDocuments(
        filter,
      ),
    ]);

    return res
      .status(200)
      .json({
        success: true,

        applications,

        page: currentPage,

        pages: Math.max(
          Math.ceil(
            total / pageSize,
          ),
          1,
        ),

        total,

        limit: pageSize,
      });
  } catch (error) {
    console.error(
      "Get my applications error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Failed to load applications",
      });
  }
};

// --------------------------------------------------
// Job Seeker - Application Details
// --------------------------------------------------

const getMyApplicationById =
  async (
    req,
    res,
  ) => {
    try {
      const {
        applicationId,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          applicationId,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid application ID",
          });
      }

      const application =
        await Application.findOne({
          _id: applicationId,

          applicant:
            req.user._id,
        })
          .populate({
            path: "job",

            select:
              "title description responsibilities requirements skills location workMode employmentType experienceLevel minExperience maxExperience salaryMin salaryMax salaryCurrency salaryPeriod openings applicationDeadline status isActive",
          })
          .populate({
            path: "company",

            select:
              "name slug description industry location website logoUrl companySize isVerified",
          })
          .populate({
            path: "recruiter",

            select:
              "name designation",
          })
          .populate({
            path:
              "statusHistory.changedBy",

            select:
              "name role",
          });

      if (!application) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Application not found",
          });
      }

      return res
        .status(200)
        .json({
          success: true,
          application,
        });
    } catch (error) {
      console.error(
        "Get application details error:",
        error.message,
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to load application",
        });
    }
  };

// --------------------------------------------------
// Job Seeker - Withdraw Application
// --------------------------------------------------

const withdrawApplication =
  async (
    req,
    res,
  ) => {
    try {
      const {
        applicationId,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          applicationId,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid application ID",
          });
      }

      const application =
        await Application.findOne({
          _id: applicationId,

          applicant:
            req.user._id,
        });

      if (!application) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Application not found",
          });
      }

      if (
        application.status ===
        "withdrawn"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Application is already withdrawn",
          });
      }

      if (
        [
          "rejected",
          "hired",
        ].includes(
          application.status,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              `A ${application.status} application cannot be withdrawn`,
          });
      }

      application.status =
        "withdrawn";

      application.statusHistory.push(
        {
          status: "withdrawn",

          changedBy:
            req.user._id,

          changedAt:
            new Date(),
        },
      );

      await application.save();

      await application.populate([
        {
          path: "job",

          select:
            "title location workMode employmentType",
        },

        {
          path: "company",

          select:
            "name slug logoUrl",
        },
      ]);

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Application withdrawn successfully",

          application,
        });
    } catch (error) {
      console.error(
        "Withdraw application error:",
        error.message,
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to withdraw application",
        });
    }
  };

// --------------------------------------------------
// Recruiter - Get Applications
// --------------------------------------------------

const getRecruiterApplications =
  async (
    req,
    res,
  ) => {
    try {
      const {
        status,
        jobId,
        search,
        page = 1,
        limit = 10,
      } = req.query;

      const validStatuses = [
        "applied",
        "under-review",
        "shortlisted",
        "rejected",
        "hired",
        "withdrawn",
      ];

      const filter = {
        recruiter:
          req.user._id,
      };

      // Status Filter
      if (
        status &&
        validStatuses.includes(
          status,
        )
      ) {
        filter.status =
          status;
      }

      // Job Filter
      if (jobId) {
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

        filter.job =
          jobId;
      }

      // Applicant Search
      if (search?.trim()) {
        const keyword =
          new RegExp(
            search.trim().replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&",
            ),
            "i",
          );

        const users =
          await User.find({
            role:
              "jobseeker",

            $or: [
              {
                name:
                  keyword,
              },

              {
                email:
                  keyword,
              },

              {
                headline:
                  keyword,
              },

              {
                skills:
                  keyword,
              },
            ],
          }).select("_id");

        filter.applicant = {
          $in:
            users.map(
              (user) =>
                user._id,
            ),
        };
      }

      const currentPage =
        Math.max(
          Number(page) || 1,
          1,
        );

      const pageSize =
        Math.min(
          Math.max(
            Number(limit) || 10,
            1,
          ),
          50,
        );

      const [
        applications,
        total,
      ] =
        await Promise.all([
          Application.find(
            filter,
          )
            .populate({
              path:
                "applicant",

              select:
                "name email phone avatar headline location skills experienceYears education resumeUrl",
            })
            .populate({
              path: "job",

              select:
                "title location workMode employmentType experienceLevel status",
            })
            .populate({
              path:
                "company",

              select:
                "name slug logoUrl",
            })
            .sort({
              appliedAt: -1,
            })
            .skip(
              (currentPage -
                1) *
                pageSize,
            )
            .limit(
              pageSize,
            ),

          Application.countDocuments(
            filter,
          ),
        ]);

      return res
        .status(200)
        .json({
          success: true,

          applications,

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
        "Get recruiter applications error:",
        error.message,
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to load applicants",
        });
    }
  };

// --------------------------------------------------
// Recruiter - Application Details
// --------------------------------------------------

const getRecruiterApplicationById =
  async (
    req,
    res,
  ) => {
    try {
      const {
        applicationId,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          applicationId,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid application ID",
          });
      }

      const application =
        await Application.findOne({
          _id:
            applicationId,

          recruiter:
            req.user._id,
        })
          .populate({
            path:
              "applicant",

            select:
              "name email phone avatar headline bio location skills experienceYears education resumeUrl createdAt",
          })
          .populate({
            path: "job",

            select:
              "title description requirements responsibilities skills location workMode employmentType experienceLevel minExperience maxExperience salaryMin salaryMax salaryCurrency salaryPeriod status",
          })
          .populate({
            path:
              "company",

            select:
              "name slug logoUrl industry location",
          })
          .populate({
            path:
              "statusHistory.changedBy",

            select:
              "name role",
          });

      if (!application) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Application not found",
          });
      }

      return res
        .status(200)
        .json({
          success: true,
          application,
        });
    } catch (error) {
      console.error(
        "Get recruiter application error:",
        error.message,
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to load application",
        });
    }
  };

// --------------------------------------------------
// Recruiter - Update Application Status
// --------------------------------------------------

const updateApplicationStatus =
  async (
    req,
    res,
  ) => {
    try {
      const {
        applicationId,
      } = req.params;

      const {
        status,
      } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(
          applicationId,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid application ID",
          });
      }

      const application =
        await Application.findOne({
          _id:
            applicationId,

          recruiter:
            req.user._id,
        });

      if (!application) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Application not found",
          });
      }

      // Final states cannot be changed.
      if (
        application.status ===
          "withdrawn" ||
        application.status ===
          "rejected" ||
        application.status ===
          "hired"
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              `${
                application.status
                  .charAt(0)
                  .toUpperCase() +
                application.status.slice(
                  1,
                )
              } applications cannot be changed`,
          });
      }

      const allowedTransitions = {
        applied: [
          "under-review",
          "rejected",
        ],

        "under-review": [
          "shortlisted",
          "rejected",
        ],

        shortlisted: [
          "hired",
          "rejected",
        ],
      };

      const allowed =
        allowedTransitions[
          application.status
        ] || [];

      if (
        !allowed.includes(
          status,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              `Cannot move application from ${application.status} to ${status}`,
          });
      }

      application.status =
        status;

      application.statusHistory.push(
        {
          status,

          changedBy:
            req.user._id,

          changedAt:
            new Date(),
        },
      );

      await application.save();

      await application.populate([
        {
          path:
            "applicant",

          select:
            "name email phone headline location skills experienceYears education resumeUrl",
        },

        {
          path: "job",

          select:
            "title location workMode employmentType",
        },

        {
          path:
            "company",

          select:
            "name slug logoUrl",
        },

        {
          path:
            "statusHistory.changedBy",

          select:
            "name role",
        },
      ]);

      return res
        .status(200)
        .json({
          success: true,

          message:
            `Application moved to ${status}`,

          application,
        });
    } catch (error) {
      console.error(
        "Update application status error:",
        error.message,
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to update application status",
        });
    }
  };


module.exports = {
  applyToJob,
  getMyApplications,
  getMyApplicationById,
  withdrawApplication,

  getRecruiterApplications,
  getRecruiterApplicationById,
  updateApplicationStatus,
};