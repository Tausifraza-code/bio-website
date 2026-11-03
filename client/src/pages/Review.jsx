
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Star,
  Search,
  MessageSquare,
  Trash2,
  RefreshCw,
  UserRound,
  Mail,
  CalendarDays,
  TrendingUp,
  Award,
  LoaderCircle,
  AlertCircle,
  MessageCircle,
} from "lucide-react";

import {
  fetchPublicReviews,
  deleteReview,
  clearReviewError,
  clearReviewMessage,
} from "../redux/slice/reviewSlice";

import { fetchMyProfile } from "../redux/slice/profileSlice";

const Reviews = () => {
  const dispatch = useDispatch();

  const { profile } = useSelector((state) => state.profile || {});

  const {
    reviews = [],
    totalReviews = 0,
    averageRating = 0,
    loading = false,
    deleting = false,
    error = null,
    successMessage = null,
  } = useSelector((state) => state.review || {});

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const subdomain = profile?.subdomain || "";

  // Fetch profile and reviews
  useEffect(() => {
    if (!subdomain) {
      dispatch(fetchMyProfile());
    }
  }, [dispatch, subdomain]);

  useEffect(() => {
    if (subdomain) {
      dispatch(fetchPublicReviews(subdomain));
    }
  }, [dispatch, subdomain]);

  // Clear messages when page unmounts
  useEffect(() => {
    return () => {
      dispatch(clearReviewError());
      dispatch(clearReviewMessage());
    };
  }, [dispatch]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        review.reviewerName?.toLowerCase().includes(searchText) ||
        review.reviewerEmail?.toLowerCase().includes(searchText) ||
        review.comment?.toLowerCase().includes(searchText);

      const matchesRating =
        ratingFilter === "all" ||
        Number(review.rating) === Number(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [reviews, search, ratingFilter]);

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter(
        (review) => Number(review.rating) === rating
      ).length;

      return {
        rating,
        count,
        percentage: totalReviews
          ? (count / totalReviews) * 100
          : 0,
      };
    });
  }, [reviews, totalReviews]);

  // Delete review
  const handleDelete = async () => {
    if (!selectedReview?._id) return;

    const result = await dispatch(deleteReview(selectedReview._id));

    if (deleteReview.fulfilled.match(result)) {
      setShowDeleteModal(false);
      setSelectedReview(null);
    }
  };

  const openDeleteModal = (review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  const refreshReviews = () => {
    if (subdomain) {
      dispatch(fetchPublicReviews(subdomain));
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderStars = (rating, size = 16) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= Number(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#081728] p-3 text-white sm:p-5 lg:p-7">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                <MessageSquare className="text-cyan-400" size={21} />
              </div>

              <span className="text-sm font-semibold tracking-wider text-cyan-400">
                CUSTOMER FEEDBACK
              </span>
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Reviews & Ratings
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Manage and monitor your customer reviews.
            </p>
          </div>

          <button
            onClick={refreshReviews}
            disabled={loading || !subdomain}
            className="flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Reviews
          </button>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle size={19} />
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            {successMessage}
          </div>
        )}

        {/* PROFILE NOT READY */}
        {!subdomain && !loading && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm text-amber-300">
            Your profile subdomain is not available yet. Please complete your
            profile and try again.
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-[#10243B] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Reviews</p>
                <h2 className="mt-2 text-3xl font-bold">
                  {totalReviews}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                <MessageSquare size={23} />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Approved customer reviews
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#10243B] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Average Rating</p>
                <h2 className="mt-2 text-3xl font-bold">
                  {Number(averageRating).toFixed(1)}
                  <span className="ml-1 text-lg text-slate-400">/ 5</span>
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                <Star size={23} className="fill-amber-400" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              {renderStars(Math.round(averageRating), 15)}
              <span className="text-xs text-slate-500">
                Customer satisfaction
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#10243B] p-5 sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">5 Star Reviews</p>
                <h2 className="mt-2 text-3xl font-bold">
                  {reviews.filter((review) => Number(review.rating) === 5).length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                <Award size={23} />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Excellent customer feedback
            </p>
          </div>
        </div>

        {/* RATING DISTRIBUTION */}
        <div className="rounded-2xl border border-white/10 bg-[#10243B] p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp size={19} className="text-cyan-400" />
            <h2 className="font-semibold">Rating Overview</h2>
          </div>

          <div className="space-y-4">
            {ratingDistribution.map((item) => (
              <div
                key={item.rating}
                className="flex items-center gap-3"
              >
                <div className="flex w-12 items-center gap-1 text-sm text-slate-300">
                  {item.rating}
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                </div>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <span className="w-9 text-right text-xs text-slate-400">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* REVIEWS LIST */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#10243B]">

          <div className="border-b border-white/10 p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-lg font-bold">Customer Reviews</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {filteredReviews.length} reviews found
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* SEARCH */}
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search reviews..."
                    className="w-full rounded-xl border border-white/10 bg-[#0B1B30] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 sm:w-56"
                  />
                </div>

                {/* RATING FILTER */}
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#0B1B30] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3">
              <LoaderCircle
                size={34}
                className="animate-spin text-cyan-400"
              />
              <p className="text-sm text-slate-400">
                Loading customer reviews...
              </p>
            </div>
          ) : filteredReviews.length === 0 ? (
            /* EMPTY STATE */
            <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                <MessageCircle size={30} />
              </div>

              <h3 className="text-lg font-semibold">
                {reviews.length === 0
                  ? "No Reviews Yet"
                  : "No Matching Reviews"}
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-400">
                {reviews.length === 0
                  ? "Customer reviews submitted on your website will appear here."
                  : "Try changing your search or rating filter."}
              </p>

              {(search || ratingFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setRatingFilter("all");
                  }}
                  className="mt-4 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            /* REVIEW CARDS */
            <div className="divide-y divide-white/10">
              {filteredReviews.map((review) => (
                <div
                  key={review._id}
                  className="p-5 transition hover:bg-white/[0.02] sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

                    {/* AVATAR */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-lg font-bold text-cyan-300">
                      {review.reviewerName?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col justify-between gap-3 sm:flex-row">
                        <div>
                          <h3 className="font-semibold text-white">
                            {review.reviewerName}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                            {review.reviewerEmail && (
                              <span className="flex items-center gap-1.5">
                                <Mail size={13} />
                                {review.reviewerEmail}
                              </span>
                            )}

                            <span className="flex items-center gap-1.5">
                              <CalendarDays size={13} />
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => openDeleteModal(review)}
                          disabled={deleting}
                          title="Delete review"
                          className="flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-lg border border-red-400/20 bg-red-400/5 text-red-400 transition hover:bg-red-400/15 disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {renderStars(review.rating)}
                        <span className="text-xs font-semibold text-amber-400">
                          {review.rating}/5
                        </span>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DELETE CONFIRMATION MODAL */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#10243B] p-6 shadow-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <Trash2 size={23} />
              </div>

              <h3 className="text-xl font-bold">Delete Review?</h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Are you sure you want to delete this review from{" "}
                <span className="font-semibold text-white">
                  {selectedReview?.reviewerName}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedReview(null);
                  }}
                  disabled={deleting}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                >
                  {deleting ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
