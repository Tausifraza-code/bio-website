import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const normalizeButtons = (buttons = []) =>
  buttons.map((button) => ({
    ...button,
    id: String(button._id || button.id || button.buttonId),
  }));

// Fetch buttons only when they haven't been loaded yet.
export const fetchContactButtons = createAsyncThunk(
  "contactButtons/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/contact-buttons");

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to load contact buttons",
        );
      }

      return response.data.buttons || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load contact buttons",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState().contactButtons;
      return !state.loaded && !state.loading;
    },
  },
);

// Save the complete configuration to MongoDB.
export const saveContactButtons = createAsyncThunk(
  "contactButtons/save",
  async (buttons, { rejectWithValue }) => {
    try {
      const payload = buttons.map(({ id, _id, ...button }) => button);

      const response = await api.put("/contact-buttons", {
        buttons: payload,
      });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to save contact buttons",
        );
      }

      return response.data.buttons || payload;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save contact buttons",
      );
    }
  },
);

const contactButtonsSlice = createSlice({
  name: "contactButtons",

  initialState: {
    buttons: [],
    loading: false,
    saving: false,
    error: null,
    loaded: false,
  },

  reducers: {
    clearContactButtonsError(state) {
      state.error = null;
    },

    resetContactButtons(state) {
      state.buttons = [];
      state.loading = false;
      state.saving = false;
      state.error = null;
      state.loaded = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchContactButtons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactButtons.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.buttons = normalizeButtons(action.payload);
      })
      .addCase(fetchContactButtons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load contact buttons";
      })

      // Save
      .addCase(saveContactButtons.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveContactButtons.fulfilled, (state, action) => {
        state.saving = false;
        state.loaded = true;
        state.buttons = normalizeButtons(action.payload);
      })
      .addCase(saveContactButtons.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to save contact buttons";
      });
  },
});

export const { clearContactButtonsError, resetContactButtons } =
  contactButtonsSlice.actions;

export default contactButtonsSlice.reducer;
