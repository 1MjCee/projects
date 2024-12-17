import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";

// Define an initial state
const initialState = {
  withdrawalDetail: null,
  withdrawalRecords: [],
  success: null,
  loading: false,
  error: null,
};

// Async thunk to send SMS code
export const sendSmsCode = createAsyncThunk(
  "withdrawal/sendSmsCode",
  async (phoneData) => {
    const response = await api.post(
      "/api/withdrawal-details/send-sms-code/",
      phoneData
    );
    return response.data;
  }
);

// Async thunk to create or update withdrawal details
export const createOrUpdateWithdrawal = createAsyncThunk(
  "withdrawal/createOrUpdate",
  async (withdrawalData) => {
    const response = await api.post(
      "/api/withdrawal-details/withdrawal/",
      withdrawalData
    );
    return response.data;
  }
);

// Async thunk to fetch withdrawal details
export const fetchWithdrawalDetails = createAsyncThunk(
  "withdrawal/fetchWithdrawalDetails",
  async () => {
    const response = await api.get("/api/withdrawal-details/");
    return response.data;
  }
);

// Async thunk to fetch withdrawal transactions
export const fetchWithdrawalTransactions = createAsyncThunk(
  "withdrawal/fetchWithdrawalTransactions",
  async () => {
    const response = await api.get("/api/transactions/");
    const transactions = response.data;
    const withdrawalTransactions = transactions.filter(
      (transaction) => transaction.type === "withdrawal"
    );
    return withdrawalTransactions;
  }
);

// Create the withdrawal slice
const withdrawalSlice = createSlice({
  name: "withdrawal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendSmsCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendSmsCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendSmsCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createOrUpdateWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrUpdateWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawalDetail = action.payload;
      })
      .addCase(createOrUpdateWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchWithdrawalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawalDetail = action.payload;
      })
      .addCase(fetchWithdrawalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchWithdrawalTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawalTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawalRecords = action.payload;
      })
      .addCase(fetchWithdrawalTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the reducer and selector for transactions
export const selectWithdrawalRecords = (state) =>
  state.withdrawal.withdrawalRecords;

export const selectWithdrawalLoading = (state) => state.withdrawal.loading;

export const selectWithdrawalError = (state) => state.withdrawal.error;

export default withdrawalSlice.reducer;
