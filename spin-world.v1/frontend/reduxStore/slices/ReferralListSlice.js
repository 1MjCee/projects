import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";

// Async thunk to fetch user referrals
export const fetchReferralList = createAsyncThunk(
  "referralList/fetchReferralList",
  async () => {
    const response = await api.get("/api/user-referrals");
    return response.data;
  }
);

// Initial state
const initialState = {
  referrals: [],
  status: "idle",
  error: null,
};

const referralListSlice = createSlice({
  name: "referralList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferralList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReferralList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.referrals = action.payload;
      })
      .addCase(fetchReferralList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default referralListSlice.reducer;
