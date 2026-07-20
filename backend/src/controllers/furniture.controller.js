const Furniture = require("../models/Furniture");

const createFurniture = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      pricePerMonth,
      securityDeposit,
      quantity,
      condition,
      city,
      pickupAddress,
      dimensions,
    } = req.body;

    const furniture = await Furniture.create({
      seller: req.user._id,
      title,
      description,
      category,
      pricePerMonth,
      securityDeposit,
      quantity,
      condition,
      city,
      pickupAddress,
      dimensions,
    });

    res.status(201).json({
      success: true,
      message: "Furniture created successfully",
      data: furniture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFurniture,
};