import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Asterisk } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// types
import { TypeWorkspace } from "../../../types/Workspace";

// assets
import { WorkspaceCategoryOptions } from "../../../assets/Workspaces";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSchema from "../../../hooks/useSchema";
import useSounds from "../../../hooks/useSounds";
import useSystem from "../../../hooks/useSystem";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputText,
  InputSelect,
} from "../../../components/inputs/Input";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Callout from "../../../components/callouts/Callout";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const WorkspaceInspect = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { token, instance, workspaceId } = useSystem();

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
      if (!response.data?.result || response.status !== 200) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        navigate("/f/workspace");
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
        "[src/pages/settings/workspaces/WorkspaceInspect.tsx]",
        err,
      );
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
        if (workspaceId === id && !form.status) {
          play("alert");
          toast.error(t.toast.warning_error, {
            description: t.workspace.not_change_status,
          });
          return;
        }
        const response = await apis.Workspace.update(
          token,
          instance.name,
          id,
          form,
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
        navigate("/f/workspaces");
        return;
      }
      // is creating
      const response = await apis.Workspace.create(token, instance.name, form);
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
      navigate("/f/workspaces");
      return;
    } catch (err) {
      play("alert");
      console.error(
        "[src/pages/settings/workspaces/WorkspaceInspect.tsx]",
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
        <h1>{t.workspace.workspaces}</h1>
      </Horizontal>
      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
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
                  height={4}
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
                    value={instanceDateTime(form.createdAt as string)}
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
                        ? instanceDateTime(form.updatedAt as string)
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
                        ? instanceDateTime(form.deletedAt as string)
                        : "-"
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
            text={t.stacks.required_fields}
            styles={{ fontSize: "var(--textSmall)" }}
          />

          <Wrapper>
            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
              <Button
                type="button"
                category="Neutral"
                text={t.components.cancel}
                onClick={function () {
                  navigate("/f/workspaces");
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

export default WorkspaceInspect;
