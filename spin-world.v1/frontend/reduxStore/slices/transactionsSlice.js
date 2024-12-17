import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";

const initialState = {
  records: [],
  loading: false,
  error: null,
};

// Define the async thunk to fetch transactions from the API
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async () => {
    const response = await api.get("/api/transactions/");
    return response.data
      .filter((transaction) => transaction.type === "reward")
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearRecords: (state) => {
      state.records = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearRecords } = transactionsSlice.actions;
export default transactionsSlice.reducer;
