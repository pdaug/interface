import React, { useState } from "react";
import { Asterisk } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../apis";

// types
import { TypeWorkspace } from "../../types/Workspace";

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

export const WorkspaceCategoryOptions = [
  "units",
  "teams",
  "offices",
  "centers",
  "agencies",
  "branches",
  "sections",
  "divisions",
  "operations",
  "departments",
  "subsidiaries",
];

const WorkspaceInspect = function () {
  const t = useTranslate();
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, instance } = useSystem();

  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<TypeWorkspace>>({
    status: true,
    name: "",
    description: "",
    category: "departments",
  });

  useAsync(async function () {
    if (!isEditing || !instance || !token || !id) return;
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
      if (isEditing && id) {
        const response = await apis.Workspace.update(
          token,
          instance.name,
          id,
          form,
        );
        console.log(response.data);
        return;
      }
      const response = await apis.Workspace.create(token, instance.name, form);
      console.log(response.data);
      return;
    } catch (err) {
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
          title={isEditing ? t.workspace.title_edit : t.workspace.title_create}
          description={t.workspace.subtitle}
        >
          <Vertical internal={1}>
            <Horizontal internal={1}>
              <InputSelect
                required
                name="status"
                id="workspace_status"
                empty={t.workspace.empty}
                value={String(form.status)}
                disabled={loading && isEditing}
                label={t.workspace.status_label}
                options={[
                  {
                    id: "true",
                    value: "true",
                    text: t.workspace.active,
                  },
                  {
                    id: "false",
                    value: "false",
                    text: t.workspace.inactive,
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
                disabled={loading && isEditing}
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
                empty={t.workspace.empty}
                label={t.workspace.category}
                disabled={loading && isEditing}
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
                label={t.workspace.description}
                disabled={loading && isEditing}
                placeholder={t.workspace.description_placeholder}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.description = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
            </Horizontal>
            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
              <Button
                category="Neutral"
                text={t.workspace.cancel}
                onClick={function () {
                  navigate("/f/workspaces");
                  return;
                }}
              />
              <Button
                category="Success"
                onClick={onSubmit}
                text={isEditing ? t.workspace.edit : t.workspace.save}
              />
            </Horizontal>
          </Vertical>
        </Wrapper>
      </div>
      <Callout
        Icon={Asterisk}
        category="Danger"
        text={t.error.required_fields}
        styles={{ fontSize: "var(--textSmall)" }}
      />
    </React.Fragment>
  );
};

export default WorkspaceInspect;
