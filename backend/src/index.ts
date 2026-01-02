import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Middleware
import { apiLimiter } from "./middleware/rateLimit.middleware";

// Routes
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import reviewRoutes from "./routes/review.routes";
import bidRoutes from "./routes/bid.routes";
import socialRoutes from "./routes/social.routes";
import chatRoutes from "./routes/chat.routes";
import notificationRoutes from "./routes/notification.routes";
import adminRoutes from "./routes/admin.routes";

// Jobs
import { startAuctionJob } from "./jobs/auctionCloser";

dotenv.config();

// Security Checks
const requiredEnv = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(
    `ERROR: Missing environment variables: ${missingEnv.join(", ")}`
  );
  process.exit(1);
}
console.log("All required environment variables are set.");

// App Setup
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Global Rate Limit
app.use("/api/", apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Background Jobs
startAuctionJob();

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
