import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";

export const fetchReferralCode = createAsyncThunk(
  "referralCode/fetchCode",
  async () => {
    const response = await api.get("/api/users/referral-code/");
    return response.data;
  }
);

const referralCodeSlice = createSlice({
  name: "referralCode",
  initialState: {
    referralCode: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferralCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReferralCode.fulfilled, (state, action) => {
        state.referralCode = action.payload.referral_code;
        state.loading = false;
      })
      .addCase(fetchReferralCode.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default referralCodeSlice.reducer;
