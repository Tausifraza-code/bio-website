
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// CREATE PRODUCT / SERVICE
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("category", productData.category || "General");
      formData.append("type", productData.type || "product");

      // Multiple image files
      (productData.images || []).forEach((image) => {
        formData.append("images", image);
      });

      const response = await api.post("/products", formData);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product."
      );
    }
  }
);

// GET LOGGED-IN USER'S PRODUCTS
export const getMyProducts = createAsyncThunk(
  "product/getMyProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/products/my-products");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products."
      );
    }
  }
);

// UPDATE PRODUCT / SERVICE
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      Object.entries(productData).forEach(([key, value]) => {
        if (key === "images") {
          (value || []).forEach((image) => {
            formData.append("images", image);
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await api.put(`/products/${id}`, formData);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product."
      );
    }
  }
);

// DELETE PRODUCT / SERVICE
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/products/${id}`);

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product."
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",

  initialState: {
    products: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
    message: null,
  },

  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },

    clearProductMessage: (state) => {
      state.message = null;
    },

    clearProductState: (state) => {
      state.error = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE PRODUCT
      .addCase(createProduct.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.message = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.creating = false;
        state.message =
          action.payload.message || "Product created successfully.";

        if (action.payload.data) {
          state.products.unshift(action.payload.data);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || "Failed to create product.";
      })

      // GET MY PRODUCTS
      .addCase(getMyProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || [];
      })
      .addCase(getMyProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products.";
      })

      // UPDATE PRODUCT
      .addCase(updateProduct.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updating = false;
        state.message =
          action.payload.message || "Product updated successfully.";

        const updatedProduct = action.payload.data;

        if (updatedProduct) {
          const index = state.products.findIndex(
            (product) => product._id === updatedProduct._id
          );

          if (index !== -1) {
            state.products[index] = updatedProduct;
          }
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Failed to update product.";
      })

      // DELETE PRODUCT
      .addCase(deleteProduct.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleting = false;
        state.message =
          action.payload.message || "Product deleted successfully.";

        state.products = state.products.filter(
          (product) => product._id !== action.payload.id
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || "Failed to delete product.";
      });
  },
});

export const {
  clearProductError,
  clearProductMessage,
  clearProductState,
} = productSlice.actions;

export default productSlice.reducer;
