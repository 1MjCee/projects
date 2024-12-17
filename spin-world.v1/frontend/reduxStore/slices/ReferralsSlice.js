import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";

// Thunk to fetch referral stats
export const fetchReferralStats = createAsyncThunk(
  "referral/fetchStats",
  async () => {
    const response = await api.get("/api/referrals/");
    return response.data;
  }
);

const referralSlice = createSlice({
  name: "referral",
  initialState: {
    totalReferrals: 0,
    loading: false,
    referralData: null,
    level_commision: [],
    error: null,
    levels: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferralStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferralStats.fulfilled, (state, action) => {
        state.totalReferrals = action.payload.total_referrals;
        state.referralData = action.payload;
        state.level_commision = action.payload.commission_by_level;
        state.levels = action.payload.levels || [];
        state.loading = false;
      })
      .addCase(fetchReferralStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default referralSlice.reducer;
