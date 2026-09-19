const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 5000,
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    requirements: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    workMode: {
      type: String,
      enum: [
        "onsite",
        "hybrid",
        "remote",
      ],
      required: true,
    },

    employmentType: {
      type: String,
      enum: [
        "full-time",
        "part-time",
        "contract",
        "internship",
        "freelance",
      ],
      required: true,
    },

    experienceLevel: {
      type: String,
      enum: [
        "fresher",
        "junior",
        "mid",
        "senior",
        "lead",
      ],
      required: true,
    },

    minExperience: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxExperience: {
      type: Number,
      default: null,
      min: 0,
    },

    salaryMin: {
      type: Number,
      default: null,
      min: 0,
    },

    salaryMax: {
      type: Number,
      default: null,
      min: 0,
    },

    salaryCurrency: {
      type: String,
      default: "INR",
      trim: true,
      uppercase: true,
    },

    salaryPeriod: {
      type: String,
      enum: [
        "year",
        "month",
        "hour",
      ],
      default: "year",
    },

    openings: {
      type: Number,
      default: 1,
      min: 1,
      max: 1000,
    },

    applicationDeadline: {
      type: Date,
      default: null,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "published",
        "closed",
      ],
      default: "draft",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    applicationCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

jobSchema.index({
  title: "text",
  description: "text",
  skills: "text",
  location: "text",
});

module.exports = mongoose.model(
  "Job",
  jobSchema,
);