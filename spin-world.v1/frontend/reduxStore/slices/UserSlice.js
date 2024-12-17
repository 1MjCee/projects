import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";

// Thunk to fetch user data
export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const response = await api.get("/api/users/me/");
  return response.data;
});

// Thunk to update user data
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userData, avatarFile }) => {
    const data = new FormData();

    // Append user data
    data.append("username", userData.username);
    if (userData.email) {
      data.append("email", userData.email);
    }

    // If an avatar file is provided, append it to the FormData
    if (avatarFile) {
      data.append("avatar", avatarFile);
    }

    // Send the request to update user data
    const response = await api.put("/api/users/me/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
