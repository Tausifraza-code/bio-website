import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const fetchMyProfile = createAsyncThunk(
  "profile/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/profile");

      if (!data.success) {
        return rejectWithValue(data.message || "Profile fetch failed");
      }

      return data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch profile",
      );
    }
  },
);

export const saveMyProfile = createAsyncThunk(
  "profile/saveMyProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/profile", profileData);

      if (!data.success) {
        return rejectWithValue(data.message || "Profile save failed");
      }

      return data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to save profile",
      );
    }
  },
);

const initialState = {
  profile: null,
  isVerified: null,
  loading: false,
  saving: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.isVerified = action.payload?.isVerified === true;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(saveMyProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveMyProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.profile = action.payload;
        state.isVerified = action.payload?.isVerified === true;
      })
      .addCase(saveMyProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearProfileError } = profileSlice.actions;

export default profileSlice.reducer;
