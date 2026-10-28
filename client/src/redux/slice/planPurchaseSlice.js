import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Fetch active plans
export const fetchActivePlans = createAsyncThunk(
  "planPurchase/fetchActivePlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/plans/active");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch plans",
      );
    }
  },
);

// Create Razorpay order
export const createPlanOrder = createAsyncThunk(
  "planPurchase/createPlanOrder",
  async (planId, { rejectWithValue }) => {
    try {
      const response = await axios.post("/plan-purchases/create-order", {
        planId,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
);

// Verify payment
export const verifyPlanPayment = createAsyncThunk(
  "planPurchase/verifyPlanPayment",
  async (paymentResponse, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/plan-purchases/verify-payment",
        paymentResponse,
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Payment verification failed",
      );
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
          response.data?.message || "Failed to change plan status",
        );
      }

      // Backend updated plan return kare toh use karo.
      // Warna success ke baad latest plans fetch karo.
      if (response.data?.data?._id) {
        return response.data.data;
      }

      const plansResponse = await api.get("/admin/plans");

      if (!plansResponse.data?.success) {
        return rejectWithValue("Plan status changed, but refresh failed");
      }

      return {
        _id: id,
        __refreshedPlans: plansResponse.data.data || [],
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to change plan status",
      );
    }
  },
);

const initialState = {
  plans: [],
  currentOrder: null,
  purchase: null,
  loadingPlans: false,
  creatingOrder: false,
  verifyingPayment: false,
  error: null,
  successMessage: null,
};

const planPurchaseSlice = createSlice({
  name: "planPurchase",
  initialState,
  reducers: {
    clearPlanPurchaseMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch plans
      .addCase(fetchActivePlans.pending, (state) => {
        state.loadingPlans = true;
        state.error = null;
      })
      .addCase(fetchActivePlans.fulfilled, (state, action) => {
        state.loadingPlans = false;
        state.plans = action.payload;
      })
      .addCase(fetchActivePlans.rejected, (state, action) => {
        state.loadingPlans = false;
        state.error = action.payload;
      })

      // Create order
      .addCase(createPlanOrder.pending, (state) => {
        state.creatingOrder = true;
        state.error = null;
      })
      .addCase(createPlanOrder.fulfilled, (state, action) => {
        state.creatingOrder = false;
        state.currentOrder = action.payload;
      })
      .addCase(createPlanOrder.rejected, (state, action) => {
        state.creatingOrder = false;
        state.error = action.payload;
      })

      // Verify payment
      .addCase(verifyPlanPayment.pending, (state) => {
        state.verifyingPayment = true;
        state.error = null;
      })
      .addCase(verifyPlanPayment.fulfilled, (state, action) => {
        state.verifyingPayment = false;
        state.purchase = action.payload;
        state.successMessage = "Payment verified successfully";
        state.currentOrder = null;
      })
      .addCase(verifyPlanPayment.rejected, (state, action) => {
        state.verifyingPayment = false;
        state.error = action.payload;
      })
      .addCase(toggleAdminPlanStatus.fulfilled, (state, action) => {
        const updatedPlan = action.payload;

        if (updatedPlan.__refreshedPlans) {
          state.plans = updatedPlan.__refreshedPlans;
        } else {
          const index = state.plans.findIndex(
            (plan) => plan._id === updatedPlan._id,
          );

          if (index !== -1) {
            state.plans[index] = updatedPlan;
          }
        }

        state.error = null;
        state.successMessage = "Plan status updated successfully.";
      });
  },
});

export const { clearPlanPurchaseMessages, clearCurrentOrder } =
  planPurchaseSlice.actions;

export default planPurchaseSlice.reducer;
