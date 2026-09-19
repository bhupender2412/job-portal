const mongoose = require("mongoose");

const applicationSchema =
  new mongoose.Schema(
    {
      job: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Job",

        required: true,

        index: true,
      },

      applicant: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      company: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Company",

        required: true,

        index: true,
      },

      recruiter: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      resumeUrl: {
        type: String,

        trim: true,

        default: "",
      },

      coverLetter: {
        type: String,

        trim: true,

        default: "",

        maxlength: 3000,
      },

      status: {
        type: String,

        enum: [
          "applied",
          "under-review",
          "shortlisted",
          "rejected",
          "hired",
          "withdrawn",
        ],

        default: "applied",

        index: true,
      },

      statusHistory: [
        {
          status: {
            type: String,

            enum: [
              "applied",
              "under-review",
              "shortlisted",
              "rejected",
              "hired",
              "withdrawn",
            ],

            required: true,
          },

          changedAt: {
            type: Date,

            default: Date.now,
          },

          changedBy: {
            type:
              mongoose.Schema.Types
                .ObjectId,

            ref: "User",

            default: null,
          },
        },
      ],

      appliedAt: {
        type: Date,

        default: Date.now,
      },
    },
    {
      timestamps: true,
    },
  );

// One user can apply only once to the same job.
applicationSchema.index(
  {
    job: 1,
    applicant: 1,
  },
  {
    unique: true,
  },
);

module.exports =
  mongoose.model(
    "Application",
    applicationSchema,
  );