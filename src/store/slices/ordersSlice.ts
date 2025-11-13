import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersApi } from '@/lib/api';

interface OrderItem {
  id: string;
  product_type: 'part' | 'merch';
  product_id: string;
  product_name?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Payment {
  id: string;
  payment_method: string;
  amount: number;
  status: string;
  created_at: string;
}

interface ShippingAddress {
  id: string;
  label: string;
  country: string;
  city: string;
  street: string;
  postal_code?: string;
}

interface Order {
  id: string;
  user_id?: string;
  order_number?: string;
  status: string;
  total_amount: string | number; // Can be string from API
  total?: number; // Computed/normalized value
  subtotal?: number;
  shipping_cost?: number;
  discount?: number;
  points_earned?: number;
  created_at: string;
  updated_at?: string;
  estimated_delivery?: string;
  shipping_address_id?: string;
  shipping_address_label?: string;
  city?: string;
  country?: string;
  street?: string;
  postal_code?: string;
  payment_status?: string;
  tracking_number?: string | null;
  notes?: string | null;
  item_count?: number;
  items?: OrderItem[];
  payments?: Payment[];
  shipping_address?: ShippingAddress;
}

interface OrderTracking {
  status: string;
  timeline?: Array<{
    status: string;
    label: string;
    date?: string;
    time?: string;
    completed: boolean;
  }>;
  tracking_number?: string;
  carrier?: string;
}

interface OrdersState {
  orders: Order[];
  orderTracking: OrderTracking | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  orderTracking: null,
  isLoading: false,
  error: null,
};


export const fetchOrders = createAsyncThunk<
  any, // Return type (you can replace with actual data type)
  { page?: number; limit?: number; status?: string } | undefined
>(
  'orders/fetchOrders',
  async (params, { rejectWithValue }) => {
    const response = await ordersApi.getOrders(params);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);


export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (id: string, { rejectWithValue }) => {
    const response = await ordersApi.getOrderDetails(id);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (data: { shipping_address_id: string; payment_method: string; notes?: string }, { rejectWithValue }) => {
    const response = await ordersApi.createOrder(data.shipping_address_id, data.payment_method, data.notes);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id: string, { rejectWithValue }) => {
    const response = await ordersApi.cancelOrder(id);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return id;
  }
);

export const trackOrder = createAsyncThunk(
  'orders/trackOrder',
  async (id: string, { rejectWithValue }) => {
    const response = await ordersApi.trackOrder(id);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOrderTracking: (state) => {
      state.orderTracking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const payload = action.payload as any;
          const ordersList = Array.isArray(payload) ? payload : (payload.orders || []);
          // Normalize total_amount for all orders
          state.orders = ordersList.map((order: any) => {
            if (order.total_amount && typeof order.total_amount === 'string') {
              order.total = parseFloat(order.total_amount);
            } else {
              order.total = order.total_amount || order.total || 0;
            }
            return order;
          });
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch order details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const payload = action.payload as any;
          const order = payload.order || payload;
          // Normalize total_amount to number if it's a string
          if (order.total_amount && typeof order.total_amount === 'string') {
            order.total = parseFloat(order.total_amount);
          } else {
            order.total = order.total_amount || order.total || 0;
          }
          // Update or add order to orders list
          const index = state.orders.findIndex((o) => o.id === order.id);
          if (index !== -1) {
            state.orders[index] = order;
          } else {
            state.orders.unshift(order);
          }
        }
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const payload = action.payload as any;
          const order = payload.order || payload;
          // Normalize total_amount to number if it's a string
          if (order.total_amount && typeof order.total_amount === 'string') {
            order.total = parseFloat(order.total_amount);
          } else {
            order.total = order.total_amount || order.total || 0;
          }
          // Add to orders list
          if (order.id) {
            state.orders.unshift(order);
          }
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const orderId = action.payload;
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = 'cancelled';
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Track order
      .addCase(trackOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const payload = action.payload as any;
          state.orderTracking = payload.tracking || payload;
        }
      })
      .addCase(trackOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearOrderTracking } = ordersSlice.actions;
export default ordersSlice.reducer;

