import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

const initialState = {
  max_spins: 0,
  spin_count: 0,
  is_eligible: false,
  loading: false,
  error: null,
};

// Async thunk to fetch spinner data from the backend
export const fetchSpinnerData = createAsyncThunk(
  "spinner/fetchSpinnerData",
  async () => {
    const response = await api.get("/api/spinners/");
    return response.data;
  }
);

// Async thunk to send spin data to the backend
export const sendSpinData = createAsyncThunk(
  "spinner/sendSpinData",
  async () => {
    const response = await api.post("/api/spinners/spin/");
    return response.data;
  }
);

const spinnerSlice = createSlice({
  name: "spinner",
  initialState,
  reducers: {
    setSpinnerData: (state, action) => {
      const { max_spins, spin_count, is_eligible } = action.payload[0] || {};
      state.max_spins = max_spins;
      state.spin_count = spin_count;
      state.is_eligible = is_eligible;
    },
    resetSpinner: (state) => {
      state.is_spinner = false;
      state.spin_count = 0;
      state.is_eligible = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpinnerData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpinnerData.fulfilled, (state, action) => {
        state.loading = false;
        const { max_spins, spin_count, is_eligible } = action.payload[0] || {};
        state.max_spins = max_spins;
        state.spin_count = spin_count;
        state.is_eligible = is_eligible;
      })
      .addCase(fetchSpinnerData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendSpinData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendSpinData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendSpinData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions
export const { setSpinnerData, resetSpinner } = spinnerSlice.actions;
export const selectSpinner = (state) => state.spinner;
export default spinnerSlice.reducer;
