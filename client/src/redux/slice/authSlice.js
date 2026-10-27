import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// REGISTER

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const payload = {
        fullName: userData.fullName.trim(),
        email: userData.email.trim().toLowerCase(),
        phone: userData.phone.trim(),
        password: userData.password,
        referralCode: userData.referralCode?.trim().toUpperCase() || "",
      };

      const response = await api.post("/auth/register", payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

// LOGIN

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const email = (loginData.email || loginData.loginId || "")
        .trim()
        .toLowerCase();

      if (!email.includes("@")) {
        return rejectWithValue(
          "Abhi login ke liye email address use karein. Mobile login backend mein abhi supported nahi hai.",
        );
      }

      const response = await api.post("/auth/login", {
        email,
        password: loginData.password,
      });

      if (response.data?.token) {
        localStorage.setItem("bioToken", response.data.token);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

// FORGOT PASSWORD

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to send password reset email",
      );
    }
  },
);

// RESET PASSWORD

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to reset password",
      );
    }
  },
);

// INITIAL STATE

const initialState = {
  user: null,
  token: localStorage.getItem("bioToken") || null,
  isAuthenticated: !!localStorage.getItem("bioToken"),

  loading: false,
  error: null,
  success: false,
  message: "",

  forgotPasswordLoading: false,
  forgotPasswordSuccess: false,
  forgotPasswordError: null,
  forgotPasswordMessage: "",

  resetPasswordLoading: false,
  resetPasswordSuccess: false,
  resetPasswordError: null,
  resetPasswordMessage: "",
};

// AUTH SLICE

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";

      localStorage.removeItem("bioToken");
    },

    clearAuthMessage: (state) => {
      state.error = null;
      state.success = false;
      state.message = "";
    },

    clearPasswordResetState: (state) => {
      state.forgotPasswordLoading = false;
      state.forgotPasswordSuccess = false;
      state.forgotPasswordError = null;
      state.forgotPasswordMessage = "";

      state.resetPasswordLoading = false;
      state.resetPasswordSuccess = false;
      state.resetPasswordError = null;
      state.resetPasswordMessage = "";
    },
  },

  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload?.message || "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Registration failed";
        state.message = "";
      });

    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.isAuthenticated = Boolean(action.payload?.token);

        state.message = action.payload?.message || "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Login failed";
        state.message = "";

        localStorage.removeItem("bioToken");
      });

    // FORGOT PASSWORD
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true;
        state.forgotPasswordSuccess = false;
        state.forgotPasswordError = null;
        state.forgotPasswordMessage = "";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordSuccess = true;
        state.forgotPasswordError = null;
        state.forgotPasswordMessage =
          action.payload?.message ||
          "If an account exists for this email, a reset link will be sent.";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordSuccess = false;
        state.forgotPasswordError =
          action.payload || "Unable to send password reset email";
      });

    // RESET PASSWORD
    builder
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.resetPasswordSuccess = false;
        state.resetPasswordError = null;
        state.resetPasswordMessage = "";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordSuccess = true;
        state.resetPasswordError = null;
        state.resetPasswordMessage =
          action.payload?.message || "Password reset successful";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordSuccess = false;
        state.resetPasswordError = action.payload || "Unable to reset password";
      });
  },
});

export const { logout, clearAuthMessage, clearPasswordResetState } =
  authSlice.actions;

  
export default authSlice.reducer;
