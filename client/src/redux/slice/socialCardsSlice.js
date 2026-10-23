import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const normalizeCards = (cards) =>
  cards.map((card) => ({
    ...card,
    id: String(card._id || card.id),
  }));

// Fetch logged-in user's saved social accounts
export const fetchSocialCards = createAsyncThunk(
  "socialCards/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/profile");

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to load social accounts",
        );
      }

      return response.data?.profile?.socialCards || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load social accounts",
      );
    }
  },
);

// Save updated social accounts to MongoDB
export const saveSocialCards = createAsyncThunk(
  "socialCards/save",
  async (socialCards, { rejectWithValue }) => {
    try {
      const response = await api.put("/profile", { socialCards });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to save social accounts",
        );
      }

      return response.data?.profile?.socialCards || socialCards;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save social accounts",
      );
    }
  },
);

const socialCardsSlice = createSlice({
  name: "socialCards",

  initialState: {
    cards: [],
    loading: false,
    saving: false,
    error: null,
    loaded: false,
  },

  reducers: {
    clearSocialCardsError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSocialCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialCards.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.cards = normalizeCards(action.payload);
      })
      .addCase(fetchSocialCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load social accounts";
      })

      // Save
      .addCase(saveSocialCards.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveSocialCards.fulfilled, (state, action) => {
        state.saving = false;
        state.cards = normalizeCards(action.payload);
        state.loaded = true;
      })
      .addCase(saveSocialCards.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to save social accounts";
      });
  },
});

export const { clearSocialCardsError } = socialCardsSlice.actions;

export default socialCardsSlice.reducer;
