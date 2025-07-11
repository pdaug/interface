import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// apis
import apis from "../apis";

// utils
import Schema from "../utils/Schema";

// types
import { TypeUser } from "../types/User";
import { TypeInstance } from "../types/Instance";
import { TypeWorkspace } from "../types/Workspace";
import { ApiResponsePaginate } from "../types/Api";

// hooks
import useAsync from "../hooks/useAsync";
import useSystem from "../hooks/useSystem";
import useTranslate from "../hooks/useTranslate";

// components
import { Input } from "../components/inputs/Input";
import Wrapper from "../components/wrapper/Wrapper";
import { Center, Horizontal, Vertical } from "../components/aligns/Align";

const Login = function () {
  const {
    token,
    user,
    instance,
    saveToken,
    saveUser,
    saveInstance,
    saveWorkspaces,
  } = useSystem();
  const t = useTranslate();
  const navigate = useNavigate();

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
        saveInstance(response.data.result);
      }
    } catch (err) {
      console.error("[src/pages/Login.tsx]", err);
    }
  }, []);

  const OnSubmit = async function (event: React.FormEvent) {
    event.preventDefault();
    try {
      // fetch instance
      const responseInstance = await apis.Instance.search<TypeInstance>(
        form.instance,
      );
      if (!responseInstance?.data?.result) {
        toast.error(t.stacks.no_instance);
        return;
      }
      saveInstance(responseInstance.data?.result);

      // fetch login
      const responseLogin = await apis.Login<{ user: TypeUser; token: string }>(
        form.instance,
        {
          login: form.username,
          password: form.password,
        },
      );
      if (!responseLogin?.data?.result) {
        toast.error(t.stacks.wrong_credentials);
        return;
      }

      // fetch workspace
      const responseWorkspace = await apis.Workspace.list<
        ApiResponsePaginate<TypeWorkspace>
      >(responseLogin.data.result.token, form.instance);
      if (!responseWorkspace?.data?.result?.items?.length) {
        toast.error(t.stacks.no_workspace);
        return;
      }

      saveToken(responseLogin.data.result.token);
      saveUser(responseLogin.data.result.user);
      saveWorkspaces(responseWorkspace?.data?.result?.items);

      toast.success(t.toast.success_login);
      navigate("/f");
      return;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error("[src/pages/Login.tsx]", err.response?.data.result);
        if (err.response?.data?.result?.message === "invalid_credentials")
          toast.error(t.stacks.wrong_credentials);
        if (err.response?.data?.result?.message === "instance_no_exist")
          toast.error(t.stacks.no_instance);
        if (err.response?.data?.result?.message === "schema_incorrect")
          Schema(err.response.data.result.err);
        return;
      }
      console.error("[src/pages/Login.tsx]", err);
      return;
    }
  };

  return (
    <Center>
      <form onSubmit={OnSubmit}>
        <Wrapper
          styles={{ width: "35rem" }}
          actions={[
            {
              type: "button",
              category: "Neutral",
              text: t.login.forgot_password,
              onClick: function () {
                toast.message("Forgot Password!");
                return;
              },
            },
            {
              type: "submit",
              category: "Success",
              text: t.login.login,
            },
          ]}
        >
          <Vertical internal={1}>
            {instance && instance.logoLarge && (
              <Horizontal styles={{ justifyContent: "center" }}>
                <img
                  alt="logo large"
                  style={{ height: "6rem" }}
                  src={instance.logoLarge}
                />
              </Horizontal>
            )}
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
            <Input
              required
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
