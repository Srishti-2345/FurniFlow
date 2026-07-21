const { body, validationResult } = require("express-validator");

exports.validateBooking = [

  body("furnitureId")
    .notEmpty()
    .withMessage("Furniture is required"),

  body("rentalMonths")
    .isInt({ min: 1 })
    .withMessage("Rental months must be at least 1"),

  body("deliveryAddress")
    .trim()
    .notEmpty()
    .withMessage("Delivery address is required"),

  body("startDate")
    .isISO8601()
    .withMessage("Invalid start date"),

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