const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    pricePerMonth: {
      type: Number,
      required: true,
      min: 0,
    },

    securityDeposit: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    condition: {
      type: String,
      enum: ["new", "like_new", "used"],
      default: "used",
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },

    dimensions: {
      length: {
        type: Number,
        min: 0,
      },
      width: {
        type: Number,
        min: 0,
      },
      height: {
        type: Number,
        min: 0,
      },
    },

    images: [
      {
        url: {
          type: String,
          default: "",
        },
        publicId: {
          type: String,
          default: "",
        },
      },
    ],

    status: {
    type: String,
    enum: ["active", "inactive", "removed"],
    default: "active",
},
  },
  {
    timestamps: true,
  }
);
furnitureSchema.index({ city: 1 });
furnitureSchema.index({ category: 1 });
furnitureSchema.index({ seller: 1 });
module.exports = mongoose.model("Furniture", furnitureSchema);