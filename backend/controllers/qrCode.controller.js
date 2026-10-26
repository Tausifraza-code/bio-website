const QRCode = require("../models/QRCode");
const MiniProfile = require("../models/MiniProfile");

const activateQRCodeByCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const activationCode = String(req.body?.activationCode || "")
      .trim()
      .toUpperCase();

    if (!/^BIO-[A-HJ-NP-Z2-9]{8}$/.test(activationCode)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid activation code.",
      });
    }

    const profile = await MiniProfile.findOne({ userId })
      .select("subdomain businessName")
      .lean();

    if (!profile?.subdomain) {
      return res.status(400).json({
        success: false,
        message: "Create and save your public profile first.",
      });
    }

    // Atomic claim: one available QR can be claimed by one user.
    const claimedQR = await QRCode.findOneAndUpdate(
      {
        activationCode,
        status: "available",
        assignedUserId: null,
      },
      {
        $set: {
          assignedUserId: userId,
          status: "assigned",
          assignedAt: new Date(),
          businessName: profile.businessName || null,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("serialNumber activationCode qrPath status assignedAt");

    if (claimedQR) {
      return res.status(200).json({
        success: true,
        message: "Standee activated successfully.",
        data: {
          serialNumber: claimedQR.serialNumber,
          activationCode: claimedQR.activationCode,
          qrPath: claimedQR.qrPath,
          status: claimedQR.status,
          subdomain: profile.subdomain,
          businessName: profile.businessName,
          assignedAt: claimedQR.assignedAt,
        },
      });
    }

    // Explain whether the code is already claimed or unavailable.
    const existingQR = await QRCode.findOne({ activationCode })
      .select(
        "status assignedUserId serialNumber activationCode qrPath assignedAt",
      )
      .lean();

    if (!existingQR) {
      return res.status(404).json({
        success: false,
        message: "Activation code not found.",
      });
    }

    if (existingQR.status === "disabled") {
      return res.status(409).json({
        success: false,
        message: "This QR has been disabled.",
      });
    }

    if (String(existingQR.assignedUserId) === String(userId)) {
      return res.status(200).json({
        success: true,
        message: "This QR is already linked to your account.",
        data: {
          serialNumber: existingQR.serialNumber,
          activationCode: existingQR.activationCode,
          qrPath: existingQR.qrPath,
          status: existingQR.status,
          subdomain: profile.subdomain,
          businessName: profile.businessName,
          assignedAt: existingQR.assignedAt,
        },
      });
    }

    return res.status(409).json({
      success: false,
      message: "This QR is already assigned or unavailable.",
    });
  } catch (error) {
    console.error("Activate QR by code error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to activate standee.",
    });
  }
};

const normalizeQRPath = (value) => {
  if (typeof value !== "string") return null;

  const path = value.trim();

  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("?") ||
    path.includes("#") ||
    path.includes("\\") ||
    path.length > 200
  ) {
    return null;
  }

  const isLegacyPath = /^\/[a-zA-Z0-9_-]+$/.test(path);
  const isGeneratedPath = /^\/q\/[a-f0-9]{32}$/.test(path);

  return isLegacyPath || isGeneratedPath ? path : null;
};

// Bind an existing physical QR path to the logged-in owner's profile.
const bindQRCodeToProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const qrPath = normalizeQRPath(req.body?.qrPath);

    if (!qrPath) {
      return res.status(400).json({
        success: false,
        message: "A valid QR path is required.",
      });
    }

    const profile = await MiniProfile.findOne({ userId })
      .select("subdomain businessName")
      .lean();

    if (!profile?.subdomain) {
      return res.status(400).json({
        success: false,
        message: "Create and save your public profile first.",
      });
    }

    const existingQR = await QRCode.findOne({ qrPath })
      .select("serialNumber qrPath status assignedUserId assignedAt")
      .lean();

    // Unknown paths must never create inventory records.
    if (!existingQR) {
      return res.status(404).json({
        success: false,
        message: "QR code not found in admin inventory.",
      });
    }

    if (existingQR.status === "disabled") {
      return res.status(409).json({
        success: false,
        message: "This QR has been disabled.",
      });
    }

    // Make repeated requests from the same account idempotent.
    if (existingQR.assignedUserId) {
      if (String(existingQR.assignedUserId) !== String(userId)) {
        return res.status(409).json({
          success: false,
          message: "This QR is already linked to another account.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "This QR is already linked to your account.",
        data: {
          qrPath: existingQR.qrPath,
          serialNumber: existingQR.serialNumber,
          subdomain: profile.subdomain,
          businessName: profile.businessName,
          assignedAt: existingQR.assignedAt,
        },
      });
    }

    // Atomic claim: only one request can claim an available QR.
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
          businessName: profile.businessName || null,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("serialNumber qrPath status assignedAt");

    if (!claimedQR) {
      return res.status(409).json({
        success: false,
        message: "This QR was just assigned or is no longer available.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "QR linked to your profile successfully.",
      data: {
        qrPath: claimedQR.qrPath,
        serialNumber: claimedQR.serialNumber,
        subdomain: profile.subdomain,
        businessName: profile.businessName,
        assignedAt: claimedQR.assignedAt,
      },
    });
  } catch (error) {
    console.error("Bind QR error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "QR assignment conflict. Please check its current status.",
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
    const qrPath = normalizeQRPath(
      req.path.startsWith("/q/")
        ? `/q/${req.params.qrPath}`
        : `/${req.params.qrPath}`,
    );

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
    })
      .select("serialNumber activationCode qrPath status assignedAt")
      .sort({ assignedAt: -1 });

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
        activationCode: qrCode.activationCode,
        subdomain: profile.subdomain,
        businessName: profile.businessName,
        status: qrCode.status,
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
  activateQRCodeByCode,
  resolveQRCode,
  getMyBoundQRCode,
};
