const Company = require("../models/Company");

const createSlug = require("../utils/createSlug");

// --------------------------------------------------
// Create Company
// --------------------------------------------------

const createCompany = async (
  req,
  res,
) => {
  try {
    const existingCompany =
      await Company.findOne({
        recruiter:
          req.user._id,
      });

    if (existingCompany) {
      return res
        .status(409)
        .json({
          success: false,
          message:
            "You already have a company profile",
        });
    }

    let slug =
      createSlug(
        req.body.name,
      );

    const slugExists =
      await Company.findOne({
        slug,
      });

    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    const company =
      await Company.create({
        ...req.body,

        slug,

        recruiter:
          req.user._id,
      });

    await company.populate({
      path: "recruiter",
      select:
        "name email designation",
    });

    return res
      .status(201)
      .json({
        success: true,

        message:
          "Company created successfully",

        company,
      });
  } catch (error) {
    console.error(
      "Create company error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Failed to create company",
      });
  }
};

// --------------------------------------------------
// Get Current Recruiter's Company
// --------------------------------------------------

const getMyCompany = async (
  req,
  res,
) => {
  try {
    const company =
      await Company.findOne({
        recruiter:
          req.user._id,
      }).populate({
        path: "recruiter",
        select:
          "name email designation",
      });

    if (!company) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Company profile not found",
        });
    }

    return res
      .status(200)
      .json({
        success: true,
        company,
      });
  } catch (error) {
    console.error(
      "Get company error:",
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
// Update Current Recruiter's Company
// --------------------------------------------------

const updateMyCompany = async (
  req,
  res,
) => {
  try {
    const company =
      await Company.findOne({
        recruiter:
          req.user._id,
      });

    if (!company) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Company profile not found",
        });
    }

    // Update slug when company name changes.
    if (
      req.body.name &&
      req.body.name !==
        company.name
    ) {
      let slug =
        createSlug(
          req.body.name,
        );

      const slugExists =
        await Company.findOne({
          slug,

          _id: {
            $ne:
              company._id,
          },
        });

      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }

      req.body.slug = slug;
    }

    Object.assign(
      company,
      req.body,
    );

    await company.save();

    await company.populate({
      path: "recruiter",
      select:
        "name email designation",
    });

    return res
      .status(200)
      .json({
        success: true,

        message:
          "Company updated successfully",

        company,
      });
  } catch (error) {
    console.error(
      "Update company error:",
      error.message,
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Failed to update company",
      });
  }
};

// --------------------------------------------------
// Public Company Profile
// --------------------------------------------------

const getCompanyBySlug = async (
  req,
  res,
) => {
  try {
    const company =
      await Company.findOne({
        slug:
          req.params.slug,

        isActive:
          true,
      }).populate({
        path: "recruiter",
        select:
          "name designation",
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

    return res
      .status(200)
      .json({
        success: true,
        company,
      });
  } catch (error) {
    console.error(
      "Get public company error:",
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

module.exports = {
  createCompany,
  getMyCompany,
  updateMyCompany,
  getCompanyBySlug,
};