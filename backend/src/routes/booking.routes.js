const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

const {
    validateBooking,
} = require("../validators/booking.validator");

router.post(
    "/",
    protect,
    authorize("customer"),
    validateBooking,
    createBooking
);
module.exports = router;