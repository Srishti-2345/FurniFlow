const Review = require("../models/review.model");
const Booking = require("../models/booking.model");
const User = require("../models/User");

// Helper Function
const updateSellerRating = async (sellerId) => {
  const reviews = await Review.find({ seller: sellerId });

  const totalReviews = reviews.length;

  let averageRating = 0;

  if (totalReviews > 0) {
    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    averageRating = totalRating / totalReviews;
  }

  await User.findByIdAndUpdate(sellerId, {
    averageRating,
    totalReviews,
  });
};

// Create Review
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);

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

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Booking must be completed before reviewing",
      });
    }

    const existingReview = await Review.findOne({
      booking: bookingId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted",
      });
    }

    const review = await Review.create({
      booking: booking._id,
      furniture: booking.furniture,
      seller: booking.seller,
      customer: booking.customer,
      rating,
      comment,
    });

    await updateSellerRating(booking.seller);

    res.status(201).json({
      success: true,
      review,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Seller Reviews
exports.getSellerReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      seller: req.params.sellerId,
    })
      .populate("customer", "fullName profileImage")
      .populate("furniture", "title images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Review
exports.updateReview = async (req, res) => {
  try {

    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;

    await review.save();

    await updateSellerRating(review.seller);

    res.status(200).json({
      success: true,
      review,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const sellerId = review.seller;

    await review.deleteOne();

    await updateSellerRating(sellerId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
