import { toast } from "sonner";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

// apis
import apis from "../apis";

// utils
import Schema from "../utils/Schema";

// hooks
import useSystem from "../hooks/useSystem";
import useTranslate from "../hooks/useTranslate";

// components
import { Input } from "../components/inputs/Input";
import Wrapper from "../components/wrapper/Wrapper";
import { Center, Horizontal, Vertical } from "../components/aligns/Align";

const Login = function () {
  const t = useTranslate();
  const navigate = useNavigate();
  const { token, user, saveToken, saveUser } = useSystem();

  const [form, setForm] = useState({
    instance: "",
    username: "",
    password: "",
  });

  useEffect(function () {
    if (token && user) navigate("/f/dashboard");
    return;
  }, []);

  const OnSubmit = async function (event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await apis.Login<Record<string, unknown>>(
        form.instance,
        {
          login: form.username,
          password: form.password,
        },
      );
      if (!response || !response?.data || !response.data?.result) return;
      saveToken(response.data.result.token as string);
      saveUser(response.data.result.user as Record<string, unknown>);
      toast.success(t.login.success);
      navigate("/f/dashboard");
      return;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error("[src/pages/Login.tsx]", err.response?.data.result);
        if (err.response?.data?.result?.message === "invalid_credentials")
          toast.error(t.login.invalid_credentials);
        if (err.response?.data?.result?.message === "instance_no_exist")
          toast.error(t.login.instance_no_exist);
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
            {instance && (
              <Horizontal styles={{ justifyContent: "center" }}>
                <img
                  style={{ height: "6rem" }}
                  src={instance.logoLarge as string}
                  alt="logo large"
                />
              </Horizontal>
            )}
            <Input
              required
              id="login_instance"
              name="instance"
              label={t.login.instance}
              placeholder="johndoe"
              value={form.instance}
              onChange={function (event) {
                const newForm = { ...form };
                newForm.instance = event.currentTarget?.value || "";
                setForm(newForm);
                return;
              }}
            />
            <Input
              required
              id="login_username"
              name="username"
              label={t.login.username}
              placeholder="johndoe@mail.com"
              value={form.username}
              onChange={function (event) {
                const newForm = { ...form };
                newForm.username = event.currentTarget?.value || "";
                setForm(newForm);
                return;
              }}
            />
            <Input
              required
              id="login_password"
              name="password"
              type="password"
              label={t.login.password}
              placeholder="********"
              value={form.password}
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
