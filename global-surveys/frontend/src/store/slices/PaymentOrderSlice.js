import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

// Define initial state
const initialState = {
  predefinedAmounts: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  selectedAmount: 100,
  selectedCryptocurrency: "BTC",
  selectedCurrency: "USD",
  loading: false,
  invoiceUrl: null,
  paymentStatus: null,
  orderId: null,
  error: null,
  cryptoCurrencies: [],
  minAmount: null,
  fiatEquivalent: null,
  minloading: false,
  minerror: null,
  estimatedPrice: null,
  esloading: false,
  eserror: null,
};

// Async thunk to fetch available currencies from backend (Django)
export const fetchAvailableCurrencies = createAsyncThunk(
  "payment/fetchAvailableCurrencies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/payment/currencies/`);
      return response.data.currencies;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to create a payment order
export const createPaymentOrder = createAsyncThunk(
  "payment/createPaymentOrder",
  async ({ amount, currency, cryptocurrency }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/payment-orders/create_payment/`, {
        amount,
        currency,
        cryptocurrency,
      });
      console.log("Payment Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch minimum payment amount from backend API
export const fetchMinimumPaymentAmount = createAsyncThunk(
  "payment/fetchMinimumPaymentAmount",
  async ({ currencyFrom, currencyTo }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/payment/min-amount/`, {
        params: { currency_from: currencyFrom, currency_to: currencyTo },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch estimated price
export const fetchEstimatedPrice = createAsyncThunk(
  "payment/fetchEstimatedPrice",
  async ({ amount, currencyFrom, currencyTo }, { rejectWithValue }) => {
    try {
      const response = await api.get(`api/payment/estimated-price/`, {
        params: {
          amount,
          currency_from: currencyFrom,
          currency_to: currencyTo,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setAmount(state, action) {
      state.selectedAmount = action.payload;
    },
    setCryptocurrency(state, action) {
      state.selectedCryptocurrency = action.payload;
    },
    setCurrency(state, action) {
      state.selectedCurrency = action.payload;
    },
    resetPaymentState(state) {
      state.invoiceUrl = null;
      state.paymentStatus = null;
      state.orderId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableCurrencies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAvailableCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        state.cryptoCurrencies = action.payload;
      })
      .addCase(fetchAvailableCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch currencies";
      })
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceUrl = action.payload.invoice_url;
        state.orderId = action.payload.order_id;
        state.paymentStatus = "pending";
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Payment creation failed";
      })
      .addCase(fetchMinimumPaymentAmount.pending, (state) => {
        state.minloading = true;
        state.minerror = null;
      })
      .addCase(fetchMinimumPaymentAmount.fulfilled, (state, action) => {
        state.minloading = false;
        state.minAmount = action.payload.min_amount;
        state.fiatEquivalent = action.payload.fiat_equivalent;
      })
      .addCase(fetchMinimumPaymentAmount.rejected, (state, action) => {
        state.minloading = false;
        state.minerror = action.payload || "Failed to fetch minimum amount";
      })
      .addCase(fetchEstimatedPrice.pending, (state) => {
        state.esloading = true;
        state.eserror = null;
      })
      .addCase(fetchEstimatedPrice.fulfilled, (state, action) => {
        state.esloading = false;
        state.estimatedPrice = action.payload.estimated_price;
      })
      .addCase(fetchEstimatedPrice.rejected, (state, action) => {
        state.esloading = false;
        state.eserror = action.payload || "Failed to fetch estimated price";
      });
  },
});

export const { setAmount, setCryptocurrency, setCurrency, resetPaymentState } =
  paymentSlice.actions;

export default paymentSlice.reducer;
