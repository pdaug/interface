import { toast } from "sonner";
import { Descendant } from "slate";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// types
import { TypeDocument, TypeDocumentCategory } from "../../../types/Documents";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useSystem from "../../../hooks/useSystem";
import useSchema from "../../../hooks/useSchema";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  RichText,
  RichTextButton,
  RichTextContext,
} from "../../../components/richtext/RichText";
import Button from "../../../components/buttons/Button";
import { Input, InputSelect } from "../../../components/inputs/Input";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";

// TODO: text with ai
// TODO: correct with ai
const DocumentsEditor = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const navigate = useNavigate();
  const { token, user, instance, workspaces, workspaceId } = useSystem();

  const [loading, setLoading] = useState<boolean>(false);

  // email, message, sms, document
  const [form, setForm] = useState<Partial<TypeDocument>>({
    id: "",
    name: "",
    category: "document",
    content: [],
    userId: user.id,
    workspaceId,
  });

  // fetch document
  useAsync(async function () {
    if (!id) return;
    const toastId = toast.loading(t.components.loading);
    setLoading(true);
    try {
      const response = await apis.DocumentApi.get(
        token,
        instance.name,
        id,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 200) {
        play("alert");
        toast.dismiss(toastId);
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        navigate("/f/documents");
        setLoading(false);
        return;
      }
      setForm(response.data.result);
      toast.dismiss(toastId);
      return;
    } catch (err) {
      play("alert");
      toast.dismiss(toastId);
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/tool/documents/DocumentsEditor.tsx]", err);
      navigate("/f/documents");
      setLoading(false);
      return;
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  }, []);

  const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const toastId = toast.loading(t.components.loading);
    try {
      // is editing
      if (id && form.id) {
        const response = await apis.DocumentApi.update(
          token,
          instance.name,
          id,
          form,
          workspaceId,
        );
        if (!response.data?.result || response.status !== 200) {
          play("alert");
          setLoading(false);
          toast.dismiss(toastId);
          toast.warning(t.toast.warning_error, {
            description: t.toast.warning_edit,
          });
          return;
        }
        play("ok");
        toast.dismiss(toastId);
        toast.success(t.toast.success, {
          description: t.toast.success_edit,
        });
        navigate("/f/documents");
        setLoading(false);
        return;
      }
      // is creating
      const response = await apis.DocumentApi.create<TypeDocument>(
        token,
        instance.name,
        form,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 201) {
        play("alert");
        toast.dismiss(toastId);
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_create,
        });
        setLoading(false);
        return;
      }
      play("ok");
      toast.dismiss(toastId);
      toast.success(t.toast.success, {
        description: t.toast.success_create,
      });
      navigate("/f/documents");
      setLoading(false);
      return;
    } catch (err) {
      setLoading(false);
      play("alert");
      toast.dismiss(toastId);
      console.error("[src/pages/tool/documents/DocumentsEditor.tsx]", err);
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
                id: "documents",
                label: t.document.documents,
                url: "/f/documents",
              },
              {
                id: "document",
                label: form?.name || t.components.empty_name,
                url: `/f/documents/inspect${id ? `/${id}` : ""}`,
              },
            ]}
          />
        </h2>
      </Horizontal>

      {!loading ? (
        <RichTextContext
          content={form?.content as Descendant[]}
          setContent={function (newContent) {
            const newForm = { ...form };
            newForm.content = newContent;
            setForm(newForm);
            return;
          }}
        >
          <form
            onSubmit={onSubmit}
            style={{ display: "flex" }}
            className="flex1"
          >
            <Horizontal internal={1} styles={{ flex: 1 }}>
              <Vertical internal={1} styles={{ flex: 1 }}>
                <Horizontal internal={0.4}>
                  <Button
                    type="button"
                    disabled={loading}
                    category="Neutral"
                    text={t.components.undo}
                  />
                  <Button
                    type="button"
                    disabled={loading}
                    text={t.components.redo}
                    category="Neutral"
                  />
                  <div style={{ width: 8 }}></div>
                  <RichTextButton format="bold" />
                  <RichTextButton format="italic" />
                  <RichTextButton format="underline" />
                  <RichTextButton format="strikethrough" />
                  <div style={{ width: 8 }}></div>
                  <RichTextButton format="title" />
                  <RichTextButton format="subtitle" />
                  <div style={{ width: 8 }}></div>
                  <RichTextButton format="left" />
                  <RichTextButton format="center" />
                  <RichTextButton format="right" />
                  <RichTextButton format="justify" />
                  <div className="flex1"></div>
                  <Button
                    type="button"
                    disabled={loading}
                    category="Neutral"
                    text={t.components.close}
                    onClick={function () {
                      navigate("/f/documents");
                      return;
                    }}
                  />
                  <div style={{ width: 8 }}></div>
                  <Button
                    type="submit"
                    disabled={loading}
                    text={t.components.save}
                    category={id ? "Info" : "Success"}
                  />
                </Horizontal>

                <Horizontal styles={{ alignItems: "flex-end" }} internal={1}>
                  <Input
                    required
                    min={3}
                    max={256}
                    name="name"
                    id="document_name"
                    label={t.document.name}
                    value={form?.name || ""}
                    placeholder={t.document?.name_placeholder}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.name = event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />
                  <div style={{ minWidth: 180 }}>
                    <InputSelect
                      required
                      name="category"
                      id="document_category"
                      empty={t.stacks.no_option}
                      label={t.components.category}
                      value={form?.category || "document"}
                      options={[
                        {
                          id: "email",
                          value: "email",
                          text: t.components.email,
                        },
                        {
                          id: "message",
                          value: "message",
                          text: t.components.message,
                        },
                        {
                          id: "sms",
                          value: "sms",
                          text: t.components.sms,
                        },
                        {
                          id: "document",
                          value: "document",
                          text: t.components.document,
                        },
                      ]}
                      onChange={function (event) {
                        const newForm = { ...form };
                        newForm.category = (event?.currentTarget?.value ||
                          "document") as TypeDocumentCategory;
                        setForm(newForm);
                        return;
                      }}
                    />
                  </div>
                </Horizontal>
                <RichText />
              </Vertical>
            </Horizontal>
          </form>
        </RichTextContext>
      ) : (
        t.components.loading
      )}
    </React.Fragment>
  );
};

export default DocumentsEditor;
