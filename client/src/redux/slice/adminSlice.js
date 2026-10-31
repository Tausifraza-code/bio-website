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

export const fetchAdminUserProfile = createAsyncThunk(
  "admin/fetchAdminUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load user profile.",
      );
    }
  },
);

export const updateAdminUserProfile = createAsyncThunk(
  "admin/updateAdminUserProfile",
  async ({ userId, user, profile }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userId}/profile`, {
        user,
        profile,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to save user profile.",
      );
    }
  },
);

/* =========================================
   ADMIN USER GALLERY MANAGEMENT
========================================= */

// FETCH SELECTED USER GALLERY
export const fetchAdminUserGallery = createAsyncThunk(
  "admin/fetchAdminUserGallery",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/users/${userId}/gallery`);

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to load user gallery.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load user gallery.",
      );
    }
  },
);

// UPLOAD GALLERY IMAGES
export const uploadAdminUserGallery = createAsyncThunk(
  "admin/uploadAdminUserGallery",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/admin/users/${userId}/gallery`,
        formData,
      );

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to upload gallery images.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to upload gallery images.",
      );
    }
  },
);

// UPDATE GALLERY IMAGE
export const updateAdminUserGalleryImage = createAsyncThunk(
  "admin/updateAdminUserGalleryImage",
  async ({ userId, id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/admin/users/${userId}/gallery/${id}`,
        formData,
      );

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to update gallery image.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to update gallery image.",
      );
    }
  },
);

// DELETE GALLERY IMAGE
export const deleteAdminUserGalleryImage = createAsyncThunk(
  "admin/deleteAdminUserGalleryImage",
  async ({ userId, id }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/users/${userId}/gallery/${id}`);

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to delete gallery image.",
        );
      }

      return { ...response.data, deletedId: id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to delete gallery image.",
      );
    }
  },
);

/* =========================================
   ADMIN USER PRODUCT MANAGEMENT
========================================= */

// FETCH SELECTED USER PRODUCTS
export const fetchAdminUserProducts = createAsyncThunk(
  "admin/fetchAdminUserProducts",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/users/${userId}/products`);

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to load user products.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load user products.",
      );
    }
  },
);

// CREATE PRODUCT FOR USER
export const createAdminUserProduct = createAsyncThunk(
  "admin/createAdminUserProduct",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/admin/users/${userId}/products`,
        formData,
      );

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to create product.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to create product.",
      );
    }
  },
);

// UPDATE USER PRODUCT
export const updateAdminUserProduct = createAsyncThunk(
  "admin/updateAdminUserProduct",
  async ({ userId, id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/admin/users/${userId}/products/${id}`,
        formData,
      );

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to update product.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to update product.",
      );
    }
  },
);

// DELETE USER PRODUCT
export const deleteAdminUserProduct = createAsyncThunk(
  "admin/deleteAdminUserProduct",
  async ({ userId, id }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/admin/users/${userId}/products/${id}`,
      );

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to delete product.",
        );
      }

      return { ...response.data, deletedId: id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to delete product.",
      );
    }
  },
);

// UPLOAD ADMIN USER PROFILE IMAGES
export const uploadAdminUserProfileImages = createAsyncThunk(
  "admin/uploadAdminUserProfileImages",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/admin/users/${userId}/profile/images`,
        formData,
      );

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to upload profile images.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to upload profile images.",
      );
    }
  },
);

// =====================================
// ADMIN GENERAL SETTINGS
// =====================================

// FETCH GENERAL SETTINGS
export const fetchAdminGeneralSettings = createAsyncThunk(
  "admin/fetchGeneralSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/settings/general");

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to fetch general settings.",
        );
      }

      return response.data.settings;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch general settings.",
      );
    }
  },
);

// UPDATE GENERAL SETTINGS
export const updateAdminGeneralSettings = createAsyncThunk(
  "admin/updateGeneralSettings",
  async (settings, { rejectWithValue }) => {
    try {
      const response = await api.put("/admin/settings/general", settings);

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to update general settings.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to update general settings.",
      );
    }
  },
);

// CHANGE ADMIN PASSWORD
export const changeAdminPassword = createAsyncThunk(
  "admin/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.put(
        "/admin/settings/change-password",
        passwordData,
      );

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to change password.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to change password.",
      );
    }
  },
);

export const uploadAdminWebsiteLogo = createAsyncThunk(
  "admin/uploadWebsiteLogo",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/admin/settings/general/upload-logo",
        formData,
      );

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to upload website logo.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to upload website logo.",
      );
    }
  },
);

export const fetchPublicBranding = createAsyncThunk(
  "admin/fetchPublicBranding",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/settings/branding");

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to fetch website branding",
        );
      }

      return response.data.settings;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch website branding",
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

  // Selected user's profile management
  selectedUserProfile: null,
  selectedUserProfileLoading: false,
  selectedUserProfileSaving: false,
  selectedUserProfileError: null,
  selectedUserProfileMessage: null,

  // Selected user's gallery management
  userGallery: [],
  userGalleryLoading: false,

  // Selected user's product management
  userProducts: [],
  userProductsLoading: false,

  // Gallery and product mutations
  userContentSaving: false,
  userContentError: null,
  userContentMessage: null,

  profileImagesSaving: false,
  profileImagesError: null,

  branding: {
    websiteName: "BIO Website",
    websiteLogo: "",
    websiteUrl: "",
  },
  brandingLoading: false,
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
      state.selectedUserProfile = null;

      state.selectedUserProfileLoading = false;
      state.selectedUserProfileSaving = false;
      state.selectedUserProfileError = null;
      state.selectedUserProfileMessage = null;

      localStorage.removeItem("adminToken");
    },

    clearAdminError: (state) => {
      state.error = null;
      state.loginError = null;
      state.usersError = null;
      state.verificationError = null;
      state.verificationMessage = null;

      state.selectedUserProfileError = null;
      state.selectedUserProfileMessage = null;
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
      })
      // FETCH SELECTED USER PROFILE
      .addCase(fetchAdminUserProfile.pending, (state) => {
        state.selectedUserProfileLoading = true;
        state.selectedUserProfileError = null;
        state.selectedUserProfileMessage = null;
      })

      .addCase(fetchAdminUserProfile.fulfilled, (state, action) => {
        state.selectedUserProfileLoading = false;
        state.selectedUserProfile = {
          user: action.payload.user || null,
          profile: action.payload.profile || null,
        };
      })

      .addCase(fetchAdminUserProfile.rejected, (state, action) => {
        state.selectedUserProfileLoading = false;
        state.selectedUserProfileError =
          action.payload || "Unable to load user profile.";
      })

      // UPDATE SELECTED USER PROFILE
      .addCase(updateAdminUserProfile.pending, (state) => {
        state.selectedUserProfileSaving = true;
        state.selectedUserProfileError = null;
        state.selectedUserProfileMessage = null;
      })

      .addCase(updateAdminUserProfile.fulfilled, (state, action) => {
        state.selectedUserProfileSaving = false;

        state.selectedUserProfile = {
          user: action.payload.user || null,
          profile: action.payload.profile || null,
        };

        state.selectedUserProfileMessage =
          action.payload.message || "User profile updated successfully.";

        // Keep the users list in sync with account-level edits.
        const updatedUser = action.payload.user;

        if (updatedUser?._id) {
          const index = state.users.findIndex(
            (item) => item._id === updatedUser._id,
          );

          if (index !== -1) {
            state.users[index] = {
              ...state.users[index],
              ...updatedUser,
            };
          }
        }
      })

      .addCase(updateAdminUserProfile.rejected, (state, action) => {
        state.selectedUserProfileSaving = false;
        state.selectedUserProfileError =
          action.payload || "Unable to save user profile.";
      })

      // =====================================
      // ADMIN USER GALLERY
      // =====================================

      .addCase(fetchAdminUserGallery.pending, (state) => {
        state.userGalleryLoading = true;
        state.userContentError = null;
      })

      .addCase(fetchAdminUserGallery.fulfilled, (state, action) => {
        state.userGalleryLoading = false;

        state.userGallery = action.payload.data || action.payload.gallery || [];
      })

      .addCase(fetchAdminUserGallery.rejected, (state, action) => {
        state.userGalleryLoading = false;
        state.userContentError =
          action.payload || "Unable to load user gallery.";
      })

      // Gallery mutations
      .addCase(uploadAdminUserGallery.pending, (state) => {
        state.userContentSaving = true;
        state.userContentError = null;
        state.userContentMessage = null;
      })

      .addCase(uploadAdminUserGallery.fulfilled, (state, action) => {
        state.userContentSaving = false;
        state.userContentMessage =
          action.payload.message || "Gallery uploaded successfully.";
      })

      .addCase(uploadAdminUserGallery.rejected, (state, action) => {
        state.userContentSaving = false;
        state.userContentError =
          action.payload || "Unable to upload gallery images.";
      })

      .addCase(updateAdminUserGalleryImage.pending, (state) => {
        state.userContentSaving = true;
        state.userContentError = null;
      })

      .addCase(updateAdminUserGalleryImage.fulfilled, (state, action) => {
        state.userContentSaving = false;
        state.userContentMessage =
          action.payload.message || "Gallery image updated successfully.";
      })

      .addCase(updateAdminUserGalleryImage.rejected, (state, action) => {
        state.userContentSaving = false;
        state.userContentError =
          action.payload || "Unable to update gallery image.";
      })

      .addCase(deleteAdminUserGalleryImage.pending, (state) => {
        state.userContentSaving = true;
        state.userContentError = null;
      })

      .addCase(deleteAdminUserGalleryImage.fulfilled, (state, action) => {
        state.userContentSaving = false;

        state.userGallery = state.userGallery.filter(
          (item) => item._id !== action.payload.deletedId,
        );

        state.userContentMessage =
          action.payload.message || "Gallery image deleted successfully.";
      })

      .addCase(deleteAdminUserGalleryImage.rejected, (state, action) => {
        state.userContentSaving = false;
        state.userContentError =
          action.payload || "Unable to delete gallery image.";
      })

      // =====================================
      // ADMIN USER PRODUCTS
      // =====================================

      .addCase(fetchAdminUserProducts.pending, (state) => {
        state.userProductsLoading = true;
        state.userContentError = null;
      })

      .addCase(fetchAdminUserProducts.fulfilled, (state, action) => {
        state.userProductsLoading = false;

        state.userProducts =
          action.payload.data || action.payload.products || [];
      })

      .addCase(fetchAdminUserProducts.rejected, (state, action) => {
        state.userProductsLoading = false;
        state.userContentError =
          action.payload || "Unable to load user products.";
      })

      // Product mutations
      .addCase(createAdminUserProduct.pending, (state) => {
        state.userContentSaving = true;
        state.userContentError = null;
        state.userContentMessage = null;
      })

      .addCase(createAdminUserProduct.fulfilled, (state, action) => {
        state.userContentSaving = false;
        state.userContentMessage =
          action.payload.message || "Product created successfully.";
      })

      .addCase(createAdminUserProduct.rejected, (state, action) => {
        state.userContentSaving = false;
        state.userContentError = action.payload || "Unable to create product.";
      })

      .addCase(updateAdminUserProduct.pending, (state) => {
        state.userContentSaving = true;
        state.userContentError = null;
      })

      .addCase(updateAdminUserProduct.fulfilled, (state, action) => {
        state.userContentSaving = false;
        state.userContentMessage =
          action.payload.message || "Product updated successfully.";
      })

      .addCase(updateAdminUserProduct.rejected, (state, action) => {
        state.userContentSaving = false;
        state.userContentError = action.payload || "Unable to update product.";
      })

      .addCase(deleteAdminUserProduct.pending, (state) => {
        state.userContentSaving = true;
        state.userContentError = null;
      })

      .addCase(deleteAdminUserProduct.fulfilled, (state, action) => {
        state.userContentSaving = false;

        state.userProducts = state.userProducts.filter(
          (item) => item._id !== action.payload.deletedId,
        );

        state.userContentMessage =
          action.payload.message || "Product deleted successfully.";
      })

      .addCase(deleteAdminUserProduct.rejected, (state, action) => {
        state.userContentSaving = false;
        state.userContentError = action.payload || "Unable to delete product.";
      })

      // PROFILE IMAGE UPLOAD
      .addCase(uploadAdminUserProfileImages.pending, (state) => {
        state.profileImagesSaving = true;
        state.profileImagesError = null;
      })

      .addCase(uploadAdminUserProfileImages.fulfilled, (state, action) => {
        state.profileImagesSaving = false;

        if (action.payload.profile) {
          state.selectedUserProfile = {
            ...state.selectedUserProfile,
            profile: action.payload.profile,
          };
        }

        state.selectedUserProfileMessage =
          action.payload.message || "Profile images uploaded successfully.";
      })

      .addCase(uploadAdminUserProfileImages.rejected, (state, action) => {
        state.profileImagesSaving = false;
        state.profileImagesError =
          action.payload || "Unable to upload profile images.";
      })

      .addCase(fetchPublicBranding.pending, (state) => {
        state.brandingLoading = true;
      })

      .addCase(fetchPublicBranding.fulfilled, (state, action) => {
        state.brandingLoading = false;
        state.branding = action.payload;
      })

      .addCase(fetchPublicBranding.rejected, (state) => {
        state.brandingLoading = false;
      });
  },
});

export const { adminLogout, clearAdminError } = adminSlice.actions;

export default adminSlice.reducer;
