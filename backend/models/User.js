const mongoose = require("mongoose");

// Structured schema for the user's mini website profile
const miniProfileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    businessName: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },
    industry: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    subdomain: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 100,
      default: "",
    },
    jobTitle: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    headline: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    // Business contact details
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: "",
    },
    whatsapp: {
      type: String,
      trim: true,
      maxlength: 30,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: "",
    },
    websiteUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: "",
    },

    // Business address
    shopUnit: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    area: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    state: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    pincode: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "",
    },
    landmark: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    mapLink: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: "",
    },

    // Business settings
    businessHours: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },
    upiId: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },
    activeTheme: {
      type: String,
      enum: ["executive", "emerald", "rose", "obsidian", "sunset"],
      default: "sunset",
    },
    selectedPlan: {
      type: String,
      enum: ["1year", "3years"],
      default: "1year",
    },

    // ImageBB-hosted image URLs will be stored here
    avatar: {
      type: String,
      default: null,
      maxlength: 2048,
    },
    logo: {
      type: String,
      default: null,
      maxlength: 2048,
    },
    banner: {
      type: String,
      default: null,
      maxlength: 2048,
    },
    qrCode: {
      type: String,
      default: null,
      maxlength: 2048,
    },
  },
  { _id: false, timestamps: true },
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },

    resetPasswordToken: {
      type: String,
      default: undefined,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      default: undefined,
      select: false,
    },

    referralCode: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },

    miniProfile: {
      type: miniProfileSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
