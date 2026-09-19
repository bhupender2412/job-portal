const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "jobseeker",
        "recruiter",
        "admin",
      ],
      default: "jobseeker",
    },

    avatar: {
      type: String,
      default: "",
    },

    // --------------------------------------------
    // Job Seeker Profile
    // --------------------------------------------

    headline: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    experienceYears: {
      type: Number,
      default: 0,
      min: 0,
    },

    education: {
      type: String,
      trim: true,
      default: "",
    },

    resumeUrl: {
      type: String,
      default: "",
    },

    resumePublicId: {
      type: String,
      default: "",
    },

    // --------------------------------------------
    // Recruiter Profile
    // --------------------------------------------

    companyName: {
      type: String,
      trim: true,
      default: "",
    },

    designation: {
      type: String,
      trim: true,
      default: "",
    },

    // --------------------------------------------
    // Account State
    // --------------------------------------------

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// --------------------------------------------------
// Password Hashing
// --------------------------------------------------

userSchema.pre(
  "save",
  async function () {
    if (
      !this.isModified(
        "password",
      )
    ) {
      return;
    }

    const salt =
      await bcrypt.genSalt(10);

    this.password =
      await bcrypt.hash(
        this.password,
        salt,
      );
  },
);

// --------------------------------------------------
// Compare Password
// --------------------------------------------------

userSchema.methods.comparePassword =
  async function (
    candidatePassword,
  ) {
    return bcrypt.compare(
      candidatePassword,
      this.password,
    );
  };

module.exports =
  mongoose.model(
    "User",
    userSchema,
  );