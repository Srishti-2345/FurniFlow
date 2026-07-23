const express = require("express");

const router = express.Router();
const upload = require("../middleware/upload.middleware");
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize");
const { validateFurniture } = require("../validations/furniture.validator");
const {
    createFurniture,
    getAllFurniture,
    getFurnitureById,
    getMyFurniture,
    updateFurniture,
    updateFurnitureStatus,
    deleteFurniture,
    searchFurniture,
    uploadFurnitureImages
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
router.get("/search", searchFurniture);
router.get("/:id", getFurnitureById);
router.post(
    "/:id/images",
    protect,
    authorize("seller"),
    upload.array("images", 8),
    uploadFurnitureImages
);

module.exports = router;
