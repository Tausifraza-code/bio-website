const QRCode = require("../models/QRCode");
const MiniProfile = require("../models/MiniProfile");

const validateSlotNumber = (value) => {
  const slot = Number(value);
  return [1, 2, 3].includes(slot) ? slot : null;
};

const getProfileForUser = async (userId) => {
  const profile = await MiniProfile.findOne({ userId })
    .select("subdomain businessName leadCapture")
    .lean();

  return profile?.subdomain ? profile : null;
};

const formatBoundQR = (qr, profile) => ({
  _id: qr._id,
  serialNumber: qr.serialNumber,
  activationCode: qr.activationCode,
  qrPath: qr.qrPath,
  format: qr.format || null,
  assignedSlot: qr.assignedSlot,
  status: qr.status,
  subdomain: profile.subdomain,
  businessName: profile.businessName,
  assignedAt: qr.assignedAt,
});

// Activate a physical QR using its activation code.
const activateQRCodeByCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const activationCode = String(req.body?.activationCode || "")
      .trim()
      .toUpperCase();
    const slotNumber = validateSlotNumber(req.body?.slotNumber);

    if (!slotNumber) {
      return res.status(400).json({
        success: false,
        message: "Select a valid physical QR slot (1, 2 or 3).",
      });
    }

    if (!/^BIO-[A-HJ-NP-Z2-9]{8}$/.test(activationCode)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid activation code.",
      });
    }

    const profile = await getProfileForUser(userId);

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "Create and save your public profile first.",
      });
    }

    const existingSlot = await QRCode.findOne({
      assignedUserId: userId,
      assignedSlot: slotNumber,
      status: "assigned",
    }).lean();

    if (existingSlot) {
      return res.status(409).json({
        success: false,
        message: `Physical QR Code ${slotNumber} is already occupied.`,
      });
    }

    const existingQR = await QRCode.findOne({ activationCode })
      .select("assignedUserId assignedSlot status")
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

    if (existingQR.assignedUserId) {
      if (String(existingQR.assignedUserId) !== String(userId)) {
        return res.status(409).json({
          success: false,
          message: "This QR is already assigned to another account.",
        });
      }

      if (existingQR.assignedSlot === slotNumber) {
        const sameQR = await QRCode.findOne({ activationCode });
        return res.status(200).json({
          success: true,
          message: "This QR is already linked to your account.",
          data: formatBoundQR(sameQR, profile),
        });
      }

      if (existingQR.assignedSlot != null) {
        return res.status(409).json({
          success: false,
          message: "This QR is already linked to another slot.",
        });
      }

      // Migrate an older QR already assigned to this user.
      const migratedQR = await QRCode.findOneAndUpdate(
        {
          activationCode,
          assignedUserId: userId,
          assignedSlot: null,
          status: "assigned",
        },
        { $set: { assignedSlot: slotNumber } },
        { new: true, runValidators: true },
      );

      if (!migratedQR) {
        return res.status(409).json({
          success: false,
          message: "QR assignment changed. Please try again.",
        });
      }

      return res.status(200).json({
        success: true,
        message: `Physical QR Code ${slotNumber} linked successfully.`,
        data: formatBoundQR(migratedQR, profile),
      });
    }

    const claimedQR = await QRCode.findOneAndUpdate(
      {
        activationCode,
        status: "available",
        assignedUserId: null,
      },
      {
        $set: {
          assignedUserId: userId,
          assignedSlot: slotNumber,
          status: "assigned",
          assignedAt: new Date(),
          businessName: profile.businessName || null,
        },
      },
      { new: true, runValidators: true },
    );

    if (!claimedQR) {
      return res.status(409).json({
        success: false,
        message: "This QR was just assigned or is no longer available.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Physical QR Code ${slotNumber} linked successfully.`,
      data: formatBoundQR(claimedQR, profile),
    });
  } catch (error) {
    console.error("Activate QR by code error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This physical QR slot is already occupied.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to activate physical QR.",
    });
  }
};

// Validate existing QR paths.
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

// Bind an existing physical QR by scanning its URL.
const bindQRCodeToProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const qrPath = normalizeQRPath(req.body?.qrPath);
    const slotNumber = validateSlotNumber(req.body?.slotNumber);

    if (!slotNumber) {
      return res.status(400).json({
        success: false,
        message: "Select a valid physical QR slot (1, 2 or 3).",
      });
    }

    if (!qrPath) {
      return res.status(400).json({
        success: false,
        message: "A valid QR path is required.",
      });
    }

    const profile = await getProfileForUser(userId);

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "Create and save your public profile first.",
      });
    }

    const existingSlot = await QRCode.findOne({
      assignedUserId: userId,
      assignedSlot: slotNumber,
      status: "assigned",
    }).lean();

    if (existingSlot) {
      return res.status(409).json({
        success: false,
        message: `Physical QR Code ${slotNumber} is already occupied.`,
      });
    }

    const existingQR = await QRCode.findOne({ qrPath })
      .select(
        "serialNumber qrPath format status assignedUserId assignedSlot assignedAt",
      )
      .lean();

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

    if (existingQR.assignedUserId) {
      if (String(existingQR.assignedUserId) !== String(userId)) {
        return res.status(409).json({
          success: false,
          message: "This QR is already linked to another account.",
        });
      }

      if (existingQR.assignedSlot === slotNumber) {
        return res.status(200).json({
          success: true,
          message: "This QR is already linked to your account.",
          data: formatBoundQR(existingQR, profile),
        });
      }

      if (existingQR.assignedSlot != null) {
        return res.status(409).json({
          success: false,
          message: "This QR is already linked to another slot.",
        });
      }

      // Migrate an older QR already assigned to this user.
      const migratedQR = await QRCode.findOneAndUpdate(
        {
          _id: existingQR._id,
          assignedUserId: userId,
          assignedSlot: null,
          status: "assigned",
        },
        { $set: { assignedSlot: slotNumber } },
        { new: true, runValidators: true },
      );

      if (!migratedQR) {
        return res.status(409).json({
          success: false,
          message: "QR assignment changed. Please try again.",
        });
      }

      return res.status(200).json({
        success: true,
        message: `Physical QR Code ${slotNumber} linked successfully.`,
        data: formatBoundQR(migratedQR, profile),
      });
    }

    const claimedQR = await QRCode.findOneAndUpdate(
      {
        _id: existingQR._id,
        status: "available",
        assignedUserId: null,
      },
      {
        $set: {
          assignedUserId: userId,
          assignedSlot: slotNumber,
          status: "assigned",
          assignedAt: new Date(),
          businessName: profile.businessName || null,
        },
      },
      { new: true, runValidators: true },
    );

    if (!claimedQR) {
      return res.status(409).json({
        success: false,
        message: "This QR was just assigned or is no longer available.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Physical QR Code ${slotNumber} linked successfully.`,
      data: formatBoundQR(claimedQR, profile),
    });
  } catch (error) {
    console.error("Bind QR error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This physical QR slot is already occupied.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to link QR to profile.",
    });
  }
};

// Resolve a physical QR and check its status before redirecting.
const resolveQRCode = async (req, res, next) => {
  try {
    const qrPath = normalizeQRPath(
      req.path.startsWith("/q/")
        ? `/q/${req.params.qrPath}`
        : `/${req.params.qrPath}`,
    );

    if (!qrPath) return next();

    // Find QR regardless of its current status.
    const qrCode = await QRCode.findOne({ qrPath }).select(
      "assignedUserId status",
    );

    if (!qrCode) return next();

    // Show a clear message when Admin has deactivated this QR.
    if (qrCode.status === "disabled") {
      return res.status(410).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>QR Code Deactivated</title>
            <style>
              body {
                margin: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #0b1b30;
                color: white;
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
                box-sizing: border-box;
              }
              .card {
                max-width: 420px;
                padding: 40px 28px;
                border: 1px solid #29435f;
                border-radius: 20px;
                background: #10243b;
              }
              h1 { color: #fb7185; font-size: 25px; }
              p { color: #94a3b8; line-height: 1.7; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>QR Code Deactivated</h1>
              <p>
                This physical QR code has been deactivated by the
                administrator. Please contact the business owner
                for assistance.
              </p>
            </div>
          </body>
        </html>
      `);
    }

    // Only assigned QR codes can redirect customers.
    if (qrCode.status !== "assigned" || !qrCode.assignedUserId) {
      return next();
    }

    const profile = await MiniProfile.findOne({
      userId: qrCode.assignedUserId,
    }).select("subdomain");

    if (!profile?.subdomain) {
      return res.status(404).send("The linked public profile was not found.");
    }

    const frontendBaseUrl = process.env.PUBLIC_PROFILE_BASE_URL;

    if (!frontendBaseUrl) {
      return res.status(500).send("Public profile URL is not configured.");
    }

    const destination =
      `${frontendBaseUrl.replace(/\/+$/, "")}/card-preview/` +
      encodeURIComponent(profile.subdomain) +
      (profile.leadCapture?.enabled ? "?source=qr" : "");

    return res.redirect(302, destination);
  } catch (error) {
    console.error("Resolve QR error:", error);
    return res.status(500).send("Unable to open the linked profile.");
  }
};

// Return all three physical QR slots.
const getMyBoundQRCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await getProfileForUser(userId);

    if (!profile) {
      return res.status(200).json({
        success: true,
        message: "No saved public profile found.",
        data: {
          slots: { 1: null, 2: null, 3: null },
          qrCodes: [],
        },
      });
    }

    const qrCodes = await QRCode.find({
      assignedUserId: userId,
      status: "assigned",
      assignedSlot: { $in: [1, 2, 3] },
    })
      .select(
        "serialNumber activationCode qrPath format assignedSlot status assignedAt",
      )
      .sort({ assignedSlot: 1 })
      .lean();

    const slots = {
      1: null,
      2: null,
      3: null,
    };

    qrCodes.forEach((qr) => {
      slots[qr.assignedSlot] = formatBoundQR(qr, profile);
    });

    return res.status(200).json({
      success: true,
      message: "Physical QR slots fetched successfully.",
      data: {
        slots,
        qrCodes,
      },
    });
  } catch (error) {
    console.error("Get bound QR error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your physical QR slots.",
    });
  }
};

// ADMIN: Deactivate QR Code
const deactivateQRCode = async (req, res) => {
  try {
    const { id } = req.params;

    const qrCode = await QRCode.findById(id);

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: "QR Code not found.",
      });
    }

    qrCode.status = "disabled";
    await qrCode.save();

    return res.status(200).json({
      success: true,
      message: "QR Code deactivated successfully.",
      data: {
        id: qrCode._id,
        serialNumber: qrCode.serialNumber,
        status: qrCode.status,
      },
    });
  } catch (error) {
    console.error("Deactivate QR Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate QR Code.",
    });
  }
};

// ADMIN: Activate QR Code
const activateQRCode = async (req, res) => {
  try {
    const { id } = req.params;

    const qrCode = await QRCode.findById(id);

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: "QR Code not found.",
      });
    }

    // Preserve existing user assignment
    qrCode.status = qrCode.assignedUserId ? "assigned" : "available";

    await qrCode.save();

    return res.status(200).json({
      success: true,
      message: "QR Code activated successfully.",
      data: {
        id: qrCode._id,
        serialNumber: qrCode.serialNumber,
        status: qrCode.status,
      },
    });
  } catch (error) {
    console.error("Activate QR Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to activate QR Code.",
    });
  }
};

// ADMIN: Get All Physical QR Codes
const getAdminQRCodes = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, format, search } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const filter = {};

    // Filter by status
    if (["available", "assigned", "disabled"].includes(status)) {
      filter.status = status;
    }

    // Filter by QR format
    if (["standee", "pocket", "keychain"].includes(format)) {
      filter.$or = [{ format }, { formats: format }];
    }

    // Search by serial number, activation code or business name
    if (search && search.trim()) {
      const searchRegex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );

      const searchConditions = [
        { serialNumber: searchRegex },
        { activationCode: searchRegex },
        { businessName: searchRegex },
      ];

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [qrCodes, total, statistics] = await Promise.all([
      QRCode.find(filter)
        .populate("assignedUserId", "fullName email")
        .populate("generatedBy", "fullName email")
        .populate("assignedBy", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      QRCode.countDocuments(filter),

      QRCode.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const stats = {
      total: 0,
      available: 0,
      assigned: 0,
      disabled: 0,
    };

    statistics.forEach((item) => {
      stats[item._id] = item.count;
      stats.total += item.count;
    });

    return res.status(200).json({
      success: true,
      data: {
        statistics: stats,
        qrCodes,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
      },
    });
  } catch (error) {
    console.error("Get Admin QR Codes Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch QR Codes.",
    });
  }
};

module.exports = {
  bindQRCodeToProfile,
  activateQRCodeByCode,
  resolveQRCode,
  getMyBoundQRCode,
  deactivateQRCode,
  activateQRCode,
  getAdminQRCodes,
};
