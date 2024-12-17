import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";

// Thunk for fetching user investment plans
export const fetchUserInvestments = createAsyncThunk(
  "userInvestments/fetchUserInvestments",
  async () => {
    const response = await api.get("/api/user-investment-plans/");
    return response.data;
  }
);

const userInvestmentSlice = createSlice({
  name: "userInvestments",
  initialState: {
    plans: [],
    user_loading: false,
    user_error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInvestments.pending, (state) => {
        state.user_loading = true;
      })
      .addCase(fetchUserInvestments.fulfilled, (state, action) => {
        state.user_loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchUserInvestments.rejected, (state, action) => {
        state.loading = false;
        state.user_error = action.error.message;
      });
  },
});

// Selectors
export const selectUserInvestmentPlans = (state) => state.userInvestments.plans;
export const selectUserInvestmentsLoading = (state) =>
  state.userInvestments.user_loading;
export const selectUserInvestmentsError = (state) =>
  state.userInvestments.user_error;

export default userInvestmentSlice.reducer;
