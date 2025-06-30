import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// hooks
import { useSession } from "./useSession";

const useAuth = function () {
  const navigate = useNavigate();
  const { token, user, logout } = useSession();

  useEffect(function () {
    if (!token || !user) {
      navigate("/");
      logout();
      return;
    }
    if (location.pathname === "/" && token && user) {
      navigate("/f/dashboard");
      return;
    }
    return;
  }, []);

  return;
};

export default useAuth;
