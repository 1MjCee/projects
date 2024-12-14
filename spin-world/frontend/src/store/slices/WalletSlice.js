// slices/walletSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

export const fetchWalletStats = createAsyncThunk(
  "wallet/fetchStats",
  async () => {
    const response = await api.get("/api/user-wallet/");
    return response.data;
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    totalEarnings: 0.0,
    balance: 0.0,
    referral_commission: 0.0,
    interest: 0.0,
    deposit: 0.0,
    expenditure: 0.0,
    withdrawal: 0.0,
    currency: {
      code: "",
      name: "",
      symbol: "",
    },
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWalletStats.fulfilled, (state, action) => {
        state.totalEarnings = parseFloat(action.payload.total_earnings);
        state.balance = parseFloat(action.payload.balance);
        state.referral_commission = parseFloat(
          action.payload.referral_commission
        );
        state.interest = parseFloat(action.payload.interest);
        state.deposit = parseFloat(action.payload.deposit);
        state.expenditure = parseFloat(action.payload.expenditure);
        state.withdrawal = parseFloat(action.payload.withdrawal);
        state.currency = action.payload.currency;
        state.loading = false;
      })
      .addCase(fetchWalletStats.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const selectWallet = (state) => state.wallet;

export default walletSlice.reducer;
