const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize");

const {
  getSellerDashboard,
} = require("../controllers/dashboard.controller");

router.get(
  "/seller",
  protect,
  authorize("seller"),
  getSellerDashboard
);

module.exports = router;
