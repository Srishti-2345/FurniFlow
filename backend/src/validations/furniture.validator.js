const { body, validationResult } = require("express-validator");

exports.validateFurniture = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

  body("pricePerMonth")
    .isFloat({ min: 1 })
    .withMessage("Price must be greater than 0"),

  body("securityDeposit")
    .isFloat({ min: 0 })
    .withMessage("Security deposit cannot be negative"),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("condition")
    .isIn(["new", "like_new", "used"])
    .withMessage("Invalid condition"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("pickupAddress")
    .trim()
    .notEmpty()
    .withMessage("Pickup address is required"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];