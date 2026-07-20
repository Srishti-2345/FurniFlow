const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

const {
  createFurniture,
  getAllFurniture,
  getFurnitureById,
} = require("../controllers/furniture.controller");

// Public Routes
const {
    validateFurniture,
} = require("../validators/furniture.validator");
router.get("/", getAllFurniture);
router.get("/:id", getFurnitureById);

// Seller Route
router.post(
  "/",
  protect,
  authorize("seller"),
  validateFurniture,
  createFurniture
);

module.exports = router;