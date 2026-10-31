const mongoose = require("mongoose");

const miniProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    businessName: { type: String, trim: true, default: "" },
    industry: { type: String, default: "" },
    subdomain: { type: String, trim: true, lowercase: true, default: "" },
    jobTitle: { type: String, default: "" },
    headline: { type: String, default: "" },
    bio: { type: String, default: "" },

    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    email: { type: String, lowercase: true, trim: true, default: "" },
    website: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },

    shopUnit: { type: String, default: "" },
    area: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    landmark: { type: String, default: "" },
    mapLink: { type: String, default: "" },
    businessHours: { type: String, default: "" },
    upiId: { type: String, default: "" },

    socialCards: {
      type: [
        {
          platform: {
            type: String,

            required: true,
            trim: true,
          },

          // NEW: Platform ka display name
          platformName: {
            type: String,
            trim: true,
            default: "",
          },

          // NEW: Icon identifier
          icon: {
            type: String,
            trim: true,
            default: "link",
          },

          handle: { type: String, trim: true, default: "" },
          audience: { type: String, trim: true, default: "" },
          url: { type: String, trim: true, default: "" },
          description: { type: String, trim: true, default: "" },
          profileImage: {
            type: String,
            trim: true,
            default: "",
          },
          thumbnail: { type: String, default: "my-photo" },
          ctaLabel: { type: String, trim: true, default: "Follow" },
          verifiedTick: { type: Boolean, default: true },
        },
      ],
      default: [],
    },

    profileImage: {
      type: String,
      trim: true,
      default: "",
    },
    contactButtons: {
      type: [
        {
          buttonId: {
            type: String,
            required: true,
            trim: true,
          },
          label: {
            type: String,
            required: true,
            trim: true,
          },
          icon: {
            type: String,
            default: "link",
            trim: true,
          },
          actionType: {
            type: String,
            required: true,
            enum: [
              "call",
              "whatsapp",
              "email",
              "directions",
              "share",
              "website",
              "saveContact",
              "upi",
              "customLink",
            ],
          },
          enabled: {
            type: Boolean,
            default: true,
          },
          order: {
            type: Number,
            default: 0,
          },
          customUrl: {
            type: String,
            trim: true,
            default: "",
          },
        },
      ],
      default: [],
    },

    avatar: { type: String, default: null },
    logo: { type: String, default: null },
    banner: { type: String, default: null },
    qrCode: { type: String, default: null },

    activeTheme: {
      type: String,
      enum: ["executive", "emerald", "rose", "obsidian", "sunset"],
      default: "sunset",
    },

    activeLayout: {
      type: String,
      enum: [
        "modern-business",
        "minimal-card",
        "creator-portfolio",
        "corporate-executive",
        "storefront",
        "freelancer-pro",
        "elegant-profile",
        "agency-pro",
        "digital-card",
        "service-pro",
      ],
      default: "modern-business",
    },

    leadCapture: {
      enabled: {
        type: Boolean,
        default: false,
      },
    },
    selectedPlan: { type: String, default: "1year" },

    isActivated: { type: Boolean, default: false },
    activatedAt: { type: Date, default: null },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MiniProfile", miniProfileSchema);
