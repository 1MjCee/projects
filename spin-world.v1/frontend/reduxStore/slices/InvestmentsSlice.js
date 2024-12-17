import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";

// Async thunk for fetching investments
export const fetchInvestments = createAsyncThunk(
  "investments/fetchInvestments",
  async () => {
    const response = await api.get("/api/investment-plans/");
    return response.data;
  }
);

// Create the slice
const investmentSlice = createSlice({
  name: "investments",
  initialState: {
    investments: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetch investments actions
      .addCase(fetchInvestments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        state.loading = false;
        state.investments = action.payload;
      })
      .addCase(fetchInvestments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.response
          ? action.error.response.data
          : action.error.message;
      });
  },
});

// Export the selectors
export const selectInvestments = (state) => state.investments.investments;
export const selectLoading = (state) => state.investments.loading;
export const selectError = (state) => state.investments.error;

// Export the reducer
export default investmentSlice.reducer;
