import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

// ==========================================================
// ADMIN — FETCH ALL PLANS
// ==========================================================
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

// ==========================================================
// ADMIN — CREATE PLAN
// ==========================================================
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

// ==========================================================
// ADMIN — UPDATE PLAN
// ==========================================================
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

// ==========================================================
// ADMIN — TOGGLE PLAN STATUS
// ==========================================================
export const toggleAdminPlanStatus = createAsyncThunk(
  "adminPlans/toggleStatus",
  async (plan, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/plans/${plan._id}/status`, {
        isActive: !plan.isActive,
      });

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

// ==========================================================
// ADMIN — DELETE PLAN
// ==========================================================
export const deleteAdminPlan = createAsyncThunk(
  "adminPlans/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/plans/${id}`);

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to delete plan.",
        );
      }

      return {
        id,
        message: response.data.message || "Plan deleted successfully.",
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to delete plan."));
    }
  },
);

// ==========================================================
// USER — FETCH ACTIVE PLANS
// ==========================================================
export const fetchActivePlans = createAsyncThunk(
  "plans/fetchActivePlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/plans/active");

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to load active plans.",
        );
      }

      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load active plans."),
      );
    }
  },
);

// ==========================================================
// ADMIN STATE
// ==========================================================
const initialState = {
  // Admin plans
  plans: [],

  // User-side active plans
  activePlans: [],

  // Admin loading
  loading: false,
  saving: false,

  deleting: false,
  deletingPlanId: null,

  // User loading
  activePlansLoading: false,

  error: null,
  activePlansError: null,

  successMessage: null,
};

// ==========================================================
// SLICE
// ==========================================================
const adminPlansSlice = createSlice({
  name: "adminPlans",

  initialState,

  reducers: {
    clearAdminPlansMessages(state) {
      state.error = null;
      state.successMessage = null;
    },

    clearActivePlansError(state) {
      state.activePlansError = null;
    },
  },

  extraReducers: (builder) => {
    // ======================================================
    // ADMIN — DELETE PLAN
    // ======================================================
    builder
      .addCase(deleteAdminPlan.pending, (state, action) => {
        state.deleting = true;
        state.deletingPlanId = action.meta.arg;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(deleteAdminPlan.fulfilled, (state, action) => {
        state.deleting = false;
        state.deletingPlanId = null;

        state.plans = state.plans.filter(
          (plan) => plan._id !== action.payload.id,
        );

        state.successMessage = action.payload.message;
      })

      .addCase(deleteAdminPlan.rejected, (state, action) => {
        state.deleting = false;
        state.deletingPlanId = null;

        state.error = action.payload || "Failed to delete plan.";
      });
    // ======================================================
    // ADMIN — FETCH ALL PLANS
    // ======================================================

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
      });

    // ======================================================
    // ADMIN — CREATE PLAN
    // ======================================================
    builder
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
      });

    // ======================================================
    // ADMIN — UPDATE PLAN
    // ======================================================
    builder
      .addCase(updateAdminPlan.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(updateAdminPlan.fulfilled, (state, action) => {
        state.saving = false;

        const updated = action.payload;

        const index = state.plans.findIndex((p) => p._id === updated?._id);

        if (index !== -1) {
          state.plans[index] = updated;
        }

        state.successMessage = "Plan updated successfully.";
      })

      .addCase(updateAdminPlan.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to update plan.";
      });

    // ======================================================
    // ADMIN — TOGGLE PLAN STATUS
    // ======================================================
    builder
      .addCase(toggleAdminPlanStatus.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(toggleAdminPlanStatus.fulfilled, (state, action) => {
        state.saving = false;

        const updated = action.payload;

        const index = state.plans.findIndex((p) => p._id === updated?._id);

        if (index !== -1) {
          state.plans[index] = updated;
        }

        state.successMessage = "Plan status updated.";
      })

      .addCase(toggleAdminPlanStatus.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to change plan status.";
      });

    // ======================================================
    // USER — FETCH ACTIVE PLANS
    // ======================================================
    builder
      .addCase(fetchActivePlans.pending, (state) => {
        state.activePlansLoading = true;
        state.activePlansError = null;
      })

      .addCase(fetchActivePlans.fulfilled, (state, action) => {
        state.activePlansLoading = false;
        state.activePlans = action.payload;
      })

      .addCase(fetchActivePlans.rejected, (state, action) => {
        state.activePlansLoading = false;
        state.activePlansError =
          action.payload || "Failed to load active plans.";
      });
  },
});

export const { clearAdminPlansMessages, clearActivePlansError } =
  adminPlansSlice.actions;

export default adminPlansSlice.reducer;
