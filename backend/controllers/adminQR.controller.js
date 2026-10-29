const crypto = require("crypto");
const QRCode = require("../models/QRCode");
const { once } = require("events");
const mongoose = require("mongoose");

const MAX_BATCH_SIZE = 1000;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const generateActivationCode = () => {
  let code = "";

  for (let i = 0; i < 8; i++) {
    code += ALPHABET[crypto.randomInt(ALPHABET.length)];
  }

  return `BIO-${code}`;
};

const isActivationCodeDuplicate = (writeError) => {
  const keyPattern =
    writeError.err?.keyPattern ||
    writeError.keyPattern ||
    writeError.errInfo?.keyPattern;

  if (keyPattern) {
    return (
      Object.keys(keyPattern).length === 1 &&
      Object.hasOwn(keyPattern, "activationCode")
    );
  }

  const message =
    writeError.err?.message || writeError.errmsg || writeError.message || "";

  return /activationCode_1/.test(message);
};

const insertRecordsWithActivationCodeRetry = async (records) => {
  const createdRecords = [];
  let pendingRecords = records;
  const usedCodes = new Set(records.map((record) => record.activationCode));
  const maxAttempts = 3;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const insertedRecords = await QRCode.insertMany(pendingRecords, {
        ordered: false,
      });
      createdRecords.push(...insertedRecords);
      return createdRecords;
    } catch (error) {
      const writeErrors = error.writeErrors || [];

      if (
        !writeErrors.length ||
        !writeErrors.every(
          (writeError) =>
            writeError.code === 11000 && isActivationCodeDuplicate(writeError),
        )
      ) {
        throw error;
      }

      const retryIndexes = writeErrors.map(({ index }) => index);
      if (
        retryIndexes.some(
          (index) =>
            !Number.isInteger(index) ||
            index < 0 ||
            index >= pendingRecords.length,
        )
      ) {
        throw error;
      }

      createdRecords.push(...(error.insertedDocs || []));
      pendingRecords = retryIndexes.map((index) => pendingRecords[index]);

      if (attempt === maxAttempts - 1) throw error;

      pendingRecords.forEach((record) => {
        let activationCode;
        do {
          activationCode = generateActivationCode();
        } while (usedCodes.has(activationCode));

        usedCodes.add(activationCode);
        record.activationCode = activationCode;
      });
    }
  }

  return createdRecords;
};

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
        activationCode: generateActivationCode(),
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

    const createdRecords = await insertRecordsWithActivationCodeRetry(records);

    return res.status(201).json({
      success: true,
      message: `${createdRecords.length} QR sets generated successfully.`,
      data: {
        count: createdRecords.length,
        formats: ["standee", "pocket", "keychain"],
        sets: createdRecords.map((item) => ({
          id: item._id,
          serialNumber: item.serialNumber,
          activationCode: item.activationCode,
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
    const includeAssignedUser = req.query.includeAssignedUser === "true";
    const inventoryQuery = QRCode.find(filter)
      .select(
        "serialNumber activationCode qrPath qrUrl formats businessName assignedUserId status generatedAt assignedAt generatedBy assignedBy   downloadHistory",
      )
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit);

    if (includeAssignedUser) {
      inventoryQuery.populate("assignedUserId", "fullName email");
    }

    const [sets, total] = await Promise.all([
      inventoryQuery.lean(),
      QRCode.countDocuments(filter),
    ]);

    const inventory = includeAssignedUser
      ? sets.map((item) => {
          const assignedUser = item.assignedUserId;
          const hasAssignedUser = Boolean(
            assignedUser?.fullName || assignedUser?.email,
          );

          return {
            ...item,
            assignedUserId: hasAssignedUser
              ? assignedUser._id
              : assignedUser,
            assignedUser: hasAssignedUser
              ? {
                  fullName: assignedUser.fullName,
                  email: assignedUser.email,
                }
              : null,
          };
        })
      : sets;

    return res.status(200).json({
      success: true,
      data: {
        sets: inventory,
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

const recordQRDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const { format, fileType } = req.body || {};

    const allowedFormats = ["standee", "pocket", "keychain"];
    const allowedFileTypes = ["png", "jpg", "jpeg", "svg", "pdf"];

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR set ID.",
      });
    }

    if (!allowedFormats.includes(format)) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR design format.",
      });
    }

    if (!allowedFileTypes.includes(fileType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid download file type.",
      });
    }

    const downloadedAt = new Date();

    const item = await QRCode.findOneAndUpdate(
      {
        _id: id,
        status: { $ne: "disabled" },
        qrPath: { $exists: true, $ne: "" },
      },
      {
        $push: {
          downloadHistory: {
            format,
            fileType,
            downloadedAt,
            downloadedBy: req.user?._id || null,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("serialNumber downloadHistory");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "QR set not found or unavailable.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "QR download recorded successfully.",
      data: {
        serialNumber: item.serialNumber,
        downloadHistory: item.downloadHistory,
      },
    });
  } catch (error) {
    console.error("Record QR download error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record QR download.",
    });
  }
};

const exportQRInventory = async (req, res) => {
  let cursor;

  try {
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

    const fields =
      "serialNumber qrPath formats businessName assignedUserId status generatedAt assignedAt generatedBy assignedBy";

    // Stream database records instead of loading the entire inventory.
    cursor = QRCode.find(filter)
      .select(fields)
      .sort({ _id: 1 })
      .lean()
      .cursor({ batchSize: 500 });

    const filename = `qr-inventory-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    res.status(200);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "no-store");

    // UTF-8 BOM helps spreadsheet software recognize UTF-8.
    res.write("\uFEFF");

    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '""';

      // Prevent spreadsheet formula injection in text fields.
      let text = String(value);
      if (/^[\s]*[=+\-@]/.test(text)) {
        text = `'${text}`;
      }

      return `"${text.replace(/"/g, '""')}"`;
    };

    const headers = [
      "Set ID",
      "QR Path",
      "Business Name",
      "Assigned User ID",
      "Formats",
      "Status",
      "Generated At",
      "Assigned At",
      "Generated By",
      "Assigned By",
    ];

    if (!res.write(headers.map(escapeCSV).join(",") + "\r\n")) {
      await once(res, "drain");
    }

    for await (const item of cursor) {
      if (res.destroyed) break;

      const row = [
        item.serialNumber,
        item.qrPath,
        item.businessName,
        item.assignedUserId,
        Array.isArray(item.formats) ? item.formats.join(" | ") : "",
        item.status,
        item.generatedAt ? item.generatedAt.toISOString() : "",
        item.assignedAt ? item.assignedAt.toISOString() : "",
        item.generatedBy,
        item.assignedBy,
      ];

      if (!res.write(row.map(escapeCSV).join(",") + "\r\n")) {
        await once(res, "drain");
      }
    }

    if (!res.destroyed) res.end();
  } catch (error) {
    console.error("Export QR inventory error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to export QR inventory.",
      });
    }

    res.destroy(error);
  } finally {
    if (cursor) await cursor.close().catch(() => {});
  }
};
module.exports = {
  generateQRBatch,
  getQRInventory,
  exportQRInventory,
  recordQRDownload,
};
