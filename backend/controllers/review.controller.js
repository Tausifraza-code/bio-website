const Review = require("../models/Review");
const MiniProfile = require("../models/MiniProfile");

// CREATE PUBLIC REVIEW
const createReview = async (req, res) => {
  try {
    const { subdomain, reviewerName, reviewerEmail, rating, comment } =
      req.body;

    if (!subdomain || !reviewerName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Subdomain, name, rating and comment are required",
      });
    }

    const parsedRating = Number(rating);

    if (
      !Number.isInteger(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const profile = await MiniProfile.findOne({
      subdomain: subdomain.toLowerCase().trim(),
    }).select("_id userId subdomain");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Mini website not found",
      });
    }

    const review = await Review.create({
      miniProfileId: profile._id,
      userId: profile.userId,
      reviewerName,
      reviewerEmail,
      rating: parsedRating,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Create Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit review",
    });
  }
};

// GET PUBLIC REVIEWS BY SUBDOMAIN
const getPublicReviews = async (req, res) => {
  try {
    const { subdomain } = req.params;

    const profile = await MiniProfile.findOne({
      subdomain: subdomain.toLowerCase().trim(),
    }).select("_id");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Mini website not found",
      });
    }

    const reviews = await Review.find({
      miniProfileId: profile._id,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;

    const averageRating = totalReviews
      ? Number(
          (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          ).toFixed(1),
        )
      : 0;

    return res.status(200).json({
      success: true,
      totalReviews,
      averageRating,
      reviews,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch reviews",
    });
  }
};

// DELETE REVIEW (OWNER OR ADMIN)
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = review.userId.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review",
      });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete review",
    });
  }
};

module.exports = {
  createReview,
  getPublicReviews,
  deleteReview,
};
