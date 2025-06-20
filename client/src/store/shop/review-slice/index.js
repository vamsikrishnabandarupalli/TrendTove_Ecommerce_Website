import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
  error: null,
};

// Add review thunk
export const addReview = createAsyncThunk(
  "review/addReview",
  async (formdata, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      const response = await axios.post(
        "http://localhost:5000/api/shop/review/add",
        formdata,
        {
          headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true 
        
        }
      );
      return response.data;
    } catch (error) {
      const errorData =
        error.response && error.response.data
          ? error.response.data
          : { message: "Add review failed" };
      return rejectWithValue(errorData);
    }
  }
);

// Get reviews thunk
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

// Slice
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
