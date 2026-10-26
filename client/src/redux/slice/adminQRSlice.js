import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const fetchQRInventory = createAsyncThunk(
  "adminQR/fetchInventory",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/qr-sets/inventory", {
        params,
      });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to load QR inventory.",
        );
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load QR inventory.",
      );
    }
  },
);

export const generateQRBatch = createAsyncThunk(
  "adminQR/generateBatch",
  async (count, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/qr-sets/generate", {
        count: Number(count),
      });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to generate QR sets.",
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to generate QR sets.",
      );
    }
  },
);

export const exportQRInventory = createAsyncThunk(
  "adminQR/exportInventory",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/qr-sets/export", {
        params,
        responseType: "blob",
      });

      const blobUrl = URL.createObjectURL(response.data);
      const link = document.createElement("a");

      const status = params.status ? `-${params.status}` : "";
      link.href = blobUrl;
      link.download = `qr-inventory${status}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Release the temporary object URL after the download starts.
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to export QR inventory.",
      );
    }
  },
);

export const recordQRDownload = createAsyncThunk(
  "adminQR/recordDownload",
  async ({ id, format, fileType }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/qr-sets/${id}/downloads`, {
        format,
        fileType,
      });

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to record QR download.",
        );
      }

      return {
        id,
        format,
        fileType,
        data: response.data.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to record QR download.",
      );
    }
  },
);

const initialState = {
  sets: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  generating: false,
  exporting: false,
  error: null,
  message: null,
};

const adminQRSlice = createSlice({
  name: "adminQR",
  initialState,
  reducers: {
    clearQRMessages: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQRInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQRInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.sets = action.payload?.sets || [];
        state.pagination =
          action.payload?.pagination || initialState.pagination;
      })
      .addCase(fetchQRInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to load QR inventory.";
      })

      .addCase(generateQRBatch.pending, (state) => {
        state.generating = true;
        state.error = null;
        state.message = null;
      })
      .addCase(generateQRBatch.fulfilled, (state, action) => {
        state.generating = false;
        state.message = action.payload?.message || "QR sets generated.";
      })
      .addCase(generateQRBatch.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload || "Unable to generate QR sets.";
      })

      .addCase(exportQRInventory.pending, (state) => {
        state.exporting = true;
        state.error = null;
      })
      .addCase(exportQRInventory.fulfilled, (state) => {
        state.exporting = false;
      })
      .addCase(exportQRInventory.rejected, (state, action) => {
        state.exporting = false;
        state.error = action.payload || "Unable to export QR inventory.";
      })

      .addCase(recordQRDownload.fulfilled, (state, action) => {
        const { id, data } = action.payload;

        const qrSet = state.sets.find(
          (item) => String(item._id) === String(id),
        );

        if (qrSet && data?.downloadHistory) {
          qrSet.downloadHistory = data.downloadHistory;
        }
      })
      .addCase(recordQRDownload.rejected, (state, action) => {
        state.error = action.payload || "Unable to record QR download.";
      });
  },
});

export const { clearQRMessages } = adminQRSlice.actions;
export default adminQRSlice.reducer;
