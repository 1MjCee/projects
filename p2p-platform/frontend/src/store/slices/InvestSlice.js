import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

// Async thunk for buying an investment
export const buyInvestment = createAsyncThunk(
  "investments/buyInvestment",
  async (investmentId, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/investment-plans/invest/", {
        investment_id: investmentId,
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the slice
const investmentSlice = createSlice({
  name: "investments",
  initialState: {},
  reducers: {},
});

// Export the reducer
export default investmentSlice.reducer;
