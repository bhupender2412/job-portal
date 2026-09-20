import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../api/api";

// --------------------------------------------------
// Fetch Saved Jobs
// --------------------------------------------------

export const fetchSavedJobs =
  createAsyncThunk(
    "savedJobs/fetchSavedJobs",

    async (
      params = {},
      {
        rejectWithValue,
      },
    ) => {
      try {
        const response =
          await api.get(
            "/saved-jobs",
            {
              params,
            },
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to load saved jobs",
        );
      }
    },
  );

// --------------------------------------------------
// Remove Saved Job
// --------------------------------------------------

export const removeSavedJob =
  createAsyncThunk(
    "savedJobs/removeSavedJob",

    async (
      jobId,
      {
        rejectWithValue,
      },
    ) => {
      try {
        const response =
          await api.delete(
            `/saved-jobs/${jobId}`,
          );

        return {
          jobId,
          message:
            response.data.message,
        };
      } catch (error) {
        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to remove saved job",
        );
      }
    },
  );

// --------------------------------------------------
// State
// --------------------------------------------------

const initialState = {
  savedJobs: [],

  page: 1,
  pages: 1,
  total: 0,
  limit: 10,

  loading: false,

  removingId: null,

  error: "",

  message: "",
};

// --------------------------------------------------
// Slice
// --------------------------------------------------

const savedJobsSlice =
  createSlice({
    name: "savedJobs",

    initialState,

    reducers: {
      clearSavedJobsMessage: (
        state,
      ) => {
        state.message =
          "";

        state.error =
          "";
      },

      resetSavedJobs: (
        state,
      ) => {
        state.savedJobs =
          [];

        state.page = 1;
        state.pages = 1;
        state.total = 0;
        state.limit = 10;

        state.loading =
          false;

        state.removingId =
          null;

        state.error =
          "";

        state.message =
          "";
      },
    },

    extraReducers:
      (builder) => {
        builder

          // ----------------------------------------
          // Fetch
          // ----------------------------------------

          .addCase(
            fetchSavedJobs.pending,
            (state) => {
              state.loading =
                true;

              state.error =
                "";
            },
          )

          .addCase(
            fetchSavedJobs.fulfilled,
            (
              state,
              action,
            ) => {
              state.loading =
                false;

              state.savedJobs =
                action.payload
                  .savedJobs ||
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
                10;
            },
          )

          .addCase(
            fetchSavedJobs.rejected,
            (
              state,
              action,
            ) => {
              state.loading =
                false;

              state.error =
                action.payload ||
                "Failed to load saved jobs";
            },
          )

          // ----------------------------------------
          // Remove
          // ----------------------------------------

          .addCase(
            removeSavedJob.pending,
            (
              state,
              action,
            ) => {
              state.removingId =
                action.meta.arg;

              state.error =
                "";

              state.message =
                "";
            },
          )

          .addCase(
            removeSavedJob.fulfilled,
            (
              state,
              action,
            ) => {
              state.removingId =
                null;

              state.savedJobs =
                state.savedJobs.filter(
                  (saved) =>
                    saved.job?._id !==
                    action.payload.jobId,
                );

              state.total =
                Math.max(
                  0,
                  state.total -
                    1,
                );

              state.message =
                action.payload
                  .message ||
                "Job removed from saved jobs";
            },
          )

          .addCase(
            removeSavedJob.rejected,
            (
              state,
              action,
            ) => {
              state.removingId =
                null;

              state.error =
                action.payload ||
                "Failed to remove saved job";
            },
          );
      },
  });

export const {
  clearSavedJobsMessage,
  resetSavedJobs,
} = savedJobsSlice.actions;

export default savedJobsSlice.reducer;