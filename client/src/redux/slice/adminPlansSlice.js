import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

export const fetchAdminPlans = createAsyncThunk(
  "adminPlans/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/plans");
      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to load plans.",
        );
      }
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load plans."));
    }
  },
);

export const createAdminPlan = createAsyncThunk(
  "adminPlans/create",
  async (plan, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/plans", plan);
      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to create plan.",
        );
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to create plan."));
    }
  },
);

export const updateAdminPlan = createAsyncThunk(
  "adminPlans/update",
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/plans/${id}`, changes);
      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to update plan.",
        );
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to update plan."));
    }
  },
);

export const toggleAdminPlanStatus = createAsyncThunk(
  "adminPlans/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/plans/${id}/status`);
      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to change plan status.",
        );
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to change plan status."),
      );
    }
  },
);

const initialState = {
  plans: [],
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};

const adminPlansSlice = createSlice({
  name: "adminPlans",
  initialState,
  reducers: {
    clearAdminPlansMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchAdminPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load plans.";
      })
      .addCase(createAdminPlan.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAdminPlan.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload?._id) {
          state.plans.unshift(action.payload);
        }
        state.successMessage = "Plan created successfully.";
      })
      .addCase(createAdminPlan.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to create plan.";
      })
      .addCase(updateAdminPlan.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAdminPlan.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        const index = state.plans.findIndex((p) => p._id === updated?._id);
        if (index !== -1) state.plans[index] = updated;
        state.successMessage = "Plan updated successfully.";
      })
      .addCase(updateAdminPlan.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to update plan.";
      })
      .addCase(toggleAdminPlanStatus.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(toggleAdminPlanStatus.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        const index = state.plans.findIndex((p) => p._id === updated?._id);
        if (index !== -1) state.plans[index] = updated;
        state.successMessage = "Plan status updated.";
      })
      .addCase(toggleAdminPlanStatus.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to change plan status.";
      });
  },
});

export const { clearAdminPlansMessages } = adminPlansSlice.actions;
export default adminPlansSlice.reducer;
