import { toast } from "sonner";
import { format } from "date-fns";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Asterisk } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../apis";

// utils
import Schema from "../../utils/Schema";

// types
import { TypeWorkspace } from "../../types/Workspace";

// assets
import { WorkspaceCategoryOptions } from "../../assets/Workspaces";

// hooks
import useAsync from "../../hooks/useAsync";
import useSystem from "../../hooks/useSystem";
import useTranslate from "../../hooks/useTranslate";

// components
import Button from "../../components/buttons/Button";
import Wrapper from "../../components/wrapper/Wrapper";
import Callout from "../../components/callouts/Callout";
import { Horizontal, Vertical } from "../../components/aligns/Align";
import { Input, InputSelect, InputText } from "../../components/inputs/Input";

const WorkspaceInspect = function () {
  const t = useTranslate();
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, instance } = useSystem();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<TypeWorkspace>>({
    status: true,
    name: "",
    description: "",
    category: "departments",
  });

  // fetch workspace
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apis.Workspace.get(token, instance.name, id);
      if (!response.data?.result) return;
      setForm(response.data.result);
      return;
    } catch (err) {
      console.error("[src/pages/workspaces/WorkspaceInspect.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmit = async function () {
    if (!instance || !token) return;
    try {
      // is editing
      if (id) {
        const response = await apis.Workspace.update(
          token,
          instance.name,
          id,
          form,
        );
        if (!response.data?.result) toast.warning(t.toast.warning_edit);
        if (response.data.state === "success") {
          toast.success(t.toast.success_edit);
          navigate("/f/workspaces");
        }
        return;
      }
      // is creating
      const response = await apis.Workspace.create(token, instance.name, form);
      if (!response.data?.result) toast.warning(t.toast.warning_create);
      if (response.data.state === "success") {
        toast.success(t.toast.success_create);
        navigate("/f/workspaces");
      }
      return;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data?.result?.message === "schema_incorrect") {
          Schema(err.response.data.result.err);
          return;
        }
      }
      if (id) toast.error(t.toast.error_edit);
      else toast.error(t.toast.error_create);
      console.error("[src/pages/workspaces/WorkspaceInspect.tsx]", err);
      return;
    }
  };

  return (
    <React.Fragment>
      <Horizontal>
        <h1>{t.workspace.workspaces}</h1>
      </Horizontal>
      <div>
        <Wrapper
          title={id ? t.workspace.title_edit : t.workspace.title_create}
          description={t.workspace.subtitle}
        >
          <Vertical internal={1}>
            <Horizontal internal={1}>
              <InputSelect
                required
                name="status"
                id="workspace_status"
                empty={t.stacks.no_option}
                value={String(form.status)}
                disabled={loading && Boolean(id)}
                label={t.workspace.status_label}
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
                min={1}
                max={32}
                required
                name="name"
                id="workspace_name"
                value={form?.name || ""}
                label={t.workspace.name}
                disabled={loading && Boolean(id)}
                placeholder={t.workspace.name_placeholder}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.name = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
              <InputSelect
                required
                name="category"
                id="workspace_category"
                label={t.components.category}
                empty={t.stacks.no_option}
                disabled={loading && Boolean(id)}
                value={form?.category || "departments"}
                options={WorkspaceCategoryOptions.map(function (option) {
                  return {
                    id: option,
                    value: option,
                    text: t.workspace[option as keyof typeof t.workspace],
                  };
                })}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.category = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
            </Horizontal>
            <Horizontal>
              <InputText
                max={256}
                name="description"
                id="workspace_description"
                value={form?.description || ""}
                label={t.components.description}
                disabled={loading && Boolean(id)}
                placeholder={t.workspace.description_placeholder}
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
                <Input
                  readOnly
                  placeholder=""
                  name="createdAt"
                  id="workspace_created_at"
                  label={t.components.created_at}
                  value={format(
                    new Date(form?.createdAt || 0),
                    "dd/MM/yyyy HH:mm:ss",
                  )}
                  onChange={function () {
                    return;
                  }}
                />
                <Input
                  readOnly
                  placeholder=""
                  name="updatedAt"
                  id="workspace_updated_at"
                  label={t.components.updated_at}
                  value={
                    form?.updatedAt
                      ? format(new Date(form?.updatedAt), "dd/MM/yyyy HH:mm:ss")
                      : "-"
                  }
                  onChange={function () {
                    return;
                  }}
                />
                <Input
                  readOnly
                  placeholder=""
                  name="deletedAt"
                  id="workspace_deleted_at"
                  label={t.components.deletedAt}
                  value={
                    form?.deletedAt
                      ? format(new Date(form?.deletedAt), "dd/MM/yyyy HH:mm:ss")
                      : "-"
                  }
                  onChange={function () {
                    return;
                  }}
                />
              </Horizontal>
            )}
            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
              <Button
                category="Neutral"
                text={t.components.cancel}
                onClick={function () {
                  navigate("/f/workspaces");
                  return;
                }}
              />
              <Button
                category="Success"
                onClick={onSubmit}
                text={id ? t.components.edit : t.components.save}
              />
            </Horizontal>
          </Vertical>
        </Wrapper>
      </div>
      <Callout
        Icon={Asterisk}
        category="Info"
        text={t.stacks.required_fields}
        styles={{ fontSize: "var(--textSmall)" }}
      />
    </React.Fragment>
  );
};

export default WorkspaceInspect;
