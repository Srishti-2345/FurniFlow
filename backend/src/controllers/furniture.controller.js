const Furniture = require("../models/Furniture");

// Create Furniture
const createFurniture = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            pricePerMonth,
            deposit,
            quantity,
            condition,
            images,
        } = req.body;

        const furniture = await Furniture.create({
            title,
            description,
            category,
            pricePerMonth,
            deposit,
            quantity,
            condition,
            images,
            seller: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Furniture created successfully",
            data: furniture,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get Logged-in Seller's Furniture
const getMyFurniture = async (req, res) => {
    try {
        const furniture = await Furniture.find({
            seller: req.user._id,
        });

        res.status(200).json({
            success: true,
            count: furniture.length,
            data: furniture,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get Single Furniture
const getFurnitureById = async (req, res) => {
    try {
        const furniture = await Furniture.findById(req.params.id)
            .populate("seller", "fullName email");

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
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Update Furniture
const updateFurniture = async (req, res) => {
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
            data: updatedFurniture,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Delete Furniture
const deleteFurniture = async (req, res) => {
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

        await furniture.deleteOne();

        res.status(200).json({
            success: true,
            message: "Furniture deleted successfully",
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    createFurniture,
    getMyFurniture,
    getFurnitureById,
    updateFurniture,
    deleteFurniture,
}; 