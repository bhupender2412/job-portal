const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    industry: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },

    location: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },

    companyEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    logoUrl: {
      type: String,
      trim: true,
      default: "",
    },

    companySize: {
      type: String,
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1000+",
        "",
      ],
      default: "",
    },

    foundedYear: {
      type: Number,
      default: null,
      min: 1800,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

companySchema.index({
  name: "text",
  description: "text",
  industry: "text",
});

module.exports = mongoose.model(
  "Company",
  companySchema,
);