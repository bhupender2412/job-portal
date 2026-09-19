const mongoose = require("mongoose");
const Job = require("../models/Job");
const Company = require("../models/Company");

// --------------------------------------------------
// Clean String Array
// --------------------------------------------------

const cleanArray = (
  values,
) => {
  if (
    !Array.isArray(values)
  ) {
    return [];
  }

  return [
    ...new Set(
      values
        .map((value) =>
          value.trim(),
        )
        .filter(Boolean),
    ),
  ];
};


// --------------------------------------------------
// Escape Search Text
// --------------------------------------------------

const escapeRegex = (value = "") => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
};

// --------------------------------------------------
// Public Job Filter
// --------------------------------------------------

const buildPublicJobFilter = (
  query,
) => {
  const {
    search,
    location,
    workMode,
    employmentType,
    experienceLevel,
    skill,
    minSalary,
    maxSalary,
  } = query;

  const now = new Date();

  const filter = {
    status: "published",
    isActive: true,

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
  };

  // Search
  if (search?.trim()) {
    const keyword =
      new RegExp(
        escapeRegex(
          search.trim(),
        ),
        "i",
      );

    filter.$and = [
      {
        $or: [
          {
            title:
              keyword,
          },

          {
            description:
              keyword,
          },

          {
            skills:
              keyword,
          },

          {
            location:
              keyword,
          },
        ],
      },
    ];
  }

  // Location
  if (location?.trim()) {
    filter.location =
      new RegExp(
        escapeRegex(
          location.trim(),
        ),
        "i",
      );
  }

  // Work Mode
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

  // Employment Type
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

  // Experience Level
  if (
    [
      "fresher",
      "junior",
      "mid",
      "senior",
      "lead",
    ].includes(
      experienceLevel,
    )
  ) {
    filter.experienceLevel =
      experienceLevel;
  }

  // Skill
  if (skill?.trim()) {
    filter.skills =
      new RegExp(
        escapeRegex(
          skill.trim(),
        ),
        "i",
      );
  }

  // Minimum desired salary
  if (
    minSalary !==
      undefined &&
    !Number.isNaN(
      Number(minSalary),
    )
  ) {
    filter.salaryMax = {
      ...(filter.salaryMax ||
        {}),

      $gte:
        Number(
          minSalary,
        ),
    };
  }

  // Maximum desired salary
  if (
    maxSalary !==
      undefined &&
    !Number.isNaN(
      Number(maxSalary),
    )
  ) {
    filter.salaryMin = {
      ...(filter.salaryMin ||
        {}),

      $lte:
        Number(
          maxSalary,
        ),
    };
  }

  return filter;
};

// --------------------------------------------------
// Create Job
// --------------------------------------------------

const createJob = async (
  req,
  res,
) => {
  try {
    const company =
      await Company.findOne({
        recruiter:
          req.user._id,

        isActive: true,
      });

    if (!company) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Create an active company profile before posting jobs",
        });
    }

    const jobData = {
      ...req.body,

      company:
        company._id,

      recruiter:
        req.user._id,
    };

    if (
      req.body.skills
    ) {
      jobData.skills =
        cleanArray(
          req.body.skills,
        );
    }

    if (
      req.body.requirements
    ) {
      jobData.requirements =
        cleanArray(
          req.body.requirements,
        );
    }

    if (
      req.body.responsibilities
    ) {
      jobData.responsibilities =
        cleanArray(
          req.body
            .responsibilities,
        );
    }

    if (
      req.body
        .applicationDeadline
    ) {
      jobData.applicationDeadline =
        new Date(
          req.body
            .applicationDeadline,
        );
    }

    const job =
      await Job.create(
        jobData,
      );

    await job.populate([
      {
        path: "company",

        select:
          "name slug logoUrl location industry",
      },

      {
        path: "recruiter",

        select:
          "name email designation",
      },
    ]);

    return res
      .status(201)
      .json({
        success: true,

        message:
          job.status ===
          "published"
            ? "Job published successfully"
            : "Job draft created successfully",

        job,
      });
  } catch (error) {
    console.error(
      "Create job error:",
      error,
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Failed to create job",
      });
  }
};

// --------------------------------------------------
// Recruiter - Get My Jobs
// --------------------------------------------------

const getMyJobs = async (
  req,
  res,
) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {
      recruiter:
        req.user._id,
    };

    if (
      status &&
      [
        "draft",
        "published",
        "closed",
      ].includes(status)
    ) {
      filter.status =
        status;
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
              "name slug logoUrl location industry",
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
      "Get recruiter jobs error:",
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
// Recruiter - Get One Job
// --------------------------------------------------

const getMyJobById = async (
  req,
  res,
) => {
  try {
    const {
      jobId,
    } = req.params;

    if (
      !require("mongoose")
        .Types.ObjectId.isValid(
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
      await Job.findOne({
        _id:
          jobId,

        recruiter:
          req.user._id,
      }).populate({
        path: "company",

        select:
          "name slug logoUrl location industry",
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

    return res
      .status(200)
      .json({
        success: true,
        job,
      });
  } catch (error) {
    console.error(
      "Get recruiter job error:",
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
// Recruiter - Update Job
// --------------------------------------------------

const updateMyJob = async (
  req,
  res,
) => {
  try {
    const {
      jobId,
    } = req.params;

    const job =
      await Job.findOne({
        _id:
          jobId,

        recruiter:
          req.user._id,
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

    const updates = {
      ...req.body,
    };

    if (
      updates.skills
    ) {
      updates.skills =
        cleanArray(
          updates.skills,
        );
    }

    if (
      updates.requirements
    ) {
      updates.requirements =
        cleanArray(
          updates.requirements,
        );
    }

    if (
      updates.responsibilities
    ) {
      updates.responsibilities =
        cleanArray(
          updates.responsibilities,
        );
    }

    if (
      updates.applicationDeadline
    ) {
      updates.applicationDeadline =
        new Date(
          updates.applicationDeadline,
        );
    }

    Object.assign(
      job,
      updates,
    );

    await job.save();

    await job.populate({
      path: "company",

      select:
        "name slug logoUrl location industry",
    });

    return res
      .status(200)
      .json({
        success: true,

        message:
          "Job updated successfully",

        job,
      });
  } catch (error) {
    console.error(
      "Update recruiter job error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Failed to update job",
      });
  }
};

// --------------------------------------------------
// Recruiter - Update Job Status
// --------------------------------------------------

const updateMyJobStatus =
  async (
    req,
    res,
  ) => {
    try {
      const {
        jobId,
      } = req.params;

      const {
        status,
      } = req.body;

      const job =
        await Job.findOne({
          _id:
            jobId,

          recruiter:
            req.user._id,
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

      job.status =
        status;

      if (
        status ===
        "published"
      ) {
        job.isActive =
          true;
      }

      await job.save();

      return res
        .status(200)
        .json({
          success: true,

          message:
            status ===
            "published"
              ? "Job published successfully"
              : status ===
                  "closed"
                ? "Job closed successfully"
                : "Job moved to draft",

          job,
        });
    } catch (error) {
      console.error(
        "Update job status error:",
        error.message,
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to update job status",
        });
    }
  };

// --------------------------------------------------
// Recruiter - Deactivate Job
// --------------------------------------------------

const deactivateMyJob =
  async (
    req,
    res,
  ) => {
    try {
      const {
        jobId,
      } = req.params;

      const job =
        await Job.findOne({
          _id:
            jobId,

          recruiter:
            req.user._id,
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
            "Job deactivated successfully",

          job,
        });
    } catch (error) {
      console.error(
        "Deactivate job error:",
        error.message,
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to deactivate job",
        });
    }
  };


// --------------------------------------------------
// Public - Get Jobs
// --------------------------------------------------

const getPublicJobs =
  async (
    req,
    res,
  ) => {
    try {
      const {
        page = 1,
        limit = 12,
        sort = "newest",
      } = req.query;

      const filter =
        buildPublicJobFilter(
          req.query,
        );

      const currentPage =
        Math.max(
          Number(page) || 1,
          1,
        );

      const pageSize =
        Math.min(
          Math.max(
            Number(limit) ||
              12,
            1,
          ),
          50,
        );

      let sortOptions = {
        createdAt: -1,
      };

      if (
        sort ===
        "oldest"
      ) {
        sortOptions = {
          createdAt: 1,
        };
      }

      if (
        sort ===
        "salary-high"
      ) {
        sortOptions = {
          salaryMax: -1,
          createdAt: -1,
        };
      }

      if (
        sort ===
        "salary-low"
      ) {
        sortOptions = {
          salaryMin: 1,
          createdAt: -1,
        };
      }

      const [
        jobs,
        total,
      ] =
        await Promise.all([
          Job.find(
            filter,
          )
            .populate({
              path:
                "company",

              select:
                "name slug logoUrl industry location isVerified",
            })
            .select(
              "-__v",
            )
            .sort(
              sortOptions,
            )
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
        "Get public jobs error:",
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
// Public - Get Job Details
// --------------------------------------------------

const getPublicJobById =
  async (
    req,
    res,
  ) => {
    try {
      const {
        jobId,
      } = req.params;

      if (
        !mongoose.Types
          .ObjectId.isValid(
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
                $gte:
                  now,
              },
            },
          ],
        })
          .populate({
            path:
              "company",

            select:
              "name slug description industry location website companyEmail logoUrl companySize foundedYear isVerified",
          })
          .populate({
            path:
              "recruiter",

            select:
              "name designation",
          })
          .select(
            "-__v",
          );

      if (!job) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Job not found or no longer available",
          });
      }

      return res
        .status(200)
        .json({
          success: true,
          job,
        });
    } catch (error) {
      console.error(
        "Get public job error:",
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

module.exports = {
  createJob,
  getMyJobs,
  getMyJobById,
  updateMyJob,
  updateMyJobStatus,
  deactivateMyJob,

  getPublicJobs,
  getPublicJobById,
};