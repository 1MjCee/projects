import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";

// Define the initial state
const initialState = {
  loading: false,
  error: null,
  success: null,
};

// Async thunk to change the password
export const changePassword = createAsyncThunk(
  "password/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.put("/api/users/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the change password slice
const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = "Password changed successfully!";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to change password";
      });
  },
});

// Export actions and reducer
export const { clearState } = changePasswordSlice.actions;
export default changePasswordSlice.reducer;
