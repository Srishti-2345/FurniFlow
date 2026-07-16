const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const sellerOnly = require("../middleware/seller.middleware");

const {
    createFurniture,
    getMyFurniture,
    getFurnitureById,
    updateFurniture,
    deleteFurniture,
} = require("../controllers/furniture.controller");

// Seller Routes
router.post("/", protect, sellerOnly, createFurniture);

router.get("/me", protect, sellerOnly, getMyFurniture);

router.patch("/:id", protect, sellerOnly, updateFurniture);

router.delete("/:id", protect, sellerOnly, deleteFurniture);

// Public Route
router.get("/:id", getFurnitureById);

module.exports = router;