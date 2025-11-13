import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { usersApi } from '@/lib/api';

interface Address {
  id: string;
  label: string;
  country: string;
  city: string;
  street: string;
  postal_code?: string;
  is_default: boolean;
}

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
  // Add other order fields as needed
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  membership_type?: string;
  membership_points?: number;
  email_verified?: number;
  phone_verified?: number;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  is_admin?: number;
}

interface UserState {
  profile: UserProfile | null;
  addresses: Address[];
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  addresses: [],
  orders: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProfile = createAsyncThunk('user/fetchProfile', async (_, { rejectWithValue }) => {
  const response = await usersApi.getProfile();
  if (response.error) {
    return rejectWithValue(response.error);
  }
  return response.data;
});

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: { full_name?: string; phone?: string }, { rejectWithValue }) => {
    const response = await usersApi.updateProfile(data);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (data: { current_password: string; new_password: string }, { rejectWithValue }) => {
    const response = await usersApi.changePassword(data.current_password, data.new_password);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);

export const fetchAddresses = createAsyncThunk('user/fetchAddresses', async (_, { rejectWithValue }) => {
  const response = await usersApi.getAddresses();
  if (response.error) {
    return rejectWithValue(response.error);
  }
  return response.data;
});

export const addAddress = createAsyncThunk(
  'user/addAddress',
  async (data: { label: string; country: string; city: string; street: string; postal_code?: string; is_default?: boolean }, { rejectWithValue }) => {
    const response = await usersApi.addAddress(data);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);

export const updateAddress = createAsyncThunk(
  'user/updateAddress',
  async (data: { id: string; label?: string; country?: string; city?: string; street?: string; postal_code?: string; is_default?: boolean }, { rejectWithValue }) => {
    const response = await usersApi.updateAddress(data.id, data);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);

export const deleteAddress = createAsyncThunk('user/deleteAddress', async (id: string, { rejectWithValue }) => {
  const response = await usersApi.deleteAddress(id);
  if (response.error) {
    return rejectWithValue(response.error);
  }
  return id;
});

export const fetchOrders = createAsyncThunk(
  'user/fetchOrders',
  async (params: { page?: number; limit?: number } | undefined, { rejectWithValue }) => {
    const response = await usersApi.getOrders(params);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          // Handle API response structure: { user: {...} }
          const payload = action.payload as any;
          const userData = payload.user || payload;
          state.profile = userData;
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (action.payload && state.profile) {
          const payload = action.payload as any;
          const userData = payload.user || payload;
          state.profile = { ...state.profile, ...userData };
        }
      })
      // Fetch addresses
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        if (action.payload) {
          state.addresses = Array.isArray(action.payload) ? action.payload : [];
        }
      })
      // Add address
      .addCase(addAddress.fulfilled, (state, action) => {
        if (action.payload) {
          const address = action.payload as any;
          if (address.id && address.label && address.country && address.city && address.street) {
            state.addresses.push(address as Address);
          }
        }
      })
      // Update address
      .addCase(updateAddress.fulfilled, (state, action) => {
        if (action.payload) {
          const address = action.payload as any;
          if (address.id) {
            const index = state.addresses.findIndex((addr) => addr.id === address.id);
            if (index !== -1 && address.label && address.country && address.city && address.street) {
              state.addresses[index] = address as Address;
            }
          }
        }
      })
      // Delete address
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((addr) => addr.id !== action.payload);
      })
      // Fetch orders
      .addCase(fetchOrders.fulfilled, (state, action) => {
        if (action.payload) {
          const payload = action.payload as any;
          state.orders = Array.isArray(payload) ? payload : (payload.orders || []);
        }
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;

