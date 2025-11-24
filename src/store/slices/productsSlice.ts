import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsApi } from '@/lib/api';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ProductState {
  categories: any[];
  manufacturers: any[];
  models: any[];
  parts: any[];
  merchandise: any[];
  manufacturersPagination: Pagination | null;
  modelsPagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  categories: [],
  manufacturers: [],
  models: [],
  parts: [],
  merchandise: [],
  manufacturersPagination: null,
  modelsPagination: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  const response = await productsApi.getCategories();
  if (response.error) {
    return rejectWithValue(response.error);
  }
  return response.data;
});

export const fetchManufacturers = createAsyncThunk(
  'products/fetchManufacturers',
  async (params: { page?: number; limit?: number; search?: string; sort?: string; order?: string } = {}, { rejectWithValue }) => {
    const response = await productsApi.getManufacturers(params);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);

export const fetchModels = createAsyncThunk(
  'products/fetchModels',
  async (params: { page?: number; limit?: number; search?: string; sort?: string; order?: string } = {}, { rejectWithValue }) => {
    const response = await productsApi.getModels(params);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.categories = Array.isArray(action.payload) ? action.payload : (action.payload as any).categories || [];
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchManufacturers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchManufacturers.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const payload = action.payload as any;
          // Handle API response structure: { manufacturers: [...], pagination: {...} } or direct array
          if (Array.isArray(payload)) {
            state.manufacturers = payload;
            state.manufacturersPagination = null;
          } else if (Array.isArray(payload.manufacturers)) {
            state.manufacturers = payload.manufacturers;
            state.manufacturersPagination = payload.pagination || null;
          } else {
            state.manufacturers = [];
            state.manufacturersPagination = null;
          }
        }
      })
      .addCase(fetchManufacturers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchModels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const payload = action.payload as any;
          // Handle API response structure: { models: [...], pagination: {...} } or direct array
          if (Array.isArray(payload)) {
            state.models = payload;
            state.modelsPagination = null;
          } else if (Array.isArray(payload.models)) {
            state.models = payload.models;
            state.modelsPagination = payload.pagination || null;
          } else {
            state.models = [];
            state.modelsPagination = null;
          }
        }
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;

