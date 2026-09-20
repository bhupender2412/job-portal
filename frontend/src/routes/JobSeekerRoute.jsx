import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

function JobSeekerRoute() {
  const {
    user,
    isAuthenticated,
  } = useSelector(
    (state) => state.auth,
  );

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    user?.role !==
    "jobseeker"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}

export default JobSeekerRoute;