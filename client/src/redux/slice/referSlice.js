
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// ==========================================
// GET LOGGED-IN USER'S REFERRALS
// GET /api/referrals/me?page=1&limit=10
// ==========================================
export const getMyReferrals = createAsyncThunk(
  "referral/getMyReferrals",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/referrals/me", {
        params: { page, limit },
      });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to fetch referrals."
        );
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch your referrals."
      );
    }
  }
);

const initialState = {
  user: null,
  referrals: [],
  totalReferrals: 0,
  pagination: {
    currentPage: 1,
    limit: 10,
    totalReferrals: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const referralSlice = createSlice({
  name: "referral",
  initialState,
  reducers: {
    clearReferralError: (state) => {
      state.error = null;
    },
    resetMyReferrals: (state) => {
      state.user = null;
      state.referrals = [];
      state.totalReferrals = 0;
      state.pagination = initialState.pagination;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyReferrals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyReferrals.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload?.user || null;
        state.referrals = action.payload?.referrals || [];
        state.totalReferrals = action.payload?.totalReferrals || 0;

        state.pagination = {
          ...initialState.pagination,
          ...(action.payload?.pagination || {}),
        };
      })
      .addCase(getMyReferrals.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch your referrals.";
      });
  },
});

export const {
  clearReferralError,
  resetMyReferrals,
} = referralSlice.actions;

export default referralSlice.reducer;
