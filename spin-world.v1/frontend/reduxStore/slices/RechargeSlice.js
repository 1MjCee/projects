import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";

export const submitDeposit = createAsyncThunk(
  "recharge/submit",
  async ({ amount, reference_code, payment_type }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/deposits/deposit_request/", {
        amount,
        reference_code: reference_code,
        payment_type: payment_type,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const RechargeSlice = createSlice({
  name: "deposit",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitDeposit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitDeposit.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitDeposit.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.error?.message || "Failed to submit deposit";
      });
  },
});

export default RechargeSlice.reducer;
