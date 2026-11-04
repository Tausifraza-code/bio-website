
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getMe } from "../redux/slice/authSlice";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const verificationStarted = useRef(false);

  const {
    token,
    user,
    getMeLoading,
    getMeError,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      verificationStarted.current = false;
      return;
    }

    if (
      !user &&
      !getMeLoading &&
      !getMeError &&
      !verificationStarted.current
    ) {
      verificationStarted.current = true;
      dispatch(getMe());
    }
  }, [token, user, getMeLoading, getMeError, dispatch]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (getMeLoading || (!user && !getMeError)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1b30]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          <p className="mt-4 text-sm text-cyan-300">
            Verifying your account...
          </p>
        </div>
      </div>
    );
  }

  if (getMeError && !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
