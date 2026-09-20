import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../api/api";

const storedToken =
  localStorage.getItem(
    "jobPortalToken",
  );

// --------------------------------------------------
// Register
// --------------------------------------------------

export const registerUser =
  createAsyncThunk(
    "auth/registerUser",

    async (
      userData,
      {
        rejectWithValue,
      },
    ) => {
      try {
        const response =
          await api.post(
            "/auth/register",
            userData,
          );

        return response.data;
      } catch (error) {
        const responseData =
          error.response?.data;

        return rejectWithValue({
          message:
            responseData?.message ||
            "Unable to create account",

          errors:
            responseData?.errors ||
            [],
        });
      }
    },
  );

// --------------------------------------------------
// Login
// --------------------------------------------------

export const loginUser =
  createAsyncThunk(
    "auth/loginUser",

    async (
      credentials,
      {
        rejectWithValue,
      },
    ) => {
      try {
        const response =
          await api.post(
            "/auth/login",
            credentials,
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Unable to login",
        );
      }
    },
  );

// --------------------------------------------------
// Verify Existing Session
// --------------------------------------------------

export const verifySession =
  createAsyncThunk(
    "auth/verifySession",

    async (
      _,
      {
        rejectWithValue,
      },
    ) => {
      try {
        const response =
          await api.get(
            "/auth/me",
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Session expired",
        );
      }
    },
  );

// --------------------------------------------------
// Initial State
// --------------------------------------------------

const initialState = {
  user: null,

  token:
    storedToken || null,

  isAuthenticated:
    false,

  initialized:
    !storedToken,

  loading:
    false,

  error: "",
};

// --------------------------------------------------
// Auth Slice
// --------------------------------------------------

const authSlice =
  createSlice({
    name: "auth",

    initialState,

    reducers: {
      setAuth: (
        state,
        action,
      ) => {
        const {
          token,
          user,
        } = action.payload;

        state.token =
          token;

        state.user =
          user;

        state.isAuthenticated =
          true;

        state.initialized =
          true;

        state.loading =
          false;

        state.error =
          "";

        localStorage.setItem(
          "jobPortalToken",
          token,
        );
      },

      logout: (
        state,
      ) => {
        state.user =
          null;

        state.token =
          null;

        state.isAuthenticated =
          false;

        state.initialized =
          true;

        state.loading =
          false;

        state.error =
          "";

        localStorage.removeItem(
          "jobPortalToken",
        );
      },

      clearAuthError: (
        state,
      ) => {
        state.error =
          "";
      },
    },

    extraReducers:
      (builder) => {
        builder

          // ----------------------------------------
          // Register
          // ----------------------------------------

          .addCase(
            registerUser.pending,
            (state) => {
              state.loading =
                true;

              state.error =
                "";
            },
          )

          .addCase(
            registerUser.fulfilled,
            (
              state,
              action,
            ) => {
              state.loading =
                false;

              state.initialized =
                true;

              state.isAuthenticated =
                true;

              state.token =
                action.payload.token;

              state.user =
                action.payload.user;

              state.error =
                "";

              localStorage.setItem(
                "jobPortalToken",
                action.payload.token,
              );
            },
          )

          .addCase(
            registerUser.rejected,
            (
              state,
              action,
            ) => {
              state.loading =
                false;

              state.error =
                action.payload
                  ?.message ||
                "Unable to create account";
            },
          )

          // ----------------------------------------
          // Login
          // ----------------------------------------

          .addCase(
            loginUser.pending,
            (state) => {
              state.loading =
                true;

              state.error =
                "";
            },
          )

          .addCase(
            loginUser.fulfilled,
            (
              state,
              action,
            ) => {
              state.loading =
                false;

              state.initialized =
                true;

              state.isAuthenticated =
                true;

              state.token =
                action.payload.token;

              state.user =
                action.payload.user;

              state.error =
                "";

              localStorage.setItem(
                "jobPortalToken",
                action.payload.token,
              );
            },
          )

          .addCase(
            loginUser.rejected,
            (
              state,
              action,
            ) => {
              state.loading =
                false;

              state.error =
                action.payload ||
                "Unable to login";
            },
          )

          // ----------------------------------------
          // Verify Session
          // ----------------------------------------

          .addCase(
            verifySession.pending,
            (state) => {
              state.loading =
                true;

              state.error =
                "";
            },
          )

          .addCase(
            verifySession.fulfilled,
            (
              state,
              action,
            ) => {
              state.loading =
                false;

              state.initialized =
                true;

              state.isAuthenticated =
                true;

              state.user =
                action.payload.user;

              state.error =
                "";
            },
          )

          .addCase(
            verifySession.rejected,
            (
              state,
              action,
            ) => {
              state.loading =
                false;

              state.initialized =
                true;

              state.isAuthenticated =
                false;

              state.user =
                null;

              state.token =
                null;

              state.error =
                action.payload ||
                "Session expired";

              localStorage.removeItem(
                "jobPortalToken",
              );
            },
          );
      },
  });

// --------------------------------------------------
// Exports
// --------------------------------------------------

export const {
  setAuth,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;