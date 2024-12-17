import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";

// Define an async thunk for fetching payment methods
export const fetchPaymentMethods = createAsyncThunk(
  "paymentMethods/fetchPaymentMethods",
  async () => {
    const response = await api.get("/api/payment-methods");
    return response.data;
  }
);

const paymentMethodSlice = createSlice({
  name: "paymentMethods",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default paymentMethodSlice.reducer;
