import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartApi } from '@/lib/api';

interface CartItem {
  id: string;
  product_type: 'part' | 'merch';
  product_id: string;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
  brand?: string;
}

interface CartSummary {
  subtotal: number;
  discount: number;
  total: number;
  shipping_cost?: number;
  points_earned?: number;
}

interface CartState {
  items: CartItem[];
  summary: CartSummary | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  summary: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  const response = await cartApi.getCart();
  if (response.error) {
    return rejectWithValue(response.error);
  }
  return response.data;
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data: { product_type: 'part' | 'merch'; product_id: string; quantity: number }, { rejectWithValue }) => {
    const response = await cartApi.addToCart(data.product_type, data.product_id, data.quantity);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (data: { id: string; quantity: number }, { rejectWithValue }) => {
    const response = await cartApi.updateCartItem(data.id, data.quantity);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id: string, { rejectWithValue }) => {
    const response = await cartApi.removeFromCart(id);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return id;
  }
);

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  const response = await cartApi.clearCart();
  if (response.error) {
    return rejectWithValue(response.error);
  }
  return null;
});

export const fetchCheckoutSummary = createAsyncThunk('cart/fetchCheckoutSummary', async (_, { rejectWithValue }) => {
  const response = await cartApi.getCheckoutSummary();
  if (response.error) {
    return rejectWithValue(response.error);
  }
  return response.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          // Handle different API response structures
          const payload = action.payload as any;
          if (Array.isArray(payload)) {
            // If payload is directly an array of items
            state.items = payload;
          } else if (Array.isArray(payload.items)) {
            // If payload has an items property
            state.items = payload.items;
            state.summary = payload.summary || null;
          } else if (payload.cart_items && Array.isArray(payload.cart_items)) {
            // Alternative structure with cart_items
            state.items = payload.cart_items;
            state.summary = payload.summary || null;
          } else {
            // Fallback to empty array
            state.items = [];
          }
          // Set summary if available
          if (payload.summary && !state.summary) {
            state.summary = payload.summary;
          }
        } else {
          state.items = [];
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.isLoading = false;
        // Refetch cart after adding
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as any;
        if (payload?.id && payload?.quantity !== undefined) {
          const item = state.items.find((item) => item.id === payload.id);
          if (item) {
            item.quantity = payload.quantity;
          }
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.summary = null;
        state.isLoading = false;
      })
      // Fetch checkout summary
      .addCase(fetchCheckoutSummary.fulfilled, (state, action) => {
        if (action.payload) {
          const payload = action.payload as any;
          const summary = payload.summary || payload;
          if (summary && typeof summary === 'object') {
            state.summary = {
              subtotal: summary.subtotal || 0,
              discount: summary.discount || 0,
              total: summary.total || 0,
              shipping_cost: summary.shipping_cost,
              points_earned: summary.points_earned,
            };
          }
        }
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;

