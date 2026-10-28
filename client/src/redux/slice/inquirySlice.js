import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// ============================================================
// SUBMIT PUBLIC INQUIRY
// POST /inquiry
// ============================================================
export const createInquiry = createAsyncThunk(
  "inquiry/createInquiry",
  async (inquiryData, { rejectWithValue }) => {
    try {
      const response = await api.post("/inquiries", inquiryData);

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to submit inquiry.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit inquiry.",
      );
    }
  },
);

// ============================================================
// GET LOGGED-IN USER'S INQUIRIES
// GET /inquiry/me
// ============================================================
export const getMyInquiries = createAsyncThunk(
  "inquiry/getMyInquiries",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/inquiries/me", {
        params: {
          page,
          limit,
        },
      });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to fetch inquiries.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch inquiries.",
      );
    }
  },
);

// ============================================================
// DELETE INQUIRY
// DELETE /inquiry/:id
// ============================================================
export const deleteInquiry = createAsyncThunk(
  "inquiry/deleteInquiry",
  async (inquiryId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/inquiries/${inquiryId}`);

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to delete inquiry.",
        );
      }

      return {
        ...response.data,
        inquiryId,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete inquiry.",
      );
    }
  },
);

// ============================================================
// INITIAL STATE
// ============================================================
const initialState = {
  inquiries: [],

  totalInquiries: 0,
  newInquiries: 0,

  pagination: {
    currentPage: 1,
    limit: 10,
    totalPages: 0,
  },

  loading: false,
  submitting: false,
  deleting: false,

  error: null,
  submitError: null,
  deleteError: null,

  submitSuccess: false,
  submitMessage: "",

  deleteSuccess: false,
  deleteMessage: "",

  whatsappNumber: "",
};

// ============================================================
// SLICE
// ============================================================
const inquirySlice = createSlice({
  name: "inquiry",

  initialState,

  reducers: {
    clearInquiryError: (state) => {
      state.error = null;
    },

    clearInquirySubmitError: (state) => {
      state.submitError = null;
    },

    clearInquiryDeleteError: (state) => {
      state.deleteError = null;
    },

    clearInquirySuccess: (state) => {
      state.submitSuccess = false;
      state.submitMessage = "";
      state.whatsappNumber = "";
    },

    clearInquiryDeleteSuccess: (state) => {
      state.deleteSuccess = false;
      state.deleteMessage = "";
    },

    resetInquiryState: () => initialState,
  },

  extraReducers: (builder) => {
    // ========================================================
    // CREATE INQUIRY
    // ========================================================
    builder
      .addCase(createInquiry.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
        state.submitSuccess = false;
        state.submitMessage = "";
        state.whatsappNumber = "";
      })

      .addCase(createInquiry.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitSuccess = true;

        state.submitMessage =
          action.payload?.message || "Inquiry submitted successfully.";

        state.whatsappNumber = action.payload?.whatsappNumber || "";

        // If backend returns created inquiry, add it locally
        if (action.payload?.data) {
          state.inquiries.unshift(action.payload.data);
        }
      })

      .addCase(createInquiry.rejected, (state, action) => {
        state.submitting = false;
        state.submitSuccess = false;

        state.submitError =
          action.payload || "Failed to submit inquiry.";
      });

    // ========================================================
    // GET MY INQUIRIES
    // ========================================================
    builder
      .addCase(getMyInquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMyInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const data = action.payload?.data;

        state.inquiries = data?.inquiries || [];

        state.totalInquiries = data?.totalInquiries || 0;

        state.newInquiries = data?.newInquiries || 0;

        state.pagination = {
          currentPage: data?.pagination?.currentPage || 1,
          limit: data?.pagination?.limit || 10,
          totalPages: data?.pagination?.totalPages || 0,
        };
      })

      .addCase(getMyInquiries.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Failed to fetch inquiries.";
      });

    // ========================================================
    // DELETE INQUIRY
    // ========================================================
    builder
      .addCase(deleteInquiry.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
        state.deleteSuccess = false;
        state.deleteMessage = "";
      })

      .addCase(deleteInquiry.fulfilled, (state, action) => {
        state.deleting = false;
        state.deleteSuccess = true;

        state.deleteMessage =
          action.payload?.message || "Inquiry deleted successfully.";

        const deletedId = action.payload?.inquiryId;

        state.inquiries = state.inquiries.filter(
          (inquiry) => inquiry.id !== deletedId,
        );

        // Update counts after deletion
        if (state.totalInquiries > 0) {
          state.totalInquiries -= 1;
        }
      })

      .addCase(deleteInquiry.rejected, (state, action) => {
        state.deleting = false;

        state.deleteError =
          action.payload || "Failed to delete inquiry.";
      });
  },
});

// ============================================================
// EXPORT ACTIONS
// ============================================================
export const {
  clearInquiryError,
  clearInquirySubmitError,
  clearInquiryDeleteError,
  clearInquirySuccess,
  clearInquiryDeleteSuccess,
  resetInquiryState,
} = inquirySlice.actions;

// ============================================================
// SELECTORS
// ============================================================
export const selectInquiries = (state) =>
  state.inquiry?.inquiries || [];

export const selectTotalInquiries = (state) =>
  state.inquiry?.totalInquiries || 0;

export const selectNewInquiries = (state) =>
  state.inquiry?.newInquiries || 0;

export const selectInquiryLoading = (state) =>
  state.inquiry?.loading || false;

export const selectInquirySubmitting = (state) =>
  state.inquiry?.submitting || false;

export const selectInquiryDeleting = (state) =>
  state.inquiry?.deleting || false;

export const selectInquiryError = (state) =>
  state.inquiry?.error || null;

export const selectInquirySubmitError = (state) =>
  state.inquiry?.submitError || null;

export const selectInquiryDeleteError = (state) =>
  state.inquiry?.deleteError || null;

export const selectInquiryPagination = (state) =>
  state.inquiry?.pagination || {
    currentPage: 1,
    limit: 10,
    totalPages: 0,
  };

export const selectInquiryWhatsappNumber = (state) =>
  state.inquiry?.whatsappNumber || "";

export default inquirySlice.reducer;