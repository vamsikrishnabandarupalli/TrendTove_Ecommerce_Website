import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
  error: null,
};

export const addReview = createAsyncThunk(
  "shop/addReview",
  async ({ productId, userId, userName, reviewMessage, reviewValue }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = (state.auth && state.auth.token) || localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/shop/review/add",
        {
          productId,
          userId,
          userName,
          reviewMessage,
          reviewValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getReviews = createAsyncThunk(
  "review/getReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/shop/review/" + productId
      );
      return response.data;
    } catch (error) {
      const errorData =
        error.response && error.response.data
          ? error.response.data
          : { message: "Fetch reviews failed" };
      return rejectWithValue(errorData);
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
        state.error = null;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
        state.error =
          action.payload && action.payload.message
            ? action.payload.message
            : "Failed to fetch reviews";
      })
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews.push(action.payload.data);
        state.error = null;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload && action.payload.message
            ? action.payload.message
            : "Failed to add review";
      });
  },
});

export default reviewSlice.reducer;
