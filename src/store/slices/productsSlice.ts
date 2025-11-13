import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsApi } from '@/lib/api';

interface ProductState {
  categories: any[];
  brands: any[];
  models: any[];
  parts: any[];
  merchandise: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  categories: [],
  brands: [],
  models: [],
  parts: [],
  merchandise: [],
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

export const fetchBrands = createAsyncThunk('products/fetchBrands', async (_, { rejectWithValue }) => {
  const response = await productsApi.getBrands();
  if (response.error) {
    return rejectWithValue(response.error);
  }
  return response.data;
});

export const fetchModels = createAsyncThunk('products/fetchModels', async (_, { rejectWithValue }) => {
  const response = await productsApi.getModels();
  if (response.error) {
    return rejectWithValue(response.error);
  }
  return response.data;
});

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
          state.categories = Array.isArray(action.payload) ? action.payload : action.payload.categories || [];
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBrands.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.brands = Array.isArray(action.payload) ? action.payload : action.payload.brands || [];
        }
      })
      .addCase(fetchBrands.rejected, (state, action) => {
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
          state.models = Array.isArray(action.payload) ? action.payload : action.payload.models || [];
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

