const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

const {
  createReview,
  getSellerReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

// Customer creates review
router.post(
  "/",
  protect,
  authorize("customer"),
  createReview
);

// Public seller reviews
router.get(
  "/seller/:sellerId",
  getSellerReviews
);

// Customer updates own review
router.patch(
  "/:id",
  protect,
  authorize("customer"),
  updateReview
);

// Customer deletes own review
router.delete(
  "/:id",
  protect,
  authorize("customer"),
  deleteReview
);

module.exports = router;