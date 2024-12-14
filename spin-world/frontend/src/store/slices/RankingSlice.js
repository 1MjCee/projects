import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

// Thunk to fetch user ranking
export const fetchUserRankings = createAsyncThunk(
  "ranking/fetchUserRankings",
  async () => {
    const response = await api.get("/api/ranking-users/");
    return response.data;
  }
);

// Thunk to fetch all rankings
export const fetchAllRankings = createAsyncThunk(
  "ranking/fetchAllRankings",
  async () => {
    const response = await api.get("/api/rankings/");
    return response.data;
  }
);

const rankingSlice = createSlice({
  name: "ranking",
  initialState: {
    userRanking: null,
    allRankings: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRankings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserRankings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userRanking = action.payload;
      })
      .addCase(fetchUserRankings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllRankings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllRankings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allRankings = action.payload;
      })
      .addCase(fetchAllRankings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default rankingSlice.reducer;
