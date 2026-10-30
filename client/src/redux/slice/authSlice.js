import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// ==========================================
// REGISTER
// Supports referralCode from userData or URL
// ==========================================
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlReferralCode = urlParams.get("referralCode") || "";

      const referralCode = (
        userData?.referralCode ||
        urlReferralCode
      )
        .trim()
        .toUpperCase();

      const payload = {
        fullName: (userData.fullName || "").trim(),
        email: (userData.email || "").trim().toLowerCase(),
        phone: (userData.phone || "").trim(),
        password: userData.password,
        referralCode,
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

// ==========================================
// LOGIN
// Supports email or phone number
// ==========================================
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const loginId = (
        loginData.loginId ||
        loginData.email ||
        loginData.phone ||
        ""
      ).trim();

      if (!loginId) {
        return rejectWithValue(
          "Please enter your email or mobile number.",
        );
      }

      if (!loginData.password) {
        return rejectWithValue("Please enter your password.");
      }

      const isEmail = loginId.includes("@");

      const payload = {
        password: loginData.password,
        ...(isEmail
          ? { email: loginId.toLowerCase() }
          : { phone: loginId.replace(/\s+/g, "") }),
      };

      const response = await api.post("/auth/login", payload);

      if (response.data?.token) {
        localStorage.setItem("bioToken", response.data.token);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

// ==========================================
// GET CURRENT LOGGED-IN USER
// GET /auth/me
// ==========================================
export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("bioToken");

      if (!token) {
        return rejectWithValue("Please log in to continue.");
      }

      const response = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data?.success || !response.data?.user) {
        return rejectWithValue(
          response.data?.message || "Unable to fetch user details.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch current user.",
      );
    }
  },
);

// ==========================================
// SERVER LOGOUT
// POST /auth/logout
// ==========================================
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("bioToken");

      // No token means the user is already logged out locally.
      if (!token) {
        return {
          success: true,
          message: "Logout successful",
        };
      }

      const response = await api.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logout request failed.",
      );
    }
  },
);

// ==========================================
// FORGOT PASSWORD
// ==========================================
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const normalizedEmail = (email || "").trim().toLowerCase();

      if (!normalizedEmail) {
        return rejectWithValue("Email is required.");
      }

      const response = await api.post("/auth/forgot-password", {
        email: normalizedEmail,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to send password reset email",
      );
    }
  },
);

// ==========================================
// RESET PASSWORD
// ==========================================
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

// ==========================================
// INITIAL STATE
// ==========================================
const savedToken = localStorage.getItem("bioToken");

const initialState = {
  user: null,
  token: savedToken || null,
  isAuthenticated: Boolean(savedToken),

  loading: false,
  error: null,
  success: false,
  message: "",

  getMeLoading: false,
  getMeError: null,

  logoutLoading: false,
  logoutError: null,

  forgotPasswordLoading: false,
  forgotPasswordSuccess: false,
  forgotPasswordError: null,
  forgotPasswordMessage: "",

  resetPasswordLoading: false,
  resetPasswordSuccess: false,
  resetPasswordError: null,
  resetPasswordMessage: "",
};

// ==========================================
// AUTH SLICE
// ==========================================
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // Immediate local logout
    // Useful when the token expires or an API returns 401.
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";

      state.getMeLoading = false;
      state.getMeError = null;

      state.logoutLoading = false;
      state.logoutError = null;

      localStorage.removeItem("bioToken");
    },

    clearAuthMessage: (state) => {
      state.error = null;
      state.success = false;
      state.message = "";
    },

    clearGetMeError: (state) => {
      state.getMeError = null;
    },

    clearLogoutError: (state) => {
      state.logoutError = null;
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
    // ------------------------------------------
    // REGISTER
    // ------------------------------------------
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
        state.message =
          action.payload?.message || "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Registration failed";
        state.message = "";
      });

    // ------------------------------------------
    // LOGIN
    // ------------------------------------------
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

        state.message =
          action.payload?.message || "Login successful";
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

    // ------------------------------------------
    // GET ME
    // ------------------------------------------
    builder
      .addCase(getMe.pending, (state) => {
        state.getMeLoading = true;
        state.getMeError = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.getMeLoading = false;
        state.getMeError = null;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(state.token);
      })
      .addCase(getMe.rejected, (state, action) => {
        state.getMeLoading = false;
        state.getMeError = action.payload || "Unable to fetch user.";

        // Clear authentication only if the stored token is invalid
        // or the user no longer exists.
        const message = String(action.payload || "").toLowerCase();

        if (
          message.includes("invalid or expired token") ||
          message.includes("user no longer exists") ||
          message.includes("token is required")
        ) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem("bioToken");
        }
      });

    // ------------------------------------------
    // SERVER LOGOUT
    // ------------------------------------------
    builder
      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true;
        state.logoutError = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.logoutLoading = false;
        state.logoutError = null;

        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        state.loading = false;
        state.error = null;
        state.success = false;
        state.message = "";

        localStorage.removeItem("bioToken");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutLoading = false;
        state.logoutError =
          action.payload || "Logout request failed.";
      });

    // ------------------------------------------
    // FORGOT PASSWORD
    // ------------------------------------------
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

    // ------------------------------------------
    // RESET PASSWORD
    // ------------------------------------------
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
        state.resetPasswordError =
          action.payload || "Unable to reset password";
      });
  },
});

export const {
  logout,
  clearAuthMessage,
  clearGetMeError,
  clearLogoutError,
  clearPasswordResetState,
} = authSlice.actions;

export default authSlice.reducer;
