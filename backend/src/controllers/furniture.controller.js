const Furniture = require("../models/furniture.model");

const Furniture = require("../models/furniture.model");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
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
const Furniture = require("../models/furniture.model");

// =====================================
// GET ALL FURNITURE
// =====================================

exports.getAllFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.find({
      status: "active",
      isAvailable: true,
    }).populate("seller", "fullName email");

    res.status(200).json({
      success: true,
      count: furniture.length,
      data: furniture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET SINGLE FURNITURE
// =====================================

exports.getFurnitureById = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id).populate(
      "seller",
      "fullName email phone"
    );

    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: "Furniture not found",
      });
    }

    res.status(200).json({
      success: true,
      data: furniture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// SEARCH FURNITURE
// =====================================

exports.searchFurniture = async (req, res) => {
  try {
    const {
      title,
      category,
      city,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    let query = {
      status: "active",
      isAvailable: true,
    };

    if (title) {
      query.title = {
        $regex: title,
        $options: "i",
      };
    }

    if (category) {
      query.category = category;
    }

    if (city) {
      query.city = city;
    }

    if (minPrice || maxPrice) {
      query.pricePerMonth = {};

      if (minPrice)
        query.pricePerMonth.$gte = Number(minPrice);

      if (maxPrice)
        query.pricePerMonth.$lte = Number(maxPrice);
    }

    let furnitureQuery = Furniture.find(query).populate(
      "seller",
      "fullName email"
    );

    // Sorting

    if (sort === "priceLow") {
      furnitureQuery = furnitureQuery.sort({
        pricePerMonth: 1,
      });
    }

    else if (sort === "priceHigh") {
      furnitureQuery = furnitureQuery.sort({
        pricePerMonth: -1,
      });
    }

    else if (sort === "newest") {
      furnitureQuery = furnitureQuery.sort({
        createdAt: -1,
      });
    }

    const furniture = await furnitureQuery;

    res.status(200).json({
      success: true,
      count: furniture.length,
      data: furniture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET MY LISTINGS
exports.getMyFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.find({
      seller: req.user._id,
    }).sort({ createdAt: -1 });

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
// UPDATE FURNITURE
exports.updateFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: "Furniture not found",
      });
    }

    if (furniture.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this furniture",
      });
    }

    const updatedFurniture = await Furniture.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Furniture updated successfully",
      furniture: updatedFurniture,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// UPDATE STATUS
exports.updateFurnitureStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: "Furniture not found",
      });
    }

    if (furniture.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    furniture.status = status;

    await furniture.save();

    res.status(200).json({
      success: true,
      message: "Furniture status updated",
      furniture,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// DELETE FURNITURE (SOFT DELETE)
exports.deleteFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: "Furniture not found",
      });
    }

    if (furniture.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    furniture.status = "removed";

    await furniture.save();

    res.status(200).json({
      success: true,
      message: "Furniture removed successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.uploadFurnitureImages = async (req, res) => {
    try {

        const furniture = await Furniture.findById(req.params.id);

        if (!furniture) {
            return res.status(404).json({
                success: false,
                message: "Furniture not found",
            });
        }

        if (furniture.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image",
            });
        }

        const uploadedImages = [];

        for (const file of req.files) {

            const result = await new Promise((resolve, reject) => {

                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "FurniFlow",
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );

                streamifier.createReadStream(file.buffer).pipe(uploadStream);

            });

            uploadedImages.push({
                url: result.secure_url,
                publicId: result.public_id,
            });

        }

        furniture.images.push(...uploadedImages);

        await furniture.save();

        res.status(200).json({
            success: true,
            message: "Images uploaded successfully",
            images: furniture.images,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};