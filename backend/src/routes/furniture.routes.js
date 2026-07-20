const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize");

const {
  createFurniture,
} = require("../controllers/furniture.controller");

// Create Furniture
router.post(
  "/",
  protect,
  authorize("seller"),
  createFurniture
);

module.exports = router;