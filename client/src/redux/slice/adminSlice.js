import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// ADMIN LOGIN
export const adminLogin = createAsyncThunk(
  "admin/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/login", {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      });

      const { token, admin, message } = response.data;

      if (!token || admin?.role !== "admin") {
        return rejectWithValue("Invalid admin login response.");
      }

      localStorage.setItem("adminToken", token);

      return { token, admin, message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Admin login failed.",
      );
    }
  },
);

// FETCH ADMIN DASHBOARD
export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/dashboard");

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to load dashboard.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to load dashboard. Please try again.",
      );
    }
  },
);

// FETCH ADMIN USERS
export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = "" } = params;

      const response = await api.get("/admin/users", {
        params: { page, limit, search: search.trim() },
      });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to load users.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load users.",
      );
    }
  },
);

// VERIFY USER PROFILE
export const verifyUserProfile = createAsyncThunk(
  "admin/verifyUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/verify`);

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to verify user.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to verify user.",
      );
    }
  },
);

// UNVERIFY USER PROFILE
export const unverifyUserProfile = createAsyncThunk(
  "admin/unverifyUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/unverify`);

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to remove verification.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to remove verification.",
      );
    }
  },
);

// FETCH REFERRAL OVERVIEW
export const fetchAdminReferrals = createAsyncThunk(
  "admin/fetchReferrals",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/referrals", {
        params,
      });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to load referrals.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load referral report.",
      );
    }
  },
);

// FETCH SELECTED REFERRER'S USERS
export const fetchReferredUsers = createAsyncThunk(
  "admin/fetchReferredUsers",
  async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/referrals/${userId}/users`, {
        params: { page, limit },
      });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to load referred users.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load referred users.",
      );
    }
  },
);

/* FETCH ADMIN ORDERS */
export const fetchAdminOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/plan-purchases/admin/history", {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || "",
          status: params.status || "",
          from: params.from || "",
          to: params.to || "",
        },
      });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to load orders.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load orders.",
      );
    }
  },
);

const initialState = {
  admin: null,
  token: localStorage.getItem("adminToken") || null,
  isAuthenticated: Boolean(localStorage.getItem("adminToken")),

  loginLoading: false,
  loginError: null,

  stats: {
    totalUsers: null,
    totalReferrals: null,
    activePlans: null,
    totalOrders: null,
  },
  recentActivity: [],
  loading: false,
  error: null,

  // User management
  users: [],
  usersLoading: false,
  usersError: null,
  usersPagination: {
    currentPage: 1,
    limit: 10,
    totalUsers: 0,
    totalPages: 0,
  },

  // Per-user verification loading and messages
  verificationLoading: {},
  verificationError: null,
  verificationMessage: null,

  // Referral overview
  referrals: [],
  referralPagination: {
    currentPage: 1,
    limit: 10,
    totalUsers: 0,
    totalPages: 0,
  },
  totalReferralSignups: 0,
  referralsLoading: false,
  referralsError: null,

  // Selected referrer details
  selectedReferrer: null,
  referredUsers: [],
  referredUsersPagination: {
    currentPage: 1,
    limit: 10,
    totalUsers: 0,
    totalPages: 0,
  },
  referredUsersLoading: false,
  referredUsersError: null,

  // Admin order management
  orders: [],
  ordersStats: {
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    paidRevenue: 0,
  },
  ordersLoading: false,
  ordersError: null,
  ordersPagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState,

  reducers: {
    adminLogout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loginLoading = false;
      state.loginError = null;

      state.users = [];
      state.usersError = null;
      state.usersLoading = false;
      state.verificationLoading = {};
      state.verificationError = null;
      state.verificationMessage = null;

      localStorage.removeItem("adminToken");
    },

    clearAdminError: (state) => {
      state.error = null;
      state.loginError = null;
      state.usersError = null;
      state.verificationError = null;
      state.verificationMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ADMIN LOGIN
      .addCase(adminLogin.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload || "Admin login failed.";
      })

      // DASHBOARD
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || initialState.stats;
        state.recentActivity = action.payload.recentActivity || [];
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to load dashboard data.";
      })

      // ADMIN USERS
      .addCase(fetchAdminUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.users || [];
        state.usersPagination =
          action.payload.pagination || initialState.usersPagination;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload || "Unable to load users.";
      })

      // VERIFY: PENDING
      .addCase(verifyUserProfile.pending, (state, action) => {
        const userId = action.meta.arg;

        state.verificationLoading[userId] = true;
        state.verificationError = null;
        state.verificationMessage = null;
      })

      // VERIFY: SUCCESS
      .addCase(verifyUserProfile.fulfilled, (state, action) => {
        const userId = action.meta.arg;

        state.verificationLoading[userId] = false;
        state.verificationMessage = action.payload.message;

        const user = state.users.find((item) => item._id === userId);

        if (user && action.payload.profile) {
          user.profile = {
            ...user.profile,
            isVerified: action.payload.profile.isVerified,
            verifiedAt: action.payload.profile.verifiedAt,
          };
        }
      })

      // VERIFY: ERROR
      .addCase(verifyUserProfile.rejected, (state, action) => {
        const userId = action.meta.arg;

        state.verificationLoading[userId] = false;
        state.verificationError = action.payload || "Unable to verify user.";
      })

      // UNVERIFY: PENDING
      .addCase(unverifyUserProfile.pending, (state, action) => {
        const userId = action.meta.arg;

        state.verificationLoading[userId] = true;
        state.verificationError = null;
        state.verificationMessage = null;
      })

      // UNVERIFY: SUCCESS
      .addCase(unverifyUserProfile.fulfilled, (state, action) => {
        const userId = action.meta.arg;

        state.verificationLoading[userId] = false;
        state.verificationMessage = action.payload.message;

        const user = state.users.find((item) => item._id === userId);

        if (user && action.payload.profile) {
          user.profile = {
            ...user.profile,
            isVerified: action.payload.profile.isVerified,
            verifiedAt: action.payload.profile.verifiedAt,
          };
        }
      })

      // UNVERIFY: ERROR
      .addCase(unverifyUserProfile.rejected, (state, action) => {
        const userId = action.meta.arg;

        state.verificationLoading[userId] = false;
        state.verificationError =
          action.payload || "Unable to remove verification.";
      })

      // REFERRAL OVERVIEW
      .addCase(fetchAdminReferrals.pending, (state) => {
        state.referralsLoading = true;
        state.referralsError = null;
      })
      .addCase(fetchAdminReferrals.fulfilled, (state, action) => {
        state.referralsLoading = false;
        state.referrals = action.payload.data || [];
        state.referralPagination = action.payload.pagination;
        state.totalReferralSignups = action.payload.totalReferralSignups || 0;
      })
      .addCase(fetchAdminReferrals.rejected, (state, action) => {
        state.referralsLoading = false;
        state.referralsError =
          action.payload || "Unable to load referral report.";
      })

      // SELECTED REFERRER DETAILS
      .addCase(fetchReferredUsers.pending, (state) => {
        state.referredUsersLoading = true;
        state.referredUsersError = null;
      })
      .addCase(fetchReferredUsers.fulfilled, (state, action) => {
        state.referredUsersLoading = false;
        state.selectedReferrer = action.payload.referrer;
        state.referredUsers = action.payload.users || [];
        state.referredUsersPagination = action.payload.pagination;
      })
      .addCase(fetchReferredUsers.rejected, (state, action) => {
        state.referredUsersLoading = false;
        state.referredUsersError =
          action.payload || "Unable to load referred users.";
      })

      // ADMIN ORDERS
      .addCase(fetchAdminOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })

      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload.data || [];
        state.ordersStats = {
          ...initialState.ordersStats,
          ...action.payload.stats,
        };
        state.ordersPagination = {
          ...initialState.ordersPagination,
          ...action.payload.pagination,
        };
      })

      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload || "Unable to load orders.";
      });
  },
});

export const { adminLogout, clearAdminError } = adminSlice.actions;

export default adminSlice.reducer;
