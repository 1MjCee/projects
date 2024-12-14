import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

// Define an initial state
const initialState = {
  success: null,
  loading: false,
  error: null,
};

// Async thunk for submitting a withdrawal request
export const submitWithdrawalRequest = createAsyncThunk(
  "withdrawalRequest/submitWithdrawalRequest",
  async (amount, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/withdrawals/withdrawal_request/", {
        amount,
      });

      // Assuming a successful response structure
      if (response.data.success) {
        return response.data;
      } else {
        // If success is false, return the message as an error
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      // Handle unexpected errors (e.g., network issues)
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Create the withdrawal request slice
const withdrawalRequestSlice = createSlice({
  name: "withdrawalRequest",
  initialState,
  reducers: {
    resetMessages: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitWithdrawalRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(submitWithdrawalRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(submitWithdrawalRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer
export const { resetMessages } = withdrawalRequestSlice.actions;
export default withdrawalRequestSlice.reducer;

// Selector functions
export const selectWithdrawalRequestLoading = (state) =>
  state.withdrawalRequest.loading;

export const selectWithdrawalRequestError = (state) =>
  state.withdrawalRequest.error;

export const selectWithdrawalRequestSuccess = (state) =>
  state.withdrawalRequest.success;
