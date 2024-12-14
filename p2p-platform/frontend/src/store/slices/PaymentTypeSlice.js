import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

// Define an async thunk for fetching payment types
export const fetchPaymentTypes = createAsyncThunk(
  "paymentTypes/fetch",
  async () => {
    const response = await api.get("/api/payment-types");
    return response.data;
  }
);

const paymentTypeSlice = createSlice({
  name: "paymentTypes",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaymentTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPaymentTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default paymentTypeSlice.reducer;
