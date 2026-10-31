const Inquiry = require("../models/Inquiry");
const MiniProfile = require("../models/MiniProfile");

// POST: Submit inquiry from a public mini website

const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message, subdomain, source } =
      req.body;

    const isQRLead = source === "qr";

    if (
      !name?.trim() ||
      !phone?.trim() ||
      !subdomain?.trim() ||
      (!isQRLead && !message?.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    const profile = await MiniProfile.findOne({
      subdomain: subdomain.trim().toLowerCase(),
    }).select("_id userId whatsapp leadCapture");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Mini website not found.",
      });
    }

    // QR popup must respect shopkeeper's setting
    if (isQRLead && !profile.leadCapture?.enabled) {
      return res.status(403).json({
        success: false,
        message: "Lead capture is disabled.",
      });
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email?.trim() || "",
      phone: phone.trim(),
      subject: subject?.trim() || (isQRLead ? "QR Scan Lead" : ""),
      message:
        message?.trim() ||
        (isQRLead ? "Customer submitted details through QR code." : ""),
      userId: profile.userId,
      miniProfileId: profile._id,
    });

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully.",
      data: inquiry,
      whatsappNumber: profile.whatsapp || "",
    });
  } catch (error) {
    console.error("Create inquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit inquiry.",
    });
  }
};

// GET: Get inquiries belonging to the logged-in user
const getMyInquiries = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
    );

    const filter = { userId };

    const [totalInquiries, newInquiries, inquiries] = await Promise.all([
      Inquiry.countDocuments(filter),
      Inquiry.countDocuments({ ...filter, status: "New" }),
      Inquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select(
          "name email phone subject message status miniProfileId createdAt",
        ),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalInquiries,
        newInquiries,
        inquiries: inquiries.map((item) => ({
          id: item._id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          subject: item.subject,
          message: item.message,
          status: item.status,
          miniProfileId: item.miniProfileId,
          timestamp: item.createdAt,
        })),
        pagination: {
          currentPage: page,
          limit,
          totalPages: Math.ceil(totalInquiries / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get inquiries error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries.",
    });
  }
};

// DELETE: Delete only the logged-in user's inquiry
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Delete inquiry error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete inquiry.",
    });
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
  deleteInquiry,
};
