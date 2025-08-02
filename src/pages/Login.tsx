import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// apis
import apis from "../apis";

// types
import { TypeUser } from "../types/User";
import { TypeInstance } from "../types/Instance";
import { TypeWorkspace } from "../types/Workspace";
import { ApiResponsePaginate } from "../types/Api";

// hooks
import useAsync from "../hooks/useAsync";
import useSystem from "../hooks/useSystem";
import useSounds from "../hooks/useSounds";
import useSchema from "../hooks/useSchema";
import useTranslate from "../hooks/useTranslate";

// components
import { Input } from "../components/inputs/Input";
import Wrapper from "../components/wrapper/Wrapper";
import { Center, Horizontal, Vertical } from "../components/aligns/Align";

// TODO: get favicon and title
// TODO: background color by instance primary and secondary
const Login = function () {
  const {
    token,
    user,
    instance,
    setUsers,
    saveToken,
    saveUser,
    saveInstance,
    saveWorkspaces,
    saveVersion,
  } = useSystem();
  const play = useSounds();
  const t = useTranslate();
  const Schema = useSchema();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    instance: "",
    username: "",
    password: "",
  });

  // redirect if logged
  useEffect(function () {
    const hasToken = token && typeof token === "string" && token.length === 36;
    const hasUser =
      user && typeof user === "object" && Object.keys(user).length;
    if (hasToken && hasUser) navigate("/f");
    return;
  }, []);

  // fetch instance by subdomain
  useAsync(async function () {
    try {
      const host = window.location.hostname;
      const parts = host.split(".");
      const subdomain = parts?.[0];
      if (subdomain && parts.length >= 3) {
        const response = await apis.Instance.search<TypeInstance>(subdomain);
        if (!response.data?.result) return;
        const favicon: HTMLLinkElement | null =
          document.querySelector("link[rel*='icon']");
        if (favicon) {
          favicon.type = "image/x-icon";
          favicon.rel = "shortcut icon";
          favicon.href = response.data.result?.favicon || "";
        }
        document.title = response.data.result?.companyName || "Forza Sistemas";
        saveInstance(response.data.result);
        setForm({
          ...form,
          instance: response.data.result.name,
        });
      }
    } catch (err) {
      console.error("[src/pages/Login.tsx]", err);
    }
  }, []);

  const OnSubmit = async function (event: React.FormEvent) {
    setLoading(true);
    event.preventDefault();
    const toastId = toast.loading(t.components.loading);
    try {
      // fetch instance
      const responseInstance = await apis.Instance.search<TypeInstance>(
        form.instance,
      );
      if (!responseInstance?.data?.result) {
        play("alert");
        toast.dismiss(toastId);
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_instance,
        });
        return;
      }

      // fetch login
      const responseLogin = await apis.Login<{ user: TypeUser; token: string }>(
        form.instance,
        {
          login: form.username,
          password: form.password,
        },
      );
      if (!responseLogin?.data?.result) {
        play("alert");
        toast.dismiss(toastId);
        toast.error(t.toast.warning_error, {
          description: t.stacks.wrong_credentials,
        });
        return;
      }

      // fetch workspace
      const responseWorkspace = await apis.Workspace.list<
        ApiResponsePaginate<TypeWorkspace>
      >(responseLogin.data.result.token, form.instance);
      if (!responseWorkspace?.data?.result?.items?.length) {
        play("alert");
        toast.dismiss(toastId);
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_workspace,
        });
        return;
      }

      // fetch users
      const responseUser = await apis.User.list<ApiResponsePaginate<TypeUser>>(
        responseLogin.data.result.token,
        form.instance,
      );
      if (!responseUser?.data?.result?.items?.length) {
        play("alert");
        toast.dismiss(toastId);
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_user,
        });
        return;
      }

      saveInstance(responseInstance.data?.result);
      saveToken(responseLogin.data.result.token);
      saveUser(responseLogin.data.result.user);
      saveWorkspaces(responseWorkspace.data.result.items);
      setUsers(responseUser.data.result.items);
      saveVersion(responseWorkspace.data.version);

      toast.success(t.toast.success, {
        description: t.toast.success_login,
      });
      play("login");
      navigate("/f");
      toast.dismiss(toastId);
      return;
    } catch (err) {
      toast.dismiss(toastId);
      play("alert");
      if (err instanceof AxiosError) {
        console.error("[src/pages/Login.tsx]", err.response?.data.result);
        if (err.response?.data?.result?.message === "invalid_credentials")
          toast.error(t.toast.warning_error, {
            description: t.stacks.wrong_credentials,
          });
        if (err.response?.data?.result?.message === "wrong_password")
          toast.error(t.toast.warning_error, {
            description: t.stacks.wrong_credentials,
          });
        if (err.response?.data?.result?.message === "instance_no_exist")
          toast.error(t.toast.warning_error, {
            description: t.stacks.no_instance,
          });
        if (err.response?.data?.result?.message === "no_exist_instance")
          toast.error(t.toast.warning_error, {
            description: t.stacks.no_instance,
          });
        if (err.response?.data?.result?.message === "schema_incorrect")
          Schema(err.response.data.result.err);
        return;
      }
      console.error("[src/pages/Login.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center
      styles={{
        background: instance?.colorPrimary || "var(--backgroundColor)",
        backgroundImage: `radial-gradient(ellipse at 20% 20%, #fafafa 0%, transparent 70%),
  radial-gradient(ellipse at 60% 20%, ${instance?.colorPrimary || "var(--backgroundColor)"} 0%, transparent 70%),
  radial-gradient(ellipse at 100% 20%, #fafafa 0%, transparent 70%),
  radial-gradient(ellipse at 100% 100%, #fafafa 0%, transparent 70%),
  radial-gradient(ellipse at 20% 100%, ${instance?.colorPrimary || "var(--backgroundColor)"} 0%, transparent 70%)`,
      }}
    >
      <form onSubmit={OnSubmit}>
        <Wrapper
          styles={{ width: "35rem" }}
          actions={[
            {
              type: "button",
              disabled: loading,
              category: "Neutral",
              text: t.login.forgot_password,
              onClick: function () {
                toast.message("Forgot Password!");
                return;
              },
            },
            {
              type: "submit",
              disabled: loading,
              category: "Success",
              text: t.login.login,
            },
          ]}
        >
          <Vertical internal={1}>
            {instance && instance?.logoLarge && (
              <Horizontal className="justify-center">
                <img
                  alt="logo large"
                  style={{ height: "6rem" }}
                  src={instance.logoLarge}
                />
              </Horizontal>
            )}
            {!instance?.name && (
              <Input
                required
                name="instance"
                id="login_instance"
                placeholder="johndoe"
                value={form.instance}
                label={t.login.instance}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.instance = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
            )}
            <Input
              required
              type="email"
              name="username"
              id="login_username"
              value={form.username}
              label={t.login.username}
              placeholder="johndoe@mail.com"
              onChange={function (event) {
                const newForm = { ...form };
                newForm.username = event.currentTarget?.value || "";
                setForm(newForm);
                return;
              }}
            />
            <Input
              required
              name="password"
              type="password"
              id="login_password"
              placeholder="********"
              value={form.password}
              label={t.login.password}
              onChange={function (event) {
                const newForm = { ...form };
                newForm.password = event.currentTarget?.value || "";
                setForm(newForm);
                return;
              }}
            />
          </Vertical>
        </Wrapper>
      </form>
    </Center>
  );
};

export default Login;
