import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const searchLocation = createAsyncThunk('maps/searchLocation', async (searchTerm, { getState }) => {
  const { auth } = getState();
  const response = await axios.post('http://localhost:4000/api/maps/search', { searchTerm }, {
    headers: { Authorization: auth.token },
  });
  return response.data;
});

export const getHistory = createAsyncThunk('maps/getHistory', async (_, { getState }) => {
  const { auth } = getState();
  const response = await axios.get('http://localhost:4000/api/maps/history', {
    headers: { Authorization: auth.token },
  });
  return response.data;
});

export const removeHistory = createAsyncThunk('maps/removeHistory', async (id, { getState }) => {
  const { auth } = getState();
  await axios.delete(`http://localhost:4000/api/maps/history/${id}`, {
    headers: { Authorization: auth.token },
  });
  return id;
});

const mapSlice = createSlice({
  name: 'maps',
  initialState: {
    searchResult: null,
    history: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearHistory: (state) => {
      state.history = [];
    },
    removeHistoryItem: (state, action) => {
      state.history = state.history.filter((_, index) => index !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(searchLocation.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(searchLocation.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.searchResult = action.payload.location;
      state.history.push(action.payload);
    })
    .addCase(searchLocation.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
    builder.addCase(getHistory.fulfilled, (state, action) => {
      state.history = action.payload;
    });
    builder.addCase(removeHistory.fulfilled, (state, action) => {
      state.history = state.history.filter(item => item._id !== action.payload);
    });
  },
});

export const { clearHistory, removeHistoryItem } = mapSlice.actions;
export default mapSlice.reducer;
