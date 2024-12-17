import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, {
  setTokenInLocalStorage,
  getTokenFromLocalStorage,
} from "@/app/utils/api";
import { jwtDecode } from "jwt-decode";

// THIS SECTION DEFINES THE INITIAL STATE
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  registrationSuccess: false,
};

// Thunk for complete registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, invite_code, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/registration/register/", {
        username,
        email,
        invite_code,
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Thunk to Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/login/", {
        email,
        password,
      });

      const { access, refresh } = response.data;

      // Use the setTokenInLocalStorage function to store the tokens
      setTokenInLocalStorage(access, "access");
      setTokenInLocalStorage(refresh, "refresh");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response
          ? error.response.data
          : "Something went wrong during login"
      );
    }
  }
);

// THIS SECTION DEFINES SLICES
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.access;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.loading = true;
      state.registrationSuccess = false;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.loading = false;
      state.registrationSuccess = true;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.registrationSuccess = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.registrationSuccess = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationSuccess = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registrationSuccess = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = jwtDecode(action.payload.access);
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
} = authSlice.actions;

export default authSlice.reducer;
