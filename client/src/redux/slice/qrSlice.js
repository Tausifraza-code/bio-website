import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const fetchMyBoundQR = createAsyncThunk(
  "qr/fetchMyBoundQR",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/qr-codes/my");

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to fetch your QR.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load your bound QR.",
      );
    }
  },
);

export const bindPhysicalQR = createAsyncThunk(
  "qr/bindPhysicalQR",
  async ({ qrPath }, { rejectWithValue }) => {
    try {
      if (!qrPath) {
        return rejectWithValue("Please scan or upload a QR code first.");
      }

      const profileResponse = await api.get("/profile");
      const profile = profileResponse.data?.profile;

      if (!profile?.subdomain) {
        return rejectWithValue(
          "Please create and save your public profile first.",
        );
      }

      const response = await api.post("/qr-codes/bind", { qrPath });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to bind QR code.",
        );
      }

      // Include the profile subdomain for the preview.
      return {
        ...response.data,
        data: {
          ...response.data.data,
          subdomain: response.data.data?.subdomain || profile.subdomain,
        },
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while binding the QR.",
      );
    }
  },
);

export const activateQRByCode = createAsyncThunk(
  "qr/activateQRByCode",
  async ({ activationCode }, { rejectWithValue }) => {
    try {
      const code = String(activationCode || "")
        .trim()
        .toUpperCase();

      if (!code) {
        return rejectWithValue("Please enter your activation code.");
      }

      const response = await api.post("/qr-codes/activate", {
        activationCode: code,
      });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to activate your standee.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to activate your standee.",
      );
    }
  },
);

const qrSlice = createSlice({
  name: "qr",

  initialState: {
    binding: false,
    fetching: false,
    boundQR: null,
    successMessage: "",
    error: null,
    activatingCode: false,
  },

  reducers: {
    clearQRMessages: (state) => {
      state.successMessage = "";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBoundQR.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })
      .addCase(fetchMyBoundQR.fulfilled, (state, action) => {
        state.fetching = false;
        state.boundQR = action.payload?.data || null;
      })
      .addCase(fetchMyBoundQR.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.payload || "Failed to load bound QR.";
      })

      .addCase(bindPhysicalQR.pending, (state) => {
        state.binding = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(bindPhysicalQR.fulfilled, (state, action) => {
        state.binding = false;
        state.boundQR = action.payload?.data || null;
        state.successMessage =
          action.payload?.message || "QR linked successfully.";
      })
      .addCase(bindPhysicalQR.rejected, (state, action) => {
        state.binding = false;
        state.error = action.payload || "QR binding failed.";
      })

      .addCase(activateQRByCode.pending, (state) => {
        state.activatingCode = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(activateQRByCode.fulfilled, (state, action) => {
        state.activatingCode = false;
        state.boundQR = action.payload?.data || state.boundQR;
        state.successMessage =
          action.payload?.message || "Standee activated successfully.";
      })
      .addCase(activateQRByCode.rejected, (state, action) => {
        state.activatingCode = false;
        state.error = action.payload || "Standee activation failed.";
      });
  },
});

export const { clearQRMessages } = qrSlice.actions;
export default qrSlice.reducer;
