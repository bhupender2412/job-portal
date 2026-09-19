const User = require("../models/User");

const generateToken =
  require("../utils/generateToken");

// --------------------------------------------------
// Register
// --------------------------------------------------

const register = async (
  req,
  res,
) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
    } = req.body;

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res
        .status(409)
        .json({
          success: false,
          message:
            "An account with this email already exists",
        });
    }

    const user =
      await User.create({
        name,
        email,
        phone,
        password,
        role,
      });

    const token =
      generateToken(
        user._id,
      );

    return res
      .status(201)
      .json({
        success: true,
        message:
          "Account created successfully",

        token,

        user: {
          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          phone:
            user.phone,

          role:
            user.role,

          avatar:
            user.avatar,

          createdAt:
            user.createdAt,
        },
      });
  } catch (error) {
    console.error(
      "Register error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Unable to create account",
      });
  }
};

// --------------------------------------------------
// Login
// --------------------------------------------------

const login = async (
  req,
  res,
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      }).select(
        "+password",
      );

    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Invalid email or password",
        });
    }

    const passwordMatches =
      await user.comparePassword(
        password,
      );

    if (!passwordMatches) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Invalid email or password",
        });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({
          success: false,
          message:
            "Your account has been disabled",
        });
    }

    user.lastLoginAt =
      new Date();

    await user.save({
      validateBeforeSave:
        false,
    });

    const token =
      generateToken(
        user._id,
      );

    return res
      .status(200)
      .json({
        success: true,
        message:
          "Login successful",

        token,

        user: {
          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          phone:
            user.phone,

          role:
            user.role,

          avatar:
            user.avatar,

          headline:
            user.headline,

          companyName:
            user.companyName,

          designation:
            user.designation,

          lastLoginAt:
            user.lastLoginAt,
        },
      });
  } catch (error) {
    console.error(
      "Login error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Unable to login",
      });
  }
};

// --------------------------------------------------
// Current User
// --------------------------------------------------

const getMe = async (
  req,
  res,
) => {
  return res
    .status(200)
    .json({
      success: true,

      user: {
        id:
          req.user._id,

        name:
          req.user.name,

        email:
          req.user.email,

        phone:
          req.user.phone,

        role:
          req.user.role,

        avatar:
          req.user.avatar,

        headline:
          req.user.headline,

        bio:
          req.user.bio,

        location:
          req.user.location,

        skills:
          req.user.skills,

        experienceYears:
          req.user.experienceYears,

        education:
          req.user.education,

        resumeUrl:
          req.user.resumeUrl,

        companyName:
          req.user.companyName,

        designation:
          req.user.designation,

        isActive:
          req.user.isActive,

        lastLoginAt:
          req.user.lastLoginAt,

        createdAt:
          req.user.createdAt,
      },
    });
};

module.exports = {
  register,
  login,
  getMe,
};