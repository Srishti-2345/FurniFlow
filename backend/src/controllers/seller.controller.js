const SellerProfile = require("../models/sellerProfile.model");

exports.createSellerProfile = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can create a seller profile",
      });
    }

    const existing = await SellerProfile.findOne({
      user: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Seller profile already exists",
      });
    }

    const profile = await SellerProfile.create({
      user: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getMySellerProfile = async (req, res) => {
  try {
    const profile = await SellerProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateSellerProfile = async (req, res) => {
  try {
    const profile = await SellerProfile.findOneAndUpdate(
      {
        user: req.user._id,
      },
      req.body,
      {
        new: true,
      }
    );

    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};