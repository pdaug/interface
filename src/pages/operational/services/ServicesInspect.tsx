import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Asterisk } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// assets
import { ServiceMethods, ServiceType } from "../../../assets/Services";

// types
import {
  TypeService,
  TypeServiceMethod,
  TypeServiceType,
} from "../../../types/Service";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useSounds from "../../../hooks/useSounds";
import useSchema from "../../../hooks/useSchema";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputText,
  InputMoney,
  InputSelect,
} from "../../../components/inputs/Input";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Profile from "../../../components/profiles/Profile";
import Callout from "../../../components/callouts/Callout";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const ServicesInspect = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { user, users, token, instance, workspaces, workspaceId } = useSystem();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<TypeService>>({
    status: true,
    name: "",
    description: "",
    type: "physical",
    pricingValue: "0.00",
    pricingMethod: "hourly",
    tags: [],
    workspaceId,
    userId: user.id,
  });

  const userFinded = form.userId
    ? users.find(function (userLocal) {
        return form.userId === userLocal.id;
      })
    : null;

  // fetch service
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apis.Service.get(
        token,
        instance.name,
        id,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 200) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        navigate("/f/services");
        return;
      }
      setForm(response.data.result);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error(
        "[src/pages/operational/services/ServicesInspect.tsx]",
        err,
      );
      navigate("/f/services");
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      // is editing
      if (id) {
        const response = await apis.Service.update(
          token,
          instance.name,
          id,
          form,
          workspaceId,
        );
        if (!response.data?.result || response.status !== 200) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.toast.warning_edit,
          });
          return;
        }
        play("ok");
        toast.success(t.toast.success, {
          description: t.toast.success_edit,
        });
        navigate("/f/services");
        return;
      }
      // is creating
      const response = await apis.Service.create(
        token,
        instance.name,
        form,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 201) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_create,
        });
        return;
      }
      play("ok");
      toast.success(t.toast.success, {
        description: t.toast.success_create,
      });
      navigate("/f/services");
      return;
    } catch (err) {
      play("alert");
      console.error(
        "[src/pages/operational/services/ServicesInspect.tsx]",
        err,
      );
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
      return;
    }
  };

  return (
    <React.Fragment>
      <Horizontal>
        <h2>
          <Breadcrumb
            links={[
              {
                id: "workspace",
                label:
                  workspaces.find(function (workspace) {
                    return workspace.id === workspaceId;
                  })?.name || "",
                url: "/f/",
              },
              {
                id: "services",
                label: t.service.services,
                url: "/f/services",
              },
              {
                id: "service",
                label: form?.name || t.components.empty_name,
                url: `/f/services/inspect${id ? `/${id}` : ""}`,
              },
            ]}
          />
        </h2>
      </Horizontal>
      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
          <Wrapper
            title={id ? t.service.title_edit : t.service.title_create}
            description={t.service.subtitle}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="status"
                  id="service_status"
                  empty={t.stacks.no_option}
                  value={String(form.status)}
                  label={t.components.status}
                  disabled={loading && Boolean(id)}
                  options={[
                    {
                      id: "true",
                      value: "true",
                      text: t.components.active,
                    },
                    {
                      id: "false",
                      value: "false",
                      text: t.components.inactive,
                    },
                  ]}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.status = event.currentTarget?.value === "true";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={4}
                  max={32}
                  required
                  name="name"
                  id="service_name"
                  value={form?.name || ""}
                  label={t.service.name}
                  disabled={loading && Boolean(id)}
                  placeholder={t.service.name_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.name = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="type"
                  id="service_type"
                  label={t.service.type}
                  empty={t.stacks.no_option}
                  disabled={loading && Boolean(id)}
                  value={form?.type || "physical"}
                  options={ServiceType.map(function (option) {
                    return {
                      id: option,
                      value: option,
                      text: t.service[option as keyof typeof t.service],
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.type = (event.currentTarget?.value ||
                      "physical") as TypeServiceType;
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  required
                  name="pricingMethod"
                  empty={t.stacks.no_option}
                  id="service_pricing_method"
                  label={t.service.pricing_method}
                  disabled={loading && Boolean(id)}
                  value={form?.pricingMethod || "hourly"}
                  options={ServiceMethods.map(function (option) {
                    return {
                      id: option,
                      value: option,
                      text: t.service[option as keyof typeof t.service],
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.pricingMethod = (event.currentTarget?.value ||
                      "hourly") as TypeServiceMethod;
                    setForm(newForm);
                    return;
                  }}
                />
                <InputMoney
                  required
                  placeholder="0.00"
                  name="pricingValue"
                  id="service_pricing_value"
                  label={t.service.pricing_value}
                  disabled={loading && Boolean(id)}
                  value={form?.pricingValue || "0.00"}
                  onChange={function (value) {
                    const newForm = { ...form };
                    newForm.pricingValue = value;
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal>
                <InputText
                  max={256}
                  height={4}
                  name="description"
                  id="service_description"
                  value={form?.description || ""}
                  label={t.components.description}
                  disabled={loading && Boolean(id)}
                  placeholder={t.service.description_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.description = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              {Boolean(id) && (
                <Horizontal internal={1}>
                  <div
                    className="flex1"
                    style={{ alignItems: "flex-end", display: "flex" }}
                  >
                    <Profile
                      padding={false}
                      photo={userFinded?.photo || ""}
                      description={userFinded?.email || ""}
                      name={userFinded?.name || t.components.unknown}
                    />
                  </div>
                  <Input
                    readOnly
                    placeholder=""
                    name="createdAt"
                    id="service_created_at"
                    label={t.components.created_at}
                    value={instanceDateTime(form.createdAt)}
                    onChange={function () {
                      return;
                    }}
                  />
                  <Input
                    readOnly
                    placeholder=""
                    name="updatedAt"
                    id="service_updated_at"
                    label={t.components.updated_at}
                    value={
                      form?.updatedAt ? instanceDateTime(form.updatedAt) : "-"
                    }
                    onChange={function () {
                      return;
                    }}
                  />
                  <Input
                    readOnly
                    placeholder=""
                    name="deletedAt"
                    id="service_deleted_at"
                    label={t.components.deletedAt}
                    value={
                      form?.deletedAt ? instanceDateTime(form.deletedAt) : "-"
                    }
                    onChange={function () {
                      return;
                    }}
                  />
                </Horizontal>
              )}
            </Vertical>
          </Wrapper>

          <Callout
            Icon={Asterisk}
            category="Warning"
            text={t.callout.required_fields}
            styles={{ fontSize: "var(--textSmall)" }}
          />

          <Wrapper>
            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
              <Button
                type="button"
                category="Neutral"
                text={t.components.cancel}
                onClick={function () {
                  navigate("/f/services");
                  return;
                }}
              />
              <Button
                type="submit"
                category="Success"
                text={id ? t.components.edit : t.components.save}
              />
            </Horizontal>
          </Wrapper>
        </Vertical>
      </form>
    </React.Fragment>
  );
};

export default ServicesInspect;
