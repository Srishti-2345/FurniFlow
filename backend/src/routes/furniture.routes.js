const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

const {
    createFurniture,
    getAllFurniture,
    getFurnitureById,
    getMyFurniture,
    updateFurniture,
    updateFurnitureStatus,
    deleteFurniture,
} = require("../controllers/furniture.controller");


// Seller Route
router.post(
  "/",
  protect,
  authorize("seller"),
  validateFurniture,
  createFurniture
);
// Seller Routes
router.get(
    "/my-listings",
    protect,
    authorize("seller"),
    getMyFurniture
);

router.patch(
    "/:id",
    protect,
    authorize("seller"),
    updateFurniture
);

router.patch(
    "/:id/status",
    protect,
    authorize("seller"),
    updateFurnitureStatus
);

router.delete(
    "/:id",
    protect,
    authorize("seller"),
    deleteFurniture
);
router.get("/", getAllFurniture);
router.get("/:id", getFurnitureById);

module.exports = router;