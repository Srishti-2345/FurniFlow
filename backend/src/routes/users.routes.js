const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize");
const { getMe } = require("../controllers/user.controller");
router.get("/me", protect, getMe);
router.get(
    "/customer-dashboard",
    protect,
    authorize("customer"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Customer"
        });
    }
);

// Seller only
router.get(
    "/seller-dashboard",
    protect,
    authorize("seller"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Seller"
        });
    }
);

module.exports = router;