import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

// Async thunk to fetch country data
export const fetchCountries = createAsyncThunk(
  "countries/fetchCountries",
  async () => {
    const response = await api.get("/api/countries/");
    return response.data;
  }
);

const countrySlice = createSlice({
  name: "countries",
  initialState: {
    countries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the selector to get countries
export const selectCountries = (state) => state.countries.countries;

// Export the reducer
export default countrySlice.reducer;
