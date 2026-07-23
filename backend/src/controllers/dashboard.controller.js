const Furniture = require("../models/Furniture");
const Booking = require("../models/booking.model");
const User = require("../models/User");

exports.getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // ==========================
    // Furniture Statistics
    // ==========================

    const totalListings = await Furniture.countDocuments({
      seller: sellerId,
    });

    const activeListings = await Furniture.countDocuments({
      seller: sellerId,
      status: "active",
    });

    const inactiveListings = await Furniture.countDocuments({
      seller: sellerId,
      status: "inactive",
    });

    // ==========================
    // Booking Statistics
    // ==========================

    const bookingStats = await Booking.aggregate([
      {
        $match: {
          seller: sellerId,
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const bookingMap = {};

    bookingStats.forEach((item) => {
      bookingMap[item._id] = item.count;
    });

    // ==========================
    // Revenue
    // ==========================

    const revenue = await Booking.aggregate([
      {
        $match: {
          seller: sellerId,
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    // ==========================
    // Recent Bookings
    // ==========================

    const recentBookings = await Booking.find({
      seller: sellerId,
    })
      .populate("customer", "fullName")
      .populate("furniture", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    // ==========================
    // Recent Listings
    // ==========================

    const recentListings = await Furniture.find({
      seller: sellerId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // ==========================
    // Seller Rating
    // ==========================

    const seller = await User.findById(sellerId).select(
      "averageRating totalReviews fullName email"
    );

    res.status(200).json({
      success: true,

      seller,

      statistics: {
        totalListings,
        activeListings,
        inactiveListings,

        totalBookings:
          bookingStats.reduce(
            (sum, item) => sum + item.count,
            0
          ),

        pendingBookings:
          bookingMap.pending || 0,

        confirmedBookings:
          bookingMap.confirmed || 0,

        activeBookings:
          bookingMap.active || 0,

        completedBookings:
          bookingMap.completed || 0,

        cancelledBookings:
          bookingMap.cancelled || 0,

        totalRevenue:
          revenue.length > 0
            ? revenue[0].totalRevenue
            : 0,
      },

      recentBookings,

      recentListings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
