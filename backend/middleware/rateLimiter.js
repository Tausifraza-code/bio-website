const rateLimit = require("express-rate-limit");

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// Login and registration rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  skip: () => process.env.NODE_ENV === "development",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many login or registration attempts. Please try again after 15 minutes.",
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
};
