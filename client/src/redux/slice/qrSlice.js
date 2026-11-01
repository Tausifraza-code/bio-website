import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const emptySlots = () => ({
  1: null,
  2: null,
  3: null,
});

const validateSlot = (slotNumber) => [1, 2, 3].includes(Number(slotNumber));

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
  async ({ qrPath, slotNumber }, { rejectWithValue }) => {
    try {
      if (!qrPath) {
        return rejectWithValue("Please scan a physical QR code first.");
      }

      if (!validateSlot(slotNumber)) {
        return rejectWithValue("Please select a valid QR slot.");
      }

      const profileResponse = await api.get("/profile");
      const profile = profileResponse.data?.profile;

      if (!profile?.subdomain) {
        return rejectWithValue(
          "Please create and save your public profile first.",
        );
      }

      const response = await api.post("/qr-codes/bind", {
        qrPath,
        slotNumber: Number(slotNumber),
      });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to bind QR code.",
        );
      }

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
  async ({ activationCode, slotNumber }, { rejectWithValue }) => {
    try {
      const code = String(activationCode || "")
        .trim()
        .toUpperCase();

      if (!code) {
        return rejectWithValue("Please enter your activation code.");
      }

      if (!validateSlot(slotNumber)) {
        return rejectWithValue("Please select a valid QR slot.");
      }

      const profileResponse = await api.get("/profile");
      const profile = profileResponse.data?.profile;

      if (!profile?.subdomain) {
        return rejectWithValue(
          "Please create and save your public profile first.",
        );
      }

      const response = await api.post("/qr-codes/activate", {
        activationCode: code,
        slotNumber: Number(slotNumber),
      });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to activate your QR.",
        );
      }

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
          "Failed to activate your physical QR.",
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
    qrSlots: emptySlots(),
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
      // Fetch all three physical QR slots
      .addCase(fetchMyBoundQR.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })
      .addCase(fetchMyBoundQR.fulfilled, (state, action) => {
        state.fetching = false;

        const slots = action.payload?.data?.slots;

        state.qrSlots = {
          1: slots?.[1] || null,
          2: slots?.[2] || null,
          3: slots?.[3] || null,
        };

        // Keep first occupied QR for legacy components.
        state.boundQR =
          state.qrSlots[1] || state.qrSlots[2] || state.qrSlots[3] || null;
      })
      .addCase(fetchMyBoundQR.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.payload || "Failed to load bound QR.";
      })

      // Bind by scanning QR
      .addCase(bindPhysicalQR.pending, (state) => {
        state.binding = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(bindPhysicalQR.fulfilled, (state, action) => {
        state.binding = false;

        const qr = action.payload?.data;
        const slot = qr?.assignedSlot;

        if (validateSlot(slot)) {
          state.qrSlots[slot] = qr;
        }

        state.boundQR =
          state.qrSlots[1] || state.qrSlots[2] || state.qrSlots[3] || null;

        state.successMessage =
          action.payload?.message || "QR linked successfully.";
      })
      .addCase(bindPhysicalQR.rejected, (state, action) => {
        state.binding = false;
        state.error = action.payload || "QR binding failed.";
      })

      // Bind by activation code
      .addCase(activateQRByCode.pending, (state) => {
        state.activatingCode = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(activateQRByCode.fulfilled, (state, action) => {
        state.activatingCode = false;

        const qr = action.payload?.data;
        const slot = qr?.assignedSlot;

        if (validateSlot(slot)) {
          state.qrSlots[slot] = qr;
        }

        state.boundQR =
          state.qrSlots[1] || state.qrSlots[2] || state.qrSlots[3] || null;

        state.successMessage =
          action.payload?.message || "Physical QR linked successfully.";
      })
      .addCase(activateQRByCode.rejected, (state, action) => {
        state.activatingCode = false;
        state.error = action.payload || "Physical QR activation failed.";
      });
  },
});

export const { clearQRMessages } = qrSlice.actions;

export default qrSlice.reducer;
