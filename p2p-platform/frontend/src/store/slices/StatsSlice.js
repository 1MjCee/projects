import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

// Define the initial state
const initialState = {
  amountToBeWon: 0,
  customersToday: 0,
  totalCustomers: 0,
  status: "idle",
  error: null,
};

// Define an async thunk to fetch stats from Django backend
export const fetchStats = createAsyncThunk("stats/fetchStats", async () => {
  const response = await api.get("/api/stats/stats/");
  return response.data;
});

// Create a slice of state
const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add the fetched stats to the state
        state.amountToBeWon = action.payload.amountToBeWon;
        state.customersToday = action.payload.customersToday;
        state.totalCustomers = action.payload.totalCustomers;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the stats data selector
export const selectStats = (state) => state.stats;

export default statsSlice.reducer;
