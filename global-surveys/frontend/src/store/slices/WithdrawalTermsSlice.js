import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../apis/api";


// Define an async thunk for fetching withdrawal terms
export const fetchWithdrawalTerms = createAsyncThunk(
  'withdrawalTerms/fetchWithdrawalTerms',
  async () => {
    const response = await api.get('/api/withdrawal-terms');
    return response.data;
  }
);

// Create the slice
const withdrawalTermsSlice = createSlice({
  name: 'withdrawalTerms',
  initialState: {
    terms: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdrawalTerms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawalTerms.fulfilled, (state, action) => {
        state.loading = false;
        state.terms = action.payload;
      })
      .addCase(fetchWithdrawalTerms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


// Export the reducer
export default withdrawalTermsSlice.reducer;
