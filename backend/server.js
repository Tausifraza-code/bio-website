require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const profileRoutes = require("./routes/profile.routes");
const contactButtonsRoutes = require("./routes/contactButtons.routes");
const productRoutes = require("./routes/product.route");
const galleryRoutes = require("./routes/gallery.route");

const connectDB = require("./config/db");

const app = express();

// ======================================================
// PORT
// ======================================================

const PORT = process.env.PORT || 5000;

// ======================================================
// PATHS
// ======================================================

const clientBuildPath = path.join(__dirname, "../client/dist");
const indexFilePath = path.join(clientBuildPath, "index.html");

// ======================================================
// CORS
// ======================================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",

      // Live frontend domain deploy karne par add karna:
      // "https://yourdomain.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// API ROUTES
// ======================================================

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/contact-buttons", contactButtonsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/gallery", galleryRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BIO Website Backend is running",
  });
});

// ======================================================
// STATIC FRONTEND FILES
// ======================================================

app.use(express.static(clientBuildPath));

// ======================================================
// REACT ROUTER FALLBACK — EXPRESS 5
// ======================================================

app.get("/{*splat}", (req, res, next) => {
  // Unknown API URLs ko React HTML return nahi karna
  if (req.path === "/api" || req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "API route not found",
    });
  }

  res.sendFile(indexFilePath, (error) => {
    if (error) {
      next(error);
    }
  });
});

// ======================================================
// ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.status === 400 ? "Invalid request" : "Internal server error",
  });
});

// ======================================================
// START SERVER
// ======================================================

const startServer = async () => {
  try {
    console.log("========================================");
    console.log("Starting BIO Website Backend...");
    console.log("Connecting to MongoDB...");
    console.log("========================================");

    await connectDB();

    console.log("MongoDB connection ready.");

    app.listen(PORT, () => {
      console.log("========================================");
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Frontend build path: ${clientBuildPath}`);
      console.log("MongoDB: Connected");
      console.log("========================================");
    });
  } catch (error) {
    console.error("SERVER STARTUP FAILED:", error);
    process.exit(1);
  }
};

startServer();
