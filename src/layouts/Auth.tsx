import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

// hooks
import useSystem from "../hooks/useSystem";

const Auth = function () {
  const navigate = useNavigate();
  const { token, user } = useSystem();

  useEffect(function () {
    if (location.pathname === "/" && user && token) {
      navigate("/f/dashboard");
      return;
    }
    return;
  }, []);

  return user && token ? <Outlet /> : <Navigate to="/" />;
};

export default Auth;
