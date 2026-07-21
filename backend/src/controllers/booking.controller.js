const Booking = require("../models/booking.model");
const Furniture = require("../models/furniture.model");

// =========================
// Create Booking
// =========================
exports.createBooking = async (req, res) => {
  try {
    const {
      furnitureId,
      rentalMonths,
      deliveryAddress,
      startDate,
    } = req.body;

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

    // Customer cannot book own furniture
    if (furniture.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot book your own furniture",
      });
    }

    if (furniture.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Furniture is out of stock",
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

    furniture.quantity--;

    if (furniture.quantity === 0) {
      furniture.isAvailable = false;
    }

    await furniture.save();

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

// =========================
// Customer Bookings
// =========================
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user._id,
    })
      .populate("furniture")
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Booking Details
// =========================
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "fullName email")
      .populate("seller", "fullName email")
      .populate("furniture");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      booking.customer._id.toString() !== req.user._id.toString() &&
      booking.seller._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Seller Bookings
// =========================
exports.getSellerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      seller: req.user._id,
    })
      .populate("customer", "fullName email phoneNumber")
      .populate("furniture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update Booking Status
// =========================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const transitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["active", "cancelled"],
      active: ["completed"],
      completed: [],
      cancelled: [],
    };

    if (!transitions[booking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change booking from ${booking.status} to ${status}`,
      });
    }

    booking.status = status;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Cancel Booking
// =========================
exports.cancelBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Booking cannot be cancelled now",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    const furniture = await Furniture.findById(booking.furniture);

    furniture.quantity++;
    furniture.isAvailable = true;

    await furniture.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};