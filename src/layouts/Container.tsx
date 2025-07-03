import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

// layouts
import Menu from "./Menu";

// hooks
import useSystem from "../hooks/useSystem";

// components
import { Horizontal, Vertical } from "../components/aligns/Align";

const Container = function () {
  const navigate = useNavigate();
  const { token, user } = useSystem();

  useEffect(function () {
    if (!user || !token) navigate("/");
    return;
  }, []);

  return (
    <Horizontal styles={{ height: "100vh" }}>
      <Menu />
      <Vertical
        internal={1}
        styles={{ padding: "1rem", flex: 1, overflowY: "scroll" }}
      >
        {user && token ? <Outlet /> : <Navigate to="/" />}
      </Vertical>
    </Horizontal>
  );
};

export default Container;
