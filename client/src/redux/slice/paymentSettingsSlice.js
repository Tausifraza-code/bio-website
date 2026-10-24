import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api"; // Adjust to your actual api.js path

export const fetchMyPaymentSettings = createAsyncThunk(
  "paymentSettings/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/payment-settings/mine");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load payment settings.",
      );
    }
  },
);

export const savePaymentSettings = createAsyncThunk(
  "paymentSettings/save",
  async (upiId, { rejectWithValue }) => {
    try {
      const response = await api.put("/payment-settings/mine", {
        upiId,
      });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to save UPI settings.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to save UPI settings.",
      );
    }
  },
);

const paymentSettingsSlice = createSlice({
  name: "paymentSettings",
  initialState: {
    data: null,
    loading: false,
    saving: false,
    error: null,
    message: "",
  },
  reducers: {
    clearPaymentSettingsMessage(state) {
      state.error = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPaymentSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPaymentSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMyPaymentSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to load settings.";
      })
      .addCase(savePaymentSettings.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.message = "";
      })
      .addCase(savePaymentSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.data = action.payload.data;
        state.message =
          action.payload.message || "Settings saved successfully.";
      })
      .addCase(savePaymentSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Unable to save settings.";
      });
  },
});

export const { clearPaymentSettingsMessage } = paymentSettingsSlice.actions;

export default paymentSettingsSlice.reducer;
