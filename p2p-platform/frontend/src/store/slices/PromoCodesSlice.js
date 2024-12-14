import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

export const fetchPromoCodes = createAsyncThunk(
  "promoCodes/fetchPromoCodes",
  async () => {
    const response = await api.get("/api/promo-codes/");
    return response.data;
  }
);

const promoCodeSlice = createSlice({
  name: "promoCodes",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromoCodes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPromoCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPromoCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectPromoCodes = (state) => state.promoCodes.data;
export const selectLoading = (state) => state.promoCodes.loading;
export const selectError = (state) => state.promoCodes.error;

export default promoCodeSlice.reducer;
