const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");

const mongoose =
  require("mongoose");

// --------------------------------------------------
// Admin Dashboard Statistics
// --------------------------------------------------

const getDashboardStats = async (
  req,
  res,
) => {
  try {
    const [
      totalUsers,
      jobSeekers,
      recruiters,
      admins,
      activeUsers,

      totalCompanies,
      activeCompanies,
      verifiedCompanies,

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
      // Users
      User.countDocuments(),

      User.countDocuments({
        role: "jobseeker",
      }),

      User.countDocuments({
        role: "recruiter",
      }),

      User.countDocuments({
        role: "admin",
      }),

      User.countDocuments({
        isActive: true,
      }),

      // Companies
      Company.countDocuments(),

      Company.countDocuments({
        isActive: true,
      }),

      Company.countDocuments({
        isVerified: true,
      }),

      // Jobs
      Job.countDocuments(),

      Job.countDocuments({
        status: "published",
      }),

      Job.countDocuments({
        status: "draft",
      }),

      Job.countDocuments({
        status: "closed",
      }),

      Job.countDocuments({
        isActive: true,
      }),

      // Applications
      Application.countDocuments(),

      Application.countDocuments({
        status: "applied",
      }),

      Application.countDocuments({
        status: "under-review",
      }),

      Application.countDocuments({
        status: "shortlisted",
      }),

      Application.countDocuments({
        status: "hired",
      }),

      Application.countDocuments({
        status: "rejected",
      }),

      Application.countDocuments({
        status: "withdrawn",
      }),

      // Recent Jobs
      Job.find()
        .populate({
          path: "company",
          select:
            "name slug logoUrl",
        })
        .populate({
          path: "recruiter",
          select:
            "name email",
        })
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select(
          "title status location employmentType workMode applicationCount createdAt",
        ),

      // Recent Applications
      Application.find()
        .populate({
          path: "applicant",
          select:
            "name email headline",
        })
        .populate({
          path: "job",
          select:
            "title",
        })
        .populate({
          path: "company",
          select:
            "name slug",
        })
        .sort({
          appliedAt: -1,
        })
        .limit(5)
        .select(
          "status appliedAt applicant job company",
        ),
    ]);

    return res
      .status(200)
      .json({
        success: true,

        stats: {
          users: {
            total: totalUsers,
            jobSeekers,
            recruiters,
            admins,
            active: activeUsers,
            inactive:
              totalUsers -
              activeUsers,
          },

          companies: {
            total:
              totalCompanies,

            active:
              activeCompanies,

            inactive:
              totalCompanies -
              activeCompanies,

            verified:
              verifiedCompanies,

            unverified:
              totalCompanies -
              verifiedCompanies,
          },

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
      "Admin dashboard error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Failed to load admin dashboard",
      });
  }
};


// --------------------------------------------------
// Admin - Get Users
// --------------------------------------------------

// --------------------------------------------------
// Admin - Get Users
// --------------------------------------------------

const getUsers = async (
  req,
  res,
) => {
  try {
    const {
      search,
      role,
      isActive,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // --------------------------------------------------
    // Role Filter
    // --------------------------------------------------

    if (
      [
        "jobseeker",
        "recruiter",
        "admin",
      ].includes(role)
    ) {
      filter.role = role;
    }

    // --------------------------------------------------
    // Active / Inactive Filter
    // --------------------------------------------------

    if (
      isActive === "true" ||
      isActive === "false"
    ) {
      filter.isActive =
        isActive === "true";
    }

    // --------------------------------------------------
    // Search
    // --------------------------------------------------

    if (search?.trim()) {
      const keyword =
        new RegExp(
          search
            .trim()
            .replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&",
            ),
          "i",
        );

      filter.$or = [
        {
          name: keyword,
        },

        {
          email: keyword,
        },

        {
          phone: keyword,
        },

        {
          headline: keyword,
        },

        {
          companyName: keyword,
        },
      ];
    }

    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

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

    // --------------------------------------------------
    // Query
    // --------------------------------------------------

    const [
      users,
      total,
    ] =
      await Promise.all([
        User.find(filter)
          .select(
            "-password -resumePublicId",
          )
          .sort({
            createdAt: -1,
          })
          .skip(
            (currentPage -
              1) *
              pageSize,
          )
          .limit(
            pageSize,
          ),

        User.countDocuments(
          filter,
        ),
      ]);

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    return res
      .status(200)
      .json({
        success: true,

        users,

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
      "Admin users error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Failed to load users",
      });
  }
};

// --------------------------------------------------
// Admin - Get One User
// --------------------------------------------------

const getUserById = async (
  req,
  res,
) => {
  try {
    const {
      userId,
    } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        userId,
      )
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Invalid user ID",
        });
    }

    const user =
      await User.findById(
        userId,
      ).select(
        "-password -resumePublicId",
      );

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "User not found",
        });
    }

    return res
      .status(200)
      .json({
        success: true,
        user,
      });
  } catch (error) {
    console.error(
      "Admin user details error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Failed to load user",
      });
  }
};

// --------------------------------------------------
// Admin - Activate / Deactivate User
// --------------------------------------------------

const updateUserStatus = async (
  req,
  res,
) => {
  try {
    const {
      userId,
    } = req.params;

    const {
      isActive,
    } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(
        userId,
      )
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Invalid user ID",
        });
    }

    if (
      userId ===
      req.user._id.toString()
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "You cannot change your own account status",
        });
    }

    const user =
      await User.findById(
        userId,
      );

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "User not found",
        });
    }

    if (
      user.role === "admin"
    ) {
      return res
        .status(403)
        .json({
          success: false,

          message:
            "Admin accounts cannot be disabled from this endpoint",
        });
    }

    user.isActive =
      isActive;

    await user.save({
      validateBeforeSave:
        false,
    });

    return res
      .status(200)
      .json({
        success: true,

        message:
          isActive
            ? "User account activated successfully"
            : "User account disabled successfully",

        user: {
          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          isActive:
            user.isActive,
        },
      });
  } catch (error) {
    console.error(
      "Update user status error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Failed to update user status",
      });
  }
};

// --------------------------------------------------
// Admin - Get Companies
// --------------------------------------------------

const getCompanies = async (
  req,
  res,
) => {
  try {
    const {
      search,
      status,
      verified,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // ----------------------------------------------
    // Status Filter
    // ----------------------------------------------

    if (
      status === "active"
    ) {
      filter.isActive =
        true;
    }

    if (
      status === "inactive"
    ) {
      filter.isActive =
        false;
    }

    // ----------------------------------------------
    // Verification Filter
    // ----------------------------------------------

    if (
      verified === "true"
    ) {
      filter.isVerified =
        true;
    }

    if (
      verified === "false"
    ) {
      filter.isVerified =
        false;
    }

    // ----------------------------------------------
    // Search
    // ----------------------------------------------

    if (search?.trim()) {
      const keyword =
        new RegExp(
          search
            .trim()
            .replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&",
            ),
          "i",
        );

      filter.$or = [
        {
          name:
            keyword,
        },

        {
          industry:
            keyword,
        },

        {
          location:
            keyword,
        },

        {
          companyEmail:
            keyword,
        },
      ];
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
      companies,
      total,
    ] =
      await Promise.all([
        Company.find(
          filter,
        )
          .populate({
            path:
              "recruiter",

            select:
              "name email designation isActive",
          })
          .sort({
            createdAt: -1,
          })
          .skip(
            (currentPage -
              1) *
              pageSize,
          )
          .limit(
            pageSize,
          ),

        Company.countDocuments(
          filter,
        ),
      ]);

    return res
      .status(200)
      .json({
        success: true,

        companies,

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
      "Admin companies error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Failed to load companies",
      });
  }
};

// --------------------------------------------------
// Admin - Get Company Details
// --------------------------------------------------

const getCompanyById = async (
  req,
  res,
) => {
  try {
    const {
      companyId,
    } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        companyId,
      )
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Invalid company ID",
        });
    }

    const company =
      await Company.findById(
        companyId,
      ).populate({
        path:
          "recruiter",

        select:
          "name email phone designation companyName isActive createdAt",
      });

    if (!company) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Company not found",
        });
    }

    const jobStats =
      await Job.aggregate([
        {
          $match: {
            company:
              company._id,
          },
        },

        {
          $group: {
            _id: null,

            total: {
              $sum: 1,
            },

            published: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$status",
                      "published",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            draft: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$status",
                      "draft",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            closed: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$status",
                      "closed",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);

    return res
      .status(200)
      .json({
        success: true,

        company,

        jobStats:
          jobStats[0] || {
            total: 0,
            published: 0,
            draft: 0,
            closed: 0,
          },
      });
  } catch (error) {
    console.error(
      "Admin company details error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Failed to load company",
      });
  }
};

// --------------------------------------------------
// Admin - Verify / Unverify Company
// --------------------------------------------------

const updateCompanyVerification =
  async (
    req,
    res,
  ) => {
    try {
      const {
        companyId,
      } = req.params;

      const {
        isVerified,
      } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(
          companyId,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid company ID",
          });
      }

      const company =
        await Company.findById(
          companyId,
        );

      if (!company) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Company not found",
          });
      }

      company.isVerified =
        isVerified;

      await company.save();

      return res
        .status(200)
        .json({
          success: true,

          message:
            isVerified
              ? "Company verified successfully"
              : "Company verification removed",

          company: {
            id:
              company._id,

            name:
              company.name,

            isVerified:
              company.isVerified,

            isActive:
              company.isActive,
          },
        });
    } catch (error) {
      console.error(
        "Company verification error:",
        error.message,
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to update company verification",
        });
    }
  };

// --------------------------------------------------
// Admin - Activate / Deactivate Company
// --------------------------------------------------

const updateCompanyStatus =
  async (
    req,
    res,
  ) => {
    try {
      const {
        companyId,
      } = req.params;

      const {
        isActive,
      } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(
          companyId,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid company ID",
          });
      }

      const company =
        await Company.findById(
          companyId,
        );

      if (!company) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Company not found",
          });
      }

      company.isActive =
        isActive;

      await company.save();

      // --------------------------------------------
      // When company is disabled,
      // disable all jobs belonging to it.
      // --------------------------------------------

      let affectedJobs = 0;

      if (!isActive) {
        const result =
          await Job.updateMany(
            {
              company:
                company._id,

              isActive:
                true,
            },

            {
              $set: {
                isActive:
                  false,

                status:
                  "closed",
              },
            },
          );

        affectedJobs =
          result.modifiedCount ||
          0;
      }

      return res
        .status(200)
        .json({
          success: true,

          message:
            isActive
              ? "Company activated successfully"
              : "Company disabled successfully",

          company: {
            id:
              company._id,

            name:
              company.name,

            isActive:
              company.isActive,

            isVerified:
              company.isVerified,
          },

          affectedJobs,
        });
    } catch (error) {
      console.error(
        "Company status error:",
        error.message,
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to update company status",
        });
    }
  };

// --------------------------------------------------
// Admin - Get Jobs
// --------------------------------------------------

const getJobs = async (
  req,
  res,
) => {
  try {
    const {
      search,
      status,
      active,
      companyId,
      workMode,
      employmentType,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // ----------------------------------------------
    // Status
    // ----------------------------------------------

    if (
      [
        "draft",
        "published",
        "closed",
      ].includes(status)
    ) {
      filter.status =
        status;
    }

    // ----------------------------------------------
    // Active / Inactive
    // ----------------------------------------------

    if (
      active === "true"
    ) {
      filter.isActive =
        true;
    }

    if (
      active === "false"
    ) {
      filter.isActive =
        false;
    }

    // ----------------------------------------------
    // Company
    // ----------------------------------------------

    if (companyId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          companyId,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid company ID",
          });
      }

      filter.company =
        companyId;
    }

    // ----------------------------------------------
    // Work Mode
    // ----------------------------------------------

    if (
      [
        "onsite",
        "hybrid",
        "remote",
      ].includes(workMode)
    ) {
      filter.workMode =
        workMode;
    }

    // ----------------------------------------------
    // Employment Type
    // ----------------------------------------------

    if (
      [
        "full-time",
        "part-time",
        "contract",
        "internship",
        "freelance",
      ].includes(
        employmentType,
      )
    ) {
      filter.employmentType =
        employmentType;
    }

    // ----------------------------------------------
    // Search
    // ----------------------------------------------

    if (search?.trim()) {
      const keyword =
        new RegExp(
          search
            .trim()
            .replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&",
            ),
          "i",
        );

      filter.$or = [
        {
          title:
            keyword,
        },

        {
          description:
            keyword,
        },

        {
          location:
            keyword,
        },

        {
          skills:
            keyword,
        },
      ];
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
      jobs,
      total,
    ] =
      await Promise.all([
        Job.find(filter)
          .populate({
            path:
              "company",

            select:
              "name slug logoUrl isActive isVerified",
          })
          .populate({
            path:
              "recruiter",

            select:
              "name email isActive",
          })
          .sort({
            createdAt: -1,
          })
          .skip(
            (currentPage -
              1) *
              pageSize,
          )
          .limit(
            pageSize,
          ),

        Job.countDocuments(
          filter,
        ),
      ]);

    return res
      .status(200)
      .json({
        success: true,

        jobs,

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
      "Admin jobs error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Failed to load jobs",
      });
  }
};

// --------------------------------------------------
// Admin - Get Job Details
// --------------------------------------------------

const getJobById = async (
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

    const job =
      await Job.findById(
        jobId,
      )
        .populate({
          path:
            "company",

          select:
            "name slug description industry location website companyEmail logoUrl companySize isVerified isActive",
        })
        .populate({
          path:
            "recruiter",

          select:
            "name email phone designation isActive",
        });

    if (!job) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Job not found",
        });
    }

    const applicationStats =
      await Application.aggregate([
        {
          $match: {
            job:
              job._id,
          },
        },

        {
          $group: {
            _id:
              "$status",

            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const stats = {
      total: 0,
      applied: 0,
      underReview: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
      withdrawn: 0,
    };

    for (
      const item of applicationStats
    ) {
      stats.total +=
        item.count;

      if (
        item._id ===
        "applied"
      ) {
        stats.applied =
          item.count;
      }

      if (
        item._id ===
        "under-review"
      ) {
        stats.underReview =
          item.count;
      }

      if (
        item._id ===
        "shortlisted"
      ) {
        stats.shortlisted =
          item.count;
      }

      if (
        item._id ===
        "rejected"
      ) {
        stats.rejected =
          item.count;
      }

      if (
        item._id ===
        "hired"
      ) {
        stats.hired =
          item.count;
      }

      if (
        item._id ===
        "withdrawn"
      ) {
        stats.withdrawn =
          item.count;
      }
    }

    return res
      .status(200)
      .json({
        success: true,

        job,

        applicationStats:
          stats,
      });
  } catch (error) {
    console.error(
      "Admin job details error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Failed to load job",
      });
  }
};

// --------------------------------------------------
// Admin - Moderate Job
// --------------------------------------------------

const moderateJob = async (
  req,
  res,
) => {
  try {
    const {
      jobId,
    } = req.params;

    const {
      isActive,
      status,
    } = req.body;

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

    const job =
      await Job.findById(
        jobId,
      ).populate({
        path:
          "company",

        select:
          "name isActive",
      });

    if (!job) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Job not found",
        });
    }

    // ----------------------------------------------
    // Disable
    // ----------------------------------------------

    if (!isActive) {
      job.isActive =
        false;

      job.status =
        "closed";

      await job.save();

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Job disabled successfully",

          job,
        });
    }

    // ----------------------------------------------
    // Reactivate
    // ----------------------------------------------

    if (
      !job.company ||
      !job.company.isActive
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Cannot activate a job while its company is inactive",
        });
    }

    job.isActive =
      true;

    job.status =
      status;

    await job.save();

    return res
      .status(200)
      .json({
        success: true,

        message:
          status ===
          "published"
            ? "Job restored and published successfully"
            : "Job restored as draft successfully",

        job,
      });
  } catch (error) {
    console.error(
      "Admin job moderation error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Failed to moderate job",
      });
  }
};

// --------------------------------------------------
// Admin - Get Applications
// --------------------------------------------------

const getApplications = async (
  req,
  res,
) => {
  try {
    const {
      search,
      status,
      jobId,
      companyId,
      recruiterId,
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

    const filter = {};

    // ----------------------------------------------
    // Status
    // ----------------------------------------------

    if (
      status &&
      validStatuses.includes(status)
    ) {
      filter.status = status;
    }

    // ----------------------------------------------
    // Job
    // ----------------------------------------------

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

      filter.job = jobId;
    }

    // ----------------------------------------------
    // Company
    // ----------------------------------------------

    if (companyId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          companyId,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid company ID",
          });
      }

      filter.company =
        companyId;
    }

    // ----------------------------------------------
    // Recruiter
    // ----------------------------------------------

    if (recruiterId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          recruiterId,
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid recruiter ID",
          });
      }

      filter.recruiter =
        recruiterId;
    }

    // ----------------------------------------------
    // Search Candidate / Job / Company
    // ----------------------------------------------

    if (search?.trim()) {
      const escapedSearch =
        search
          .trim()
          .replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
          );

      const keyword =
        new RegExp(
          escapedSearch,
          "i",
        );

      const [
        matchingUsers,
        matchingJobs,
        matchingCompanies,
      ] = await Promise.all([
        User.find({
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
        }).select("_id"),

        Job.find({
          $or: [
            {
              title:
                keyword,
            },

            {
              location:
                keyword,
            },
          ],
        }).select("_id"),

        Company.find({
          $or: [
            {
              name:
                keyword,
            },

            {
              industry:
                keyword,
            },

            {
              location:
                keyword,
            },
          ],
        }).select("_id"),
      ]);

      filter.$or = [
        {
          applicant: {
            $in:
              matchingUsers.map(
                (user) =>
                  user._id,
              ),
          },
        },

        {
          job: {
            $in:
              matchingJobs.map(
                (job) =>
                  job._id,
              ),
          },
        },

        {
          company: {
            $in:
              matchingCompanies.map(
                (company) =>
                  company._id,
              ),
          },
        },
      ];
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
    ] = await Promise.all([
      Application.find(
        filter,
      )
        .populate({
          path:
            "applicant",

          select:
            "name email phone headline location skills experienceYears education resumeUrl isActive",
        })
        .populate({
          path: "job",

          select:
            "title location workMode employmentType experienceLevel status isActive",
        })
        .populate({
          path:
            "company",

          select:
            "name slug logoUrl industry isVerified isActive",
        })
        .populate({
          path:
            "recruiter",

          select:
            "name email designation isActive",
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
      "Admin applications error:",
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
// Admin - Get Application Details
// --------------------------------------------------

const getApplicationById = async (
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
      await Application.findById(
        applicationId,
      )
        .populate({
          path:
            "applicant",

          select:
            "name email phone avatar headline bio location skills experienceYears education resumeUrl isActive createdAt",
        })
        .populate({
          path: "job",

          select:
            "title description responsibilities requirements skills location workMode employmentType experienceLevel minExperience maxExperience salaryMin salaryMax salaryCurrency salaryPeriod openings applicationDeadline status isActive",
        })
        .populate({
          path:
            "company",

          select:
            "name slug description industry location website companyEmail logoUrl companySize foundedYear isVerified isActive",
        })
        .populate({
          path:
            "recruiter",

          select:
            "name email phone designation companyName isActive",
        })
        .populate({
          path:
            "statusHistory.changedBy",

          select:
            "name email role",
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
      "Admin application details error:",
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

module.exports = {
  getDashboardStats,

  getUsers,
  getUserById,
  updateUserStatus,

  getCompanies,
  getCompanyById,
  updateCompanyVerification,
  updateCompanyStatus,

  getJobs,
  getJobById,
  moderateJob,

  getApplications,
  getApplicationById,
};