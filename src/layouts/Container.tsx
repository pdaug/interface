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
  const { instance, token, user } = useSystem();

  useEffect(function () {
    if (!instance) return;
    const link: HTMLLinkElement =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = instance.favicon as string;
    document.title = instance.companyName as string;
    document.head.appendChild(link);
    return;
  }, []);

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
