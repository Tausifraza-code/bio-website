import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// Fetch admin dashboard data
export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/dashboard");

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to load dashboard",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to load dashboard. Please try again.",
      );
    }
  },
);

const initialState = {
  stats: {
    totalUsers: null,
    totalReferrals: null,
    activePlans: null,
    totalOrders: null,
  },
  recentActivity: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || initialState.stats;
        state.recentActivity = action.payload.recentActivity || [];
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to load dashboard data.";
      });
  },
});

export const { clearAdminError } = adminSlice.actions;

export default adminSlice.reducer;
