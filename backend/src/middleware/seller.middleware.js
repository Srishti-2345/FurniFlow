const sellerOnly = (req, res, next) => {
    try {
        if (req.user.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Seller only."
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = sellerOnly;