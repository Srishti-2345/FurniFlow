const Booking = require("../models/booking.model");
const Furniture = require("../models/furniture.model");

exports.createBooking = async (req, res) => {
  try {
    const {
      furnitureId,
      rentalMonths,
      deliveryAddress,
      startDate,
    } = req.body;

    // Check furniture exists
    const furniture = await Furniture.findById(furnitureId);

    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: "Furniture not found",
      });
    }

    if (!furniture.isAvailable || furniture.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Furniture is not available",
      });
    }

    const totalAmount =
      furniture.pricePerMonth * rentalMonths +
      furniture.securityDeposit;

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + rentalMonths);

    const booking = await Booking.create({
      customer: req.user._id,
      seller: furniture.seller,
      furniture: furniture._id,

      rentalMonths,

      pricePerMonthSnapshot: furniture.pricePerMonth,
      securityDepositSnapshot: furniture.securityDeposit,

      totalAmount,

      deliveryAddress,

      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};