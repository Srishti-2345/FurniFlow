const express=require("express");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const morgan=require("morgan");
const app=express();
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const furnitureRoutes = require("./routes/furniture.routes");
const sellerRoutes = require("./routes/seller.routes");
const bookingRoutes = require("./routes/booking.routes");
const chatRoutes = require("./routes/chat.routes");
const reviewRoutes = require("./routes/review.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));
app.use(cookieParser());
app.use(morgan("dev"));
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "FurniFlow API Running 🚀",
    });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/furniture", furnitureRoutes);
app.use("/api/v1/seller", sellerRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
module.exports = app;