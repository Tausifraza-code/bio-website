import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// ==========================================
// GET LOGGED-IN USER'S GALLERY
// GET /gallery/my-gallery
// ==========================================
export const getMyGallery = createAsyncThunk(
  "gallery/getMyGallery",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/gallery/my-gallery");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch gallery."
      );
    }
  }
);

// ==========================================
// GET PUBLIC GALLERY
// GET /gallery/public/:userId
// ==========================================
export const getPublicGallery = createAsyncThunk(
  "gallery/getPublicGallery",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/gallery/public/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch public gallery."
      );
    }
  }
);

// ==========================================
// UPLOAD MULTIPLE GALLERY IMAGES
// POST /gallery
// ==========================================
export const uploadGalleryImages = createAsyncThunk(
  "gallery/uploadGalleryImages",
  async ({ images, title = "", productId = null }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Controller expects files in the "images" field.
      Array.from(images || []).forEach((image) => {
        formData.append("images", image);
      });

      formData.append("title", title);

      if (productId) {
        formData.append("productId", productId);
      }

      const response = await api.post("/gallery", formData);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload gallery images."
      );
    }
  }
);

// ==========================================
// UPDATE GALLERY IMAGE / TITLE / PRODUCT
// PUT /gallery/:id
// ==========================================
export const updateGalleryImage = createAsyncThunk(
  "gallery/updateGalleryImage",
  async ({ id, title, productId, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      if (title !== undefined) {
        formData.append("title", title);
      }

      if (productId !== undefined) {
        formData.append("productId", productId || "null");
      }

      if (image) {
        // Controller expects a single file in the "image" field.
        formData.append("image", image);
      }

      const response = await api.put(`/gallery/${id}`, formData);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update gallery image."
      );
    }
  }
);

// ==========================================
// DELETE GALLERY IMAGE
// DELETE /gallery/:id
// ==========================================
export const deleteGalleryImage = createAsyncThunk(
  "gallery/deleteGalleryImage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/gallery/${id}`);

      return {
        ...response.data,
        id,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete gallery image."
      );
    }
  }
);

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  gallery: [],
  publicGallery: [],
  count: 0,

  loading: false,
  uploading: false,
  updating: false,
  deleting: false,
  publicLoading: false,

  error: null,
  message: null,
};

// ==========================================
// GALLERY SLICE
// ==========================================
const gallerySlice = createSlice({
  name: "gallery",
  initialState,

  reducers: {
    clearGalleryError: (state) => {
      state.error = null;
    },

    clearGalleryMessage: (state) => {
      state.message = null;
    },

    clearPublicGallery: (state) => {
      state.publicGallery = [];
      state.publicLoading = false;
    },

    resetGalleryState: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // --------------------------------------
      // GET MY GALLERY
      // --------------------------------------
      .addCase(getMyGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.gallery = action.payload.data || [];
        state.count = action.payload.count ?? state.gallery.length;
      })
      .addCase(getMyGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch gallery.";
      })

      // --------------------------------------
      // GET PUBLIC GALLERY
      // --------------------------------------
      .addCase(getPublicGallery.pending, (state) => {
        state.publicLoading = true;
        state.error = null;
      })
      .addCase(getPublicGallery.fulfilled, (state, action) => {
        state.publicLoading = false;
        state.publicGallery = action.payload.data || [];
      })
      .addCase(getPublicGallery.rejected, (state, action) => {
        state.publicLoading = false;
        state.error = action.payload || "Failed to fetch public gallery.";
      })

      // --------------------------------------
      // UPLOAD GALLERY IMAGES
      // --------------------------------------
      .addCase(uploadGalleryImages.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(uploadGalleryImages.fulfilled, (state, action) => {
        state.uploading = false;

        const uploadedImages = action.payload.data || [];

        state.gallery = [...uploadedImages, ...state.gallery];
        state.count = state.gallery.length;
        state.message =
          action.payload.message || "Gallery images uploaded successfully.";
      })
      .addCase(uploadGalleryImages.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload || "Failed to upload gallery images.";
      })

      // --------------------------------------
      // UPDATE GALLERY IMAGE
      // --------------------------------------
      .addCase(updateGalleryImage.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateGalleryImage.fulfilled, (state, action) => {
        state.updating = false;

        const updatedImage = action.payload.data;

        if (updatedImage?._id) {
          const index = state.gallery.findIndex(
            (item) => item._id === updatedImage._id
          );

          if (index !== -1) {
            state.gallery[index] = updatedImage;
          }
        }

        state.message =
          action.payload.message || "Gallery image updated successfully.";
      })
      .addCase(updateGalleryImage.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Failed to update gallery image.";
      })

      // --------------------------------------
      // DELETE GALLERY IMAGE
      // --------------------------------------
      .addCase(deleteGalleryImage.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteGalleryImage.fulfilled, (state, action) => {
        state.deleting = false;

        state.gallery = state.gallery.filter(
          (item) => item._id !== action.payload.id
        );

        state.count = state.gallery.length;
        state.message =
          action.payload.message || "Gallery image deleted successfully.";
      })
      .addCase(deleteGalleryImage.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || "Failed to delete gallery image.";
      });
  },
});

export const {
  clearGalleryError,
  clearGalleryMessage,
  clearPublicGallery,
  resetGalleryState,
} = gallerySlice.actions;

export default gallerySlice.reducer;