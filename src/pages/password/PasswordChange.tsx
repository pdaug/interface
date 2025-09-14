import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../apis";

// assets
import { Master } from "../../assets/Master";

// types
import { TypeUser } from "../../types/User";
import { TypeInstance } from "../../types/Instance";

// components
import { Input } from "../../components/inputs/Input";
import Wrapper from "../../components/wrapper/Wrapper";
import Profile from "../../components/profiles/Profile";
import { Center, Horizontal, Vertical } from "../../components/aligns/Align";

// hooks
import useAsync from "../../hooks/useAsync";
import useSounds from "../../hooks/useSounds";
import useSchema from "../../hooks/useSchema";
import useTranslate from "../../hooks/useTranslate";

const PasswordChange = function () {
  const { id } = useParams();
  const play = useSounds();
  const t = useTranslate();
  const Schema = useSchema();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [instance, setInstance] = useState<TypeInstance | null>(null);
  const [userRequest, setUserRequest] = useState<TypeUser | null>(null);
  const [passwordRequest, setPasswordRequest] = useState<Record<
    string,
    string
  > | null>(null);
  const [form, setForm] = useState({
    email: "",
    passwordOld: "",
    passwordNew: "",
    passwordConfirm: "",
  });

  const hasUpdated = passwordRequest && passwordRequest?.updatedAt;

  const hasExpired =
    passwordRequest && new Date() > new Date(passwordRequest?.expiresAt);

  // fetch instance
  useAsync(async function () {
    try {
      const host = window.location.hostname;
      const parts = host.split(".");
      const subdomain = parts?.[0];
      if (subdomain && parts.length >= 3) {
        const response = await apis.Instance.search<TypeInstance>(subdomain);
        if (!response.data?.result) {
          play("alert");
          toast.error(t.toast.warning_error, {
            description: t.stacks.no_instance,
          });
          console.error(
            "[src/pages/password/PasswordChange.tsx]",
            response.data?.result,
          );
          navigate("/");
          return;
        }
        const favicon: HTMLLinkElement | null =
          document.querySelector("link[rel*='icon']");
        if (favicon) {
          favicon.type = "image/x-icon";
          favicon.rel = "shortcut icon";
          favicon.href = response.data.result?.favicon || "";
        }
        document.title = response.data.result?.companyName || "Forza Sistemas";
        setInstance(response.data.result);
      } else {
        const response = await apis.Instance.search<TypeInstance>("test");
        if (!response.data?.result) {
          play("alert");
          toast.error(t.toast.warning_error, {
            description: t.stacks.no_instance,
          });
          console.error(
            "[src/pages/password/PasswordChange.tsx]",
            response.data?.result,
          );
          navigate("/");
          return;
        }
        const favicon: HTMLLinkElement | null =
          document.querySelector("link[rel*='icon']");
        if (favicon) {
          favicon.type = "image/x-icon";
          favicon.rel = "shortcut icon";
          favicon.href = response.data.result?.favicon || "";
        }
        document.title = response.data.result?.companyName || "Forza Sistemas";
        setInstance(response.data.result);
      }
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_instance,
      });
      console.error("[src/pages/password/PasswordChange.tsx]", err);
      navigate("/");
    }
    return;
  }, []);

  // fetch user
  useAsync(
    async function () {
      if (!id || !instance) return;
      try {
        const response = await apis.User.get<TypeUser>(
          Master.token,
          instance.name,
          id,
        );
        if (!response || !response.data) {
          play("alert");
          toast.error(t.toast.warning_error, {
            description: t.stacks.no_user,
          });
          console.error("[src/pages/password/PasswordChange.tsx]", response);
          navigate("/");
          return;
        }
        setForm(function (prevState) {
          const newForm = { ...prevState };
          newForm.email = response.data.result.email;
          return newForm;
        });
        setUserRequest(response.data.result);
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_user,
        });
        console.error("[src/pages/password/PasswordChange.tsx]", err);
        navigate("/");
      }
      return;
    },
    [id, instance],
  );

  // fetch request
  useAsync(
    async function () {
      if (!id || !instance) return;
      setLoading(true);
      try {
        const response = await apis.Password.getRequest<Record<string, string>>(
          instance.name,
          Master.token,
          id,
        );
        if (!response || !response?.data) {
          play("alert");
          toast.error(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          console.error("[src/pages/password/PasswordChange.tsx]", response);
          navigate("/");
          return;
        }
        setPasswordRequest(response.data.result);
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error("[src/pages/password/PasswordChange.tsx]", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    },
    [id, instance],
  );

  const OnSubmit = async function (event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    if (!id || !instance) return;
    try {
      if (form.passwordNew !== form.passwordConfirm) {
        play("alert");
        console.error("[src/pages/password/PasswordChange.tsx]", form);
        toast.error(t.toast.warning_error, {
          description: t.password.confirm_wrong,
        });
        return;
      }
      const response = await apis.Password.change(instance.name, Master.token, {
        userId: id,
        passwordNew: form.passwordNew,
        passwordOld: form.passwordOld,
      });
      if (!response || !response.data) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error("[src/pages/password/PasswordChange.tsx]", response);
        return;
      }
      play("ok");
      toast.success(t.toast.success, {
        description: t.password.password_changed,
      });
      navigate("/");
    } catch (err) {
      play("alert");
      console.error("[src/pages/password/PasswordChange.tsx]", err);
      if (
        err instanceof AxiosError &&
        err.response?.data?.result?.message === "schema_incorrect"
      ) {
        Schema(err.response.data.result.err);
        return;
      }
      toast.error(t.toast.warning_error, {
        description: id ? t.toast.error_edit : t.toast.error_create,
      });
    } finally {
      setLoading(false);
    }
    return;
  };

  return (
    <Center>
      <form onSubmit={OnSubmit}>
        {loading ? (
          <Wrapper styles={{ width: "40rem" }}>
            <Horizontal className="flex justifyCenter">
              <i style={{ fontSize: "var(--textSmall)", opacity: 0.6 }}>
                {t.components.loading}...
              </i>
            </Horizontal>
          </Wrapper>
        ) : passwordRequest ? (
          <React.Fragment>
            {hasUpdated ? (
              <Wrapper styles={{ width: "40rem" }}>
                <Horizontal className="flex justifyCenter">
                  <i style={{ fontSize: "var(--textSmall)", opacity: 0.6 }}>
                    {t.password.already_changed}
                  </i>
                </Horizontal>
              </Wrapper>
            ) : hasExpired ? (
              <Wrapper styles={{ width: "40rem" }}>
                <Horizontal className="flex justifyCenter">
                  <i style={{ fontSize: "var(--textSmall)", opacity: 0.6 }}>
                    {t.password.request_expired}
                  </i>
                </Horizontal>
              </Wrapper>
            ) : (
              <Wrapper
                title={t.password.title_change}
                description={t.password.subtitle_change}
                styles={{ width: "40rem" }}
                actions={[
                  {
                    type: "button",
                    disabled: loading,
                    category: "Neutral",
                    text: t.components.cancel,
                    onClick: function () {
                      navigate(`/f/users/inspect/${id}`);
                      return;
                    },
                  },
                  {
                    type: "submit",
                    disabled: loading,
                    category: "Success",
                    text: t.password.change,
                  },
                ]}
              >
                <Vertical internal={1}>
                  <Profile
                    photoSize={8}
                    padding={false}
                    name={userRequest?.name}
                    photo={userRequest?.photo || ""}
                    description={
                      t.components?.[userRequest?.role || "collaborator"] ||
                      t.components.unknown
                    }
                  />

                  <Input
                    required
                    readOnly
                    type="email"
                    name="email"
                    id="login_email"
                    value={form.email}
                    label={t.password.email}
                    placeholder={t.password.email_placeholder}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.email = event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />

                  <Input
                    required
                    type="password"
                    name="passwordOld"
                    placeholder="********"
                    id="login_password_old"
                    value={form.passwordOld}
                    label={t.password.password_old}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.passwordOld = event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />

                  <Horizontal internal={1}>
                    <Input
                      required
                      type="password"
                      name="passwordNew"
                      placeholder="********"
                      id="login_password_new"
                      value={form.passwordNew}
                      label={t.password.password_new}
                      onChange={function (event) {
                        const newForm = { ...form };
                        newForm.passwordNew = event.currentTarget?.value || "";
                        setForm(newForm);
                        return;
                      }}
                    />

                    <Input
                      required
                      type="password"
                      name="passwordConfirm"
                      placeholder="********"
                      id="login_password_confirm"
                      value={form.passwordConfirm}
                      label={t.password.password_confirm}
                      onChange={function (event) {
                        const newForm = { ...form };
                        newForm.passwordConfirm =
                          event.currentTarget?.value || "";
                        setForm(newForm);
                        return;
                      }}
                    />
                  </Horizontal>
                </Vertical>
              </Wrapper>
            )}
          </React.Fragment>
        ) : (
          <Wrapper styles={{ width: "40rem" }}>
            <Horizontal className="flex justifyCenter">
              <i style={{ fontSize: "var(--textSmall)", opacity: 0.6 }}>
                {t.stacks.no_items}
              </i>
            </Horizontal>
          </Wrapper>
        )}
      </form>
    </Center>
  );
};

export default PasswordChange;
