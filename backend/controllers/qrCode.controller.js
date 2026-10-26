const crypto = require("crypto");
const QRCode = require("../models/QRCode");
const MiniProfile = require("../models/MiniProfile");

// Validate the existing path encoded in the physical QR.
// Example: /xyz
const normalizeQRPath = (value) => {
  if (typeof value !== "string") return null;

  const path = value.trim();

  // This implementation supports a single path segment.
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("?") ||
    path.includes("#") ||
    path.includes("\\") ||
    path.length > 200 ||
    path.split("/").length !== 2 ||
    path === "/"
  ) {
    return null;
  }

  if (!/^\/[a-zA-Z0-9_-]+$/.test(path)) {
    return null;
  }

  return path;
};

// Bind an existing physical QR path to the logged-in owner's profile.
const bindQRCodeToProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const qrPath = normalizeQRPath(req.body.qrPath);

    if (!qrPath) {
      return res.status(400).json({
        success: false,
        message: "A valid existing QR path is required, e.g. /xyz.",
      });
    }

    const profile = await MiniProfile.findOne({ userId }).select(
      "userId subdomain  businessName",
    );

    if (!profile || !profile.subdomain) {
      return res.status(400).json({
        success: false,
        message: "Create and save your public profile first.",
      });
    }

    const existingQR = await QRCode.findOne({ qrPath });

    if (existingQR) {
      if (existingQR.status === "disabled") {
        return res.status(409).json({
          success: false,
          message: "This QR has been disabled.",
        });
      }

      if (existingQR.assignedUserId) {
        if (String(existingQR.assignedUserId) === String(userId)) {
          return res.status(200).json({
            success: true,
            message: "This QR is already linked to your account.",
            data: {
              qrPath: existingQR.qrPath,
              subdomain: profile.subdomain,
              businessName: profile.businessName,
            },
          });
        }

        return res.status(409).json({
          success: false,
          message: "This QR is already linked to another account.",
        });
      }

      // Atomically claim an available, unassigned QR.
      const claimedQR = await QRCode.findOneAndUpdate(
        {
          _id: existingQR._id,
          status: "available",
          assignedUserId: null,
        },
        {
          $set: {
            assignedUserId: userId,
            status: "assigned",
            assignedAt: new Date(),
          },
        },
        { new: true, runValidators: true },
      );

      if (!claimedQR) {
        return res.status(409).json({
          success: false,
          message: "This QR was just assigned. Please try again.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "QR linked to your profile successfully.",
        data: {
          qrPath: claimedQR.qrPath,
          subdomain: profile.subdomain,
          businessName: profile.businessName,
        },
      });
    }

    // Register the supplied existing path; never generate a new QR path.
    const qrCode = await QRCode.create({
      serialNumber: `QR-${crypto.randomUUID()}`,
      qrPath,
      assignedUserId: userId,
      status: "assigned",
      assignedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Existing QR path registered and linked successfully.",
      data: {
        qrPath: qrCode.qrPath,
        subdomain: profile.subdomain,
        businessName: profile.businessName,
      },
    });
  } catch (error) {
    console.error("Bind QR error:", error);
    if (error.code === 11000) {
      console.error("QR duplicate key details:", {
        keyPattern: error.keyPattern,
        keyValue: error.keyValue,
        message: error.message,
      });

      return res.status(409).json({
        success: false,
        message: "Duplicate QR field detected.",
        details: {
          field: Object.keys(error.keyPattern || {}),
          value: error.keyValue || {},
        },
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to link QR to profile.",
    });
  }
};

// Resolve a scanned path such as /xyz and redirect to its owner's profile.
const resolveQRCode = async (req, res, next) => {
  try {
    const qrPath = normalizeQRPath(`/${req.params.qrPath}`);

    if (!qrPath) return next();

    const qrCode = await QRCode.findOne({
      qrPath,
      status: "assigned",
      assignedUserId: { $ne: null },
    }).select("assignedUserId");

    // Not a registered QR: allow the normal React fallback to handle it.
    if (!qrCode) return next();

    const profile = await MiniProfile.findOne({
      userId: qrCode.assignedUserId,
    }).select("subdomain");

    if (!profile || !profile.subdomain) {
      return res.status(404).send("The linked public profile was not found.");
    }

    const frontendBaseUrl = process.env.PUBLIC_PROFILE_BASE_URL;

    if (!frontendBaseUrl) {
      return res.status(500).send("Public profile URL is not configured.");
    }

    // Adjust this route if your React app uses a different profile URL.

    const destination =
      `${frontendBaseUrl.replace(/\/+$/, "")}/card-preview/` +
      encodeURIComponent(profile.subdomain);

    return res.redirect(302, destination);
  } catch (error) {
    console.error("Resolve QR error:", error);
    return res.status(500).send("Unable to open the linked profile.");
  }
};

// Get the logged-in user's bound QR and public profile.
const getMyBoundQRCode = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await MiniProfile.findOne({ userId }).select(
      "subdomain businessName",
    );

    if (!profile || !profile.subdomain) {
      return res.status(200).json({
        success: true,
        message: "No saved public profile found.",
        data: null,
      });
    }

    const qrCode = await QRCode.findOne({
      assignedUserId: userId,
      status: "assigned",
      qrPath: { $exists: true, $ne: null },
    }).sort({ assignedAt: -1 });

    if (!qrCode) {
      return res.status(200).json({
        success: true,
        message: "No QR is linked to your account yet.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bound QR fetched successfully.",
      data: {
        qrPath: qrCode.qrPath,
        serialNumber: qrCode.serialNumber,
        subdomain: profile.subdomain,
        businessName: profile.businessName,
        assignedAt: qrCode.assignedAt,
      },
    });
  } catch (error) {
    console.error("Get bound QR error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your bound QR.",
    });
  }
};
module.exports = {
  bindQRCodeToProfile,
  resolveQRCode,
  getMyBoundQRCode,
};
