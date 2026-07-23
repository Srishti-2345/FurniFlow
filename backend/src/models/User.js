const mongoose =require("mongoose");
const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["customer", "seller"],
      default: "customer",
    },

    profileImage: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    averageRating: {
    type: Number,
    default: 0,
},

totalReviews: {
    type: Number,
    default: 0,
},
  },
  {
    timestamps: true,

});
module.exports=mongoose.model("User", userSchema);