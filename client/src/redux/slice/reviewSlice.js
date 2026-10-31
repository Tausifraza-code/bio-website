
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// ==========================================
// CREATE PUBLIC REVIEW
// ==========================================
export const createReview = createAsyncThunk(
  "review/createReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/reviews", reviewData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to submit review"
      );
    }
  }
);

// ==========================================
// GET PUBLIC REVIEWS BY SUBDOMAIN
// ==========================================
export const fetchPublicReviews = createAsyncThunk(
  "review/fetchPublicReviews",
  async (subdomain, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/reviews/${encodeURIComponent(subdomain)}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch reviews"
      );
    }
  }
);

// ==========================================
// DELETE REVIEW (OWNER OR ADMIN)
// ==========================================
export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/reviews/${reviewId}`);

      return {
        reviewId,
        ...data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to delete review"
      );
    }
  }
);

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  reviews: [],
  totalReviews: 0,
  averageRating: 0,

  loading: false,
  saving: false,
  deleting: false,

  error: null,
  successMessage: null,
};

// ==========================================
// REVIEW SLICE
// ==========================================
const reviewSlice = createSlice({
  name: "review",
  initialState,

  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },

    clearReviewMessage: (state) => {
      state.successMessage = null;
    },

    resetReviewState: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // CREATE REVIEW
      .addCase(createReview.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(createReview.fulfilled, (state, action) => {
        state.saving = false;
        state.successMessage = action.payload.message;

        const review = action.payload.review;

        if (review && review.isApproved) {
          state.reviews.unshift(review);
          state.totalReviews += 1;

          const totalRating = state.reviews.reduce(
            (sum, item) => sum + Number(item.rating || 0),
            0
          );

          state.averageRating = Number(
            (totalRating / state.totalReviews).toFixed(1)
          );
        }
      })

      .addCase(createReview.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // FETCH PUBLIC REVIEWS
      .addCase(fetchPublicReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPublicReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews || [];
        state.totalReviews = action.payload.totalReviews || 0;
        state.averageRating = action.payload.averageRating || 0;
      })

      .addCase(fetchPublicReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE REVIEW
      .addCase(deleteReview.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(deleteReview.fulfilled, (state, action) => {
        state.deleting = false;
        state.successMessage = action.payload.message;

        state.reviews = state.reviews.filter(
          (review) =>
            review._id !== action.payload.reviewId
        );

        state.totalReviews = state.reviews.length;

        const totalRating = state.reviews.reduce(
          (sum, review) => sum + Number(review.rating || 0),
          0
        );

        state.averageRating = state.totalReviews
          ? Number(
              (totalRating / state.totalReviews).toFixed(1)
            )
          : 0;
      })

      .addCase(deleteReview.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearReviewError,
  clearReviewMessage,
  resetReviewState,
} = reviewSlice.actions;

export default reviewSlice.reducer;
