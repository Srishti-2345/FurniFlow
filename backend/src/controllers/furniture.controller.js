const Furniture = require("../models/furniture.model");

const Furniture = require("../models/furniture.model");

// CREATE FURNITURE
exports.createFurniture = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      pricePerMonth,
      securityDeposit,
      quantity,
      condition,
      city,
      pickupAddress,
      dimensions,
      images,
    } = req.body;

    const furniture = await Furniture.create({
      seller: req.user._id,
      title,
      description,
      category,
      pricePerMonth,
      securityDeposit,
      quantity,
      condition,
      city,
      pickupAddress,
      dimensions,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Furniture listed successfully",
      furniture,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET ALL FURNITURE
exports.getAllFurniture = async (req, res) => {
  try {
    const {
      keyword,
      category,
      city,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const query = {
      status: "active",
      isAvailable: true,
    };

    // Search by title
    if (keyword) {
      query.title = {
        $regex: keyword,
        $options: "i",
      };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // City filter
    if (city) {
      query.city = city;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.pricePerMonth = {};

      if (minPrice) {
        query.pricePerMonth.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.pricePerMonth.$lte = Number(maxPrice);
      }
    }

    let furnitureQuery = Furniture.find(query).populate(
      "seller",
      "fullName email"
    );

    // Sorting
    if (sort === "price_asc") {
      furnitureQuery = furnitureQuery.sort({
        pricePerMonth: 1,
      });
    } else if (sort === "price_desc") {
      furnitureQuery = furnitureQuery.sort({
        pricePerMonth: -1,
      });
    } else {
      furnitureQuery = furnitureQuery.sort({
        createdAt: -1,
      });
    }

    const furniture = await furnitureQuery;

    res.status(200).json({
      success: true,
      count: furniture.length,
      furniture,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE FURNITURE
exports.getFurnitureById = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id)
      .populate("seller", "fullName email phoneNumber");

    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: "Furniture not found",
      });
    }

    res.status(200).json({
      success: true,
      furniture,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};