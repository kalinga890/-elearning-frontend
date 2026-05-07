import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCourses } from "../../api/courseAPI";

// Fetch all courses
export const fetchCourses = createAsyncThunk(
  "courses/fetchAll",
  async ({ page = 0, size = 10 } = {}) => {
    const response = await getAllCourses(page, size);
    return response.data;
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    items: [],
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentPage } = courseSlice.actions;
export default courseSlice.reducer;