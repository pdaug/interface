import { toast } from "sonner";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

// apis
import apis from "../apis";

// layouts
import Menu from "./Menu";

// hooks
import useSystem from "../hooks/useSystem";
import useTranslate from "../hooks/useTranslate";

// components
import { Horizontal, Vertical } from "../components/aligns/Align";

const Container = function () {
  const t = useTranslate();
  const navigate = useNavigate();
  const { user, token, instance, clear } = useSystem();

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

  useEffect(function () {
    if (!instance || !token) return;
    apis.Session.check<Record<string, unknown>>(instance.name, token, { token })
      .then(function (response) {
        if (!response.data?.result?.id) {
          clear();
          toast(t.error.session_expired);
          navigate("/");
        }
        return;
      })
      .catch(function (err) {
        if (err instanceof AxiosError) {
          clear();
          toast(t.error.session_expired);
          navigate("/");
          return;
        }
        console.error("[src/layouts/Container.tsx]", err);
        return;
      });
    return;
  }, []);

  return (
    <Horizontal styles={{ height: "100vh" }}>
      <Menu />
      <Vertical
        internal={2}
        styles={{ padding: "1rem", flex: 1, overflowY: "scroll" }}
      >
        {user && token ? <Outlet /> : <Navigate to="/" />}
      </Vertical>
    </Horizontal>
  );
};

export default Container;
