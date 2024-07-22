// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (token, { rejectWithValue }) => {
    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        return rejectWithValue('Token expired');
      }
      const response = await axios.get('/api/auth/user', {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue('Invalid token');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add cases for login and register as needed
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
