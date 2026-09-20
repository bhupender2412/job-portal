import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

function RecruiterRoute() {
  const {
    user,
    isAuthenticated,
  } = useSelector(
    (state) =>
      state.auth,
  );

  if (
    !isAuthenticated
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    user?.role !==
    "recruiter"
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

export default RecruiterRoute;