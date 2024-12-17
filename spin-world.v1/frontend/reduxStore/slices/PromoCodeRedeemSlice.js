import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";

// Async thunk for redeeming a promo code
export const promoCodeRedeem = createAsyncThunk(
  "promo/promoCodeRedeem",
  async ({ code }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/promo-codes/redeem/", { code });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Slice for promo code redemption
const promoCodeRedeemSlice = createSlice({
  name: "promoCodeRedeem",
  initialState: {
    message: "",
    amount: null,
    currency: "",
    loading: false,
    error: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.message = "";
      state.amount = null;
      state.currency = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(promoCodeRedeem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "";
        state.currency = "";
      })
      .addCase(promoCodeRedeem.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.amount = action.payload.amount;
        state.currency = action.payload.currency;
      })
      .addCase(promoCodeRedeem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "";
        state.amount = null;
        state.currency = "";
      });
  },
});

// Export the action to clear messages
export const { clearMessage } = promoCodeRedeemSlice.actions;

// Export the reducer
export default promoCodeRedeemSlice.reducer;
