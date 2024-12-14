// paymentSlice.js (Redux)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define initial state
const initialState = {
  currencies: [],
  selectedCurrency: "",
  selectedCryptocurrency: "BTC",
  amount: null,
  loading: false,
  error: null,
  invoiceUrl: null,
  paymentStatus: null,
};

// Action to fetch available currencies from Django backend
export const fetchCurrencies = createAsyncThunk(
  "payment/fetchCurrencies",
  async () => {
    const response = await axios.get("/api/payment/currencies/");
    return response.data.currencies;
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setSelectedCurrency: (state, action) => {
      state.selectedCurrency = action.payload;
    },
    setSelectedCryptocurrency: (state, action) => {
      state.selectedCryptocurrency = action.payload;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies = action.payload;
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setAmount,
  setSelectedCurrency,
  setSelectedCryptocurrency,
  setPaymentStatus,
} = paymentSlice.actions;

export default paymentSlice.reducer;
