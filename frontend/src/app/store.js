import {
  configureStore,
} from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import jobsReducer from "../features/jobs/jobsSlice";
import savedJobsReducer from "../features/savedJobs/savedJobsSlice";
import applicationsReducer from "../features/applications/applicationsSlice";

export const store =
  configureStore({
    reducer: {
      auth:
        authReducer,

      jobs:
        jobsReducer,

      savedJobs:
        savedJobsReducer,

      applications:
        applicationsReducer,
    },
  });