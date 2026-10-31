const Plan = require("../models/Plan");
const PlanPurchase = require("../models/PlanPurchase");
const mongoose = require("mongoose");
// CREATE PLAN — Admin only
const createPlan = async (req, res) => {
  try {
    const {
      name,
      price,
      durationValue,
      durationUnit,
      description,
      features,
      sortOrder,
    } = req.body;

    if (
      !name?.trim() ||
      price === undefined ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      !Number.isInteger(Number(durationValue)) ||
      Number(durationValue) < 1 ||
      !["days", "months", "years"].includes(durationUnit)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid name, price and duration are required.",
      });
    }

    if (
      features !== undefined &&
      (!Array.isArray(features) ||
        !features.every((item) => typeof item === "string"))
    ) {
      return res.status(400).json({
        success: false,
        message: "Features must be an array of strings.",
      });
    }

    const plan = await Plan.create({
      name: name.trim(),
      price: Number(price),
      durationValue: Number(durationValue),
      durationUnit,
      description: description?.trim() || "",
      features: features || [],
      sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
    });

    return res.status(201).json({
      success: true,
      message: "Plan created successfully.",
      data: plan,
    });
  } catch (error) {
    console.error("Create plan error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create plan.",
    });
  }
};

// GET ALL PLANS — Admin only
const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({
      sortOrder: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    console.error("Get plans error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch plans.",
    });
  }
};

// UPDATE PLAN — Admin only
const updatePlan = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "price",
      "durationValue",
      "durationUnit",
      "description",
      "features",
      "sortOrder",
      "isActive",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    if (
      updates.name !== undefined &&
      (typeof updates.name !== "string" || !updates.name.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Plan name is invalid.",
      });
    }

    if (
      updates.price !== undefined &&
      (!Number.isFinite(Number(updates.price)) || Number(updates.price) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Plan price is invalid.",
      });
    }

    if (
      updates.durationValue !== undefined &&
      (!Number.isInteger(Number(updates.durationValue)) ||
        Number(updates.durationValue) < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "Plan duration is invalid.",
      });
    }

    if (
      updates.durationUnit !== undefined &&
      !["days", "months", "years"].includes(updates.durationUnit)
    ) {
      return res.status(400).json({
        success: false,
        message: "Plan duration unit is invalid.",
      });
    }

    if (
      updates.features !== undefined &&
      (!Array.isArray(updates.features) ||
        !updates.features.every((item) => typeof item === "string"))
    ) {
      return res.status(400).json({
        success: false,
        message: "Features must be an array of strings.",
      });
    }

    if (
      updates.isActive !== undefined &&
      typeof updates.isActive !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false.",
      });
    }

    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
    }

    if (updates.description !== undefined) {
      if (typeof updates.description !== "string") {
        return res.status(400).json({
          success: false,
          message: "Description must be a string.",
        });
      }
      updates.description = updates.description.trim();
    }

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }

    if (updates.durationValue !== undefined) {
      updates.durationValue = Number(updates.durationValue);
    }

    if (updates.sortOrder !== undefined) {
      if (!Number.isFinite(Number(updates.sortOrder))) {
        return res.status(400).json({
          success: false,
          message: "Sort order must be a valid number.",
        });
      }
      updates.sortOrder = Number(updates.sortOrder);
    }

    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plan updated successfully.",
      data: plan,
    });
  } catch (error) {
    console.error("Update plan error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid plan ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update plan.",
    });
  }
};

// ENABLE / DISABLE PLAN — Admin only
const togglePlanStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    if (!req.body || typeof req.body.isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false.",
      });
    }

    const { isActive } = req.body;

    const plan = await Plan.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { returnDocument: "after", runValidators: true },
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Plan ${isActive ? "activated" : "disabled"} successfully.`,
      data: plan,
    });
  } catch (error) {
    console.error("Toggle plan status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update plan status.",
    });
  }
};

const getActivePlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .select(
        "name price durationValue durationUnit description features sortOrder",
      );

    return res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    console.error("Get active plans error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch active plans",
    });
  }
};

// DELETE PLAN — Admin only
const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan ID",
      });
    }

    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // Check whether this plan has any purchase history
    const hasPurchases = await PlanPurchase.exists({
      planId: id,
    });

    if (hasPurchases) {
      return res.status(409).json({
        success: false,
        message:
          "This plan cannot be deleted because purchase records exist. You can deactivate it instead.",
      });
    }

    await Plan.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.error("Delete Plan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete plan",
    });
  }
};

module.exports = {
  createPlan,
  getAllPlans,
  getActivePlans,
  updatePlan,
  togglePlanStatus,
  deletePlan,
};
