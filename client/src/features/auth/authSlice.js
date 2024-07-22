import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('https://gmap-clone.vercel.app/api/auth/register', userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.log(error.response.data)
      return rejectWithValue(error.response.data.msg);
    }
    console.log(error)
    return rejectWithValue(error.msg);
  }
  
});

export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('https://gmap-clone.vercel.app/api/auth/login', userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.msg);
    }
    return rejectWithValue(error.msg);
  }
  
});

const initialState = {
  user: null,
  token: null,
  status: 'idle', 
  error: null,
};



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(register.rejected,  (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
    .addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'succeeded';
      state.error = null;
    })
    .addCase(login.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },

});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
