const crypto = require("crypto");
const QRCode = require("../models/QRCode");

const MAX_BATCH_SIZE = 1000;

// Generate multiple QR sets in one database operation
const generateQRBatch = async (req, res) => {
  try {
    const requestedCount = Number(req.body?.count);

    if (
      !Number.isSafeInteger(requestedCount) ||
      requestedCount < 1 ||
      requestedCount > MAX_BATCH_SIZE
    ) {
      return res.status(400).json({
        success: false,
        message: `Count must be an integer between 1 and ${MAX_BATCH_SIZE}.`,
      });
    }

    const adminId = req.user._id;
    const timestamp = Date.now();

    const records = Array.from({ length: requestedCount }, (_, index) => {
      const uniqueId = crypto.randomBytes(12).toString("hex").toUpperCase();
      const qrPath = QRCode.generateQRPath();

      return {
        serialNumber: `BIO-${timestamp}-${index + 1}-${uniqueId}`,
        qrPath,
        qrUrl: null,
        formats: ["standee", "pocket", "keychain"],
        assignedUserId: null,
        generatedBy: adminId,
        assignedBy: null,
        businessName: null,
        status: "available",
        generatedAt: new Date(),
        assignedAt: null,
      };
    });

    const createdRecords = await QRCode.insertMany(records, {
      ordered: false,
    });

    return res.status(201).json({
      success: true,
      message: `${createdRecords.length} QR sets generated successfully.`,
      data: {
        count: createdRecords.length,
        formats: ["standee", "pocket", "keychain"],
        sets: createdRecords.map((item) => ({
          id: item._id,
          serialNumber: item.serialNumber,
          qrPath: item.qrPath,
          status: item.status,
        })),
      },
    });
  } catch (error) {
    console.error("Generate QR batch error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A duplicate QR identifier was detected. Check database indexes and retry with a new request.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to generate QR sets.",
    });
  }
};

const getQRInventory = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 20),
    );

    const filter = {};
    const allowedStatuses = ["available", "assigned", "disabled"];

    if (req.query.status) {
      if (!allowedStatuses.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter.",
        });
      }

      filter.status = req.query.status;
    }

    if (req.query.search) {
      const search = String(req.query.search).trim().slice(0, 80);

      if (search) {
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        filter.$or = [
          { serialNumber: { $regex: escapedSearch, $options: "i" } },
          { businessName: { $regex: escapedSearch, $options: "i" } },
        ];
      }
    }

    const skip = (page - 1) * limit;

    const [sets, total] = await Promise.all([
      QRCode.find(filter)
        .select(
          "serialNumber qrPath formats businessName assignedUserId status generatedAt assignedAt generatedBy assignedBy",
        )
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      QRCode.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        sets,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get QR inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch QR inventory.",
    });
  }
};

module.exports = {
  generateQRBatch,
  getQRInventory,
};
