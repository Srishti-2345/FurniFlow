const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  getSellerBookings,
  updateBookingStatus,
  cancelBooking,
} = require("../controllers/booking.controller");

// Customer
router.post(
  "/",
  protect,
  authorize("customer"),
  createBooking
);

router.get(
  "/my-bookings",
  protect,
  authorize("customer"),
  getMyBookings
);

router.patch(
  "/:id/cancel",
  protect,
  authorize("customer"),
  cancelBooking
);

// Seller
router.get(
  "/seller-bookings",
  protect,
  authorize("seller"),
  getSellerBookings
);

router.patch(
  "/:id/status",
  protect,
  authorize("seller"),
  updateBookingStatus
);

// Shared
router.get(
  "/:id",
  protect,
  getBookingById
);

module.exports = router;