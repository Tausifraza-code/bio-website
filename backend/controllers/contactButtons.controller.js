const MiniProfile = require("../models/MiniProfile");

const DEFAULT_CONTACT_BUTTONS = [
  {
    buttonId: "save-contact",
    label: "Save Contact",
    icon: "user-round-plus",
    actionType: "saveContact",
    enabled: true,
    order: 0,
    customUrl: "",
  },
  {
    buttonId: "call",
    label: "Call",
    icon: "phone",
    actionType: "call",
    enabled: true,
    order: 1,
    customUrl: "",
  },
  {
    buttonId: "whatsapp",
    label: "WhatsApp",
    icon: "message-circle",
    actionType: "whatsapp",
    enabled: true,
    order: 2,
    customUrl: "",
  },
];

// GET: Fetch contact buttons
exports.getContactButtons = async (req, res) => {
  try {
    const profile = await MiniProfile.findOne({
      userId: req.user._id,
    }).select("contactButtons");

    const buttons =
      profile?.contactButtons?.length > 0
        ? profile.contactButtons
        : DEFAULT_CONTACT_BUTTONS;

    return res.status(200).json({
      success: true,
      buttons,
    });
  } catch (error) {
    console.error("Get contact buttons error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact buttons",
    });
  }
};

// PUT: Save the complete contact buttons configuration
exports.saveContactButtons = async (req, res) => {
  try {
    const { buttons } = req.body;

    if (!Array.isArray(buttons)) {
      return res.status(400).json({
        success: false,
        message: "Buttons must be an array",
      });
    }

    const allowedActions = [
      "saveContact",
      "call",
      "whatsapp",
      "email",
      "directions",
      "share",
      "website",
      "upi",
      "customLink",
    ];

    const buttonIds = new Set();

    for (const button of buttons) {
      if (
        !button.buttonId ||
        !button.label?.trim() ||
        !allowedActions.includes(button.actionType)
      ) {
        return res.status(400).json({
          success: false,
          message: "Each button needs a valid ID, label, and action type",
        });
      }

      if (buttonIds.has(button.buttonId)) {
        return res.status(400).json({
          success: false,
          message: "Duplicate button IDs are not allowed",
        });
      }

      buttonIds.add(button.buttonId);

      if (
        ["website", "customLink"].includes(button.actionType) &&
        button.enabled &&
        !button.customUrl?.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: `A URL is required for ${button.actionType} buttons`,
        });
      }
    }

    const normalizedButtons = buttons.map((button, index) => ({
      buttonId: button.buttonId,
      label: button.label.trim(),
      icon: button.icon || "link",
      actionType: button.actionType,
      enabled: button.enabled !== false,
      order: Number.isFinite(Number(button.order))
        ? Number(button.order)
        : index,
      customUrl: button.customUrl?.trim() || "",
    }));

    const profile = await MiniProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: { contactButtons: normalizedButtons },
        $setOnInsert: { userId: req.user._id },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    ).select("contactButtons");

    return res.status(200).json({
      success: true,
      message: "Contact buttons saved successfully",
      buttons: profile.contactButtons,
    });
  } catch (error) {
    console.error("Save contact buttons error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save contact buttons",
    });
  }
};
