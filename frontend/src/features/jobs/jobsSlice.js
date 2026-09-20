import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../api/api";

// --------------------------------------------------
// Fetch Public Jobs
// --------------------------------------------------

export const fetchJobs =
  createAsyncThunk(
    "jobs/fetchJobs",

    async (
      params = {},
      {
        rejectWithValue,
      },
    ) => {
      try {
        const response =
          await api.get(
            "/jobs",
            {
              params,
            },
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to load jobs",
        );
      }
    },
  );

// --------------------------------------------------
// Initial State
// --------------------------------------------------

const initialState = {
  jobs: [],

  page: 1,
  pages: 1,
  total: 0,
  limit: 12,

  loading: false,
  error: "",
};

// --------------------------------------------------
// Slice
// --------------------------------------------------

const jobsSlice =
  createSlice({
    name: "jobs",

    initialState,

    reducers: {
      clearJobsError: (
        state,
      ) => {
        state.error = "";
      },
    },

    extraReducers:
      (builder) => {
        builder

          .addCase(
            fetchJobs.pending,
            (state) => {
              state.loading =
                true;

              state.error = "";
            },
          )

          .addCase(
            fetchJobs.fulfilled,
            (
              state,
              action,
            ) => {
              state.loading =
                false;

              state.jobs =
                action.payload.jobs ||
                [];

              state.page =
                action.payload.page ||
                1;

              state.pages =
                action.payload.pages ||
                1;

              state.total =
                action.payload.total ||
                0;

              state.limit =
                action.payload.limit ||
                12;
            },
          )

          .addCase(
            fetchJobs.rejected,
            (
              state,
              action,
            ) => {
              state.loading =
                false;

              state.jobs = [];

              state.error =
                action.payload ||
                "Failed to load jobs";
            },
          );
      },
  });

export const {
  clearJobsError,
} = jobsSlice.actions;

export default jobsSlice.reducer;