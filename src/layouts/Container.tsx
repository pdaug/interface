import { toast } from "sonner";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

// layouts
import Menu from "./Menu";

// apis
import apis from "../apis";

// hooks
import useSystem from "../hooks/useSystem";
import useTranslate from "../hooks/useTranslate";

// components
import { useDialog } from "../components/dialogs/Dialog";
import { InputSelect } from "../components/inputs/Input";
import { Horizontal, Vertical } from "../components/aligns/Align";

const Container = function () {
  const {
    user,
    token,
    instance,
    workspaces,
    workspaceId,
    clear,
    selectWorkspace,
  } = useSystem();
  const t = useTranslate();
  const navigate = useNavigate();
  const { OpenDialog, CloseDialog } = useDialog();

  // verify has user and token
  const invalidToken =
    !token || typeof token !== "string" || token.length !== 36;
  const invalidUser =
    !user || typeof user !== "object" || !Object.keys(user).length;
  if (invalidUser || invalidToken) return <Navigate to="/" />;

  // select workspace
  useEffect(
    function () {
      if (workspaceId) {
        CloseDialog();
        return;
      }
      OpenDialog({
        category: "Success",
        title: t.dialog.title_workspace,
        description: (
          <InputSelect
            name="workspace"
            value={workspaceId}
            id="container_workspace_id"
            empty={t.stacks.no_option}
            label={t.workspace.workspaces}
            options={workspaces.map(function (workspace) {
              return {
                id: workspace.id,
                value: workspace.id,
                text: workspace.name,
              };
            })}
            onChange={function (event) {
              selectWorkspace(event.currentTarget.value || "");
              return;
            }}
          />
        ),
        cancelText: t.menu.logout,
        onCancel: function () {
          navigate("/");
          clear();
          CloseDialog();
          return;
        },
      });
      return;
    },
    [workspaceId],
  );

  // change style by instance
  useEffect(function () {
    if (!instance) return;
    const favicon: HTMLLinkElement | null =
      document.querySelector("link[rel*='icon']");
    if (!favicon) return;
    favicon.type = "image/x-icon";
    favicon.rel = "shortcut icon";
    favicon.href = instance.favicon as string;
    document.title = instance.companyName as string;
    return;
  }, []);

  // checker session
  useEffect(
    function () {
      apis.Session.check<Record<string, unknown>>(instance.name, token, {
        token,
      })
        .then(function (response) {
          // no data
          if (response.status !== 200 || !response.data?.result?.id) {
            toast.error(t.stacks.no_token);
            navigate("/");
            clear();
          }
          // expired
          if (
            response.status === 401 ||
            (typeof response.data.result.expiresAt === "string" &&
              new Date(response.data.result.expiresAt) < new Date())
          ) {
            toast.error(t.stacks.session_expired);
            navigate("/");
            clear();
          }
          return;
        })
        .catch(function (err) {
          console.error("[src/layouts/Container.tsx]", err);
          toast.error(t.stacks.session_expired);
          navigate("/");
          clear();
          return;
        });
      return;
    },
    [location.pathname],
  );

  return (
    <Horizontal styles={{ height: "100vh" }}>
      <Menu />
      <Vertical
        internal={1}
        styles={{ padding: "1rem", flex: 1, overflowY: "scroll" }}
      >
        <Outlet />
      </Vertical>
    </Horizontal>
  );
};

export default Container;
