import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../api/api";

// --------------------------------------------------
// Fetch My Applications
// --------------------------------------------------

export const fetchMyApplications =
  createAsyncThunk(
    "applications/fetchMyApplications",

    async (
      params = {},
      {
        rejectWithValue,
      },
    ) => {
      try {
        const response =
          await api.get(
            "/applications/my",
            {
              params,
            },
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to load applications",
        );
      }
    },
  );

// --------------------------------------------------
// Fetch One Application
// --------------------------------------------------

export const fetchMyApplicationById =
  createAsyncThunk(
    "applications/fetchMyApplicationById",

    async (
      applicationId,
      {
        rejectWithValue,
      },
    ) => {
      try {
        const response =
          await api.get(
            `/applications/my/${applicationId}`,
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to load application",
        );
      }
    },
  );

// --------------------------------------------------
// Withdraw Application
// --------------------------------------------------

export const withdrawMyApplication =
  createAsyncThunk(
    "applications/withdrawMyApplication",

    async (
      applicationId,
      {
        rejectWithValue,
      },
    ) => {
      try {
        const response =
          await api.patch(
            `/applications/my/${applicationId}/withdraw`,
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to withdraw application",
        );
      }
    },
  );

// --------------------------------------------------
// State
// --------------------------------------------------

const initialState = {
  applications: [],

  currentApplication: null,

  page: 1,
  pages: 1,
  total: 0,
  limit: 10,

  loading: false,
  detailsLoading: false,
  withdrawingId: null,

  error: "",
  message: "",
};

// --------------------------------------------------
// Slice
// --------------------------------------------------

const applicationsSlice =
  createSlice({
    name: "applications",

    initialState,

    reducers: {
      clearApplicationFeedback: (
        state,
      ) => {
        state.error = "";
        state.message = "";
      },

      clearCurrentApplication: (
        state,
      ) => {
        state.currentApplication =
          null;
      },
    },

    extraReducers:
      (builder) => {
        builder

          // ----------------------------------------
          // List
          // ----------------------------------------

          .addCase(
            fetchMyApplications.pending,
            (state) => {
              state.loading =
                true;

              state.error = "";
            },
          )

          .addCase(
            fetchMyApplications.fulfilled,
            (
              state,
              action,
            ) => {
              state.loading =
                false;

              state.applications =
                action.payload
                  .applications ||
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
            fetchMyApplications.rejected,
            (
              state,
              action,
            ) => {
              state.loading =
                false;

              state.error =
                action.payload ||
                "Failed to load applications";
            },
          )

          // ----------------------------------------
          // Details
          // ----------------------------------------

          .addCase(
            fetchMyApplicationById.pending,
            (state) => {
              state.detailsLoading =
                true;

              state.error =
                "";

              state.currentApplication =
                null;
            },
          )

          .addCase(
            fetchMyApplicationById.fulfilled,
            (
              state,
              action,
            ) => {
              state.detailsLoading =
                false;

              state.currentApplication =
                action.payload
                  .application;
            },
          )

          .addCase(
            fetchMyApplicationById.rejected,
            (
              state,
              action,
            ) => {
              state.detailsLoading =
                false;

              state.error =
                action.payload ||
                "Failed to load application";
            },
          )

          // ----------------------------------------
          // Withdraw
          // ----------------------------------------

          .addCase(
            withdrawMyApplication.pending,
            (
              state,
              action,
            ) => {
              state.withdrawingId =
                action.meta.arg;

              state.error = "";
              state.message = "";
            },
          )

          .addCase(
            withdrawMyApplication.fulfilled,
            (
              state,
              action,
            ) => {
              state.withdrawingId =
                null;

              const updated =
                action.payload
                  .application;

              state.applications =
                state.applications.map(
                  (application) =>
                    application._id ===
                    updated._id
                      ? {
                          ...application,
                          ...updated,
                        }
                      : application,
                );

              if (
                state
                  .currentApplication
                  ?._id ===
                updated._id
              ) {
                state.currentApplication =
                  updated;
              }

              state.message =
                action.payload
                  .message ||
                "Application withdrawn successfully";
            },
          )

          .addCase(
            withdrawMyApplication.rejected,
            (
              state,
              action,
            ) => {
              state.withdrawingId =
                null;

              state.error =
                action.payload ||
                "Failed to withdraw application";
            },
          );
      },
  });

export const {
  clearApplicationFeedback,
  clearCurrentApplication,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;