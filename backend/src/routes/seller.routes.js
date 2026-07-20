const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  createSellerProfile,
  getMySellerProfile,
  updateSellerProfile,
} = require("../controllers/seller.controller");

router.post("/profile", auth, createSellerProfile);

router.get("/profile", auth, getMySellerProfile);

router.patch("/profile", auth, updateSellerProfile);

module.exports = router;