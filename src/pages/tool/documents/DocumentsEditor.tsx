import { toast } from "sonner";
import { Descendant } from "slate";
import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MagicWand, Robot, Translate } from "@phosphor-icons/react";

// apis
import apis from "../../../apis";

// assets
import { SettingsLanguages } from "../../../assets/Settings";

// utils
import { NodesToHtml, HtmlToImage } from "../../../utils/Preview";

// types
import { TypeDocument, TypeDocumentCategory } from "../../../types/Documents";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useSystem from "../../../hooks/useSystem";
import useSchema from "../../../hooks/useSchema";
import useTranslate from "../../../hooks/useTranslate";
import usePermission from "../../../hooks/usePermission";

// components
import {
  RichText,
  RichTextTool,
  RichTextFont,
  RichTextColor,
  RichTextAction,
  RichTextContext,
} from "../../../components/richtext/RichText";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import { useDialog } from "../../../components/dialogs/Dialog";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Input, InputSelect } from "../../../components/inputs/Input";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const DocumentsEditor = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const navigate = useNavigate();
  const { renderByPlan } = usePermission();
  const { OpenDialog, CloseDialog } = useDialog();
  const { token, user, instance, workspaces, workspaceId } = useSystem();

  const toolbarRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [form, setForm] = useState<Partial<TypeDocument>>({
    id: "",
    name: "",
    category: "document", // email, message, sms, document
    isPublic: false,
    content: [],
    userId: user.id,
    workspaceId,
  });

  // toolbar scroll too
  useEffect(function () {
    const OnScroll = function () {
      if (!toolbarRef.current) return;
      const rect = toolbarRef.current.getBoundingClientRect();
      const isSticky = rect.top === 16;
      if (isSticky) {
        toolbarRef.current.style.border = "1px solid var(--borderColor)";
        toolbarRef.current.style.marginLeft = "16px";
      } else {
        toolbarRef.current.style.border = "none";
        toolbarRef.current.style.marginLeft = "0px";
      }
      return;
    };
    window.addEventListener("wheel", OnScroll);
    OnScroll();
    return function () {
      window.removeEventListener("wheel", OnScroll);
      return;
    };
  }, []);

  // check will close tab
  useEffect(function () {
    const handleBeforeUnload = function (event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
      return;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return function () {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      return;
    };
  }, []);

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
        const nodesHtml = NodesToHtml(form?.content || []);
        const nodesPreview = await HtmlToImage(nodesHtml);
        form.preview = nodesPreview;
        const response = await apis.DocumentApi.update(
          token,
          instance.name,
          id,
          form,
          workspaceId,
        );
        if (!response.data?.result || response.status !== 200) {
          play("alert");
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
        return;
      }
      // is creating
      const nodesHtml = NodesToHtml(form?.content || []);
      const nodesPreview = await HtmlToImage(nodesHtml);
      form.preview = nodesPreview;
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
        return;
      }
      play("ok");
      toast.dismiss(toastId);
      toast.success(t.toast.success, {
        description: t.toast.success_create,
      });
      navigate("/f/documents");
      return;
    } catch (err) {
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
    } finally {
      // delay to not duplicate when save
      setTimeout(function () {
        setLoading(false);
      }, 500);
    }
  };

  return renderByPlan(
    "advanced",
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
                onClick: function () {
                  OpenDialog({
                    category: "Danger",
                    title: t.dialog.title_close,
                    description: t.dialog.description_close,
                    confirmText: t.components.close,
                    onConfirm: function () {
                      navigate("/f/documents");
                      CloseDialog();
                      return;
                    },
                  });
                  return;
                },
              },
              {
                id: "document",
                label: form?.name || t.components.empty_name,
                url: `/f/documents/editor${id ? `/${id}` : ""}`,
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
          <form onSubmit={onSubmit} className="flex flex1">
            <Vertical internal={1} className="flex flex1">
              {/* toolbar */}
              <Horizontal
                styles={{
                  position: "sticky",
                  top: 0,
                  zIndex: 9,
                }}
              >
                <Horizontal
                  ref={toolbarRef}
                  internal={0.4}
                  styles={{
                    background: "var(--backgroundColor)",
                    backgroundColor: "var(--backgroundColor)",
                    borderRadius: "var(--borderRadius)",
                    padding: "0.4rem",
                  }}
                >
                  <RichTextAction action="undo" />
                  <RichTextAction action="redo" />
                  <div style={{ width: 8 }}></div>
                  <RichTextColor />
                  <div style={{ width: 8 }}></div>
                  <RichTextFont />
                  <div style={{ width: 8 }}></div>
                  <RichTextTool format="bold" />
                  <RichTextTool format="italic" />
                  <RichTextTool format="underline" />
                  <RichTextTool format="strikethrough" />
                  <div style={{ width: 8 }}></div>
                  <RichTextTool format="title" />
                  <RichTextTool format="subtitle" />
                  <div style={{ width: 8 }}></div>
                  <RichTextTool format="left" />
                  <RichTextTool format="center" />
                  <RichTextTool format="right" />
                  <RichTextTool format="justify" />
                  <div style={{ width: 8 }}></div>
                  <RichTextTool format="ul" />
                  <RichTextTool format="ol" />
                </Horizontal>
              </Horizontal>

              <Horizontal internal={1} className="flex flex1">
                {/* editor */}
                <RichText />

                {/* inspect */}
                <div style={{ position: "sticky", top: 0 }}>
                  <Vertical
                    internal={1}
                    styles={{
                      position: "sticky",
                      top: 0,
                      minWidth: 280,
                      maxWidth: 280,
                    }}
                  >
                    <Horizontal>
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
                    </Horizontal>

                    <Horizontal internal={1}>
                      <InputSelect
                        required
                        name="isPublic"
                        id="document_is_public"
                        label={t.document.is_public}
                        empty={t.stacks.no_option}
                        styles={{ maxWidth: 180 }}
                        value={String(Boolean(form?.isPublic))}
                        options={[
                          {
                            id: "true",
                            value: "true",
                            text: t.components.yes,
                          },
                          {
                            id: "false",
                            value: "false",
                            text: t.components.no,
                          },
                        ]}
                        onChange={function (event) {
                          const newForm = { ...form };
                          newForm.isPublic =
                            event?.currentTarget?.value === "true";
                          setForm(newForm);
                          return;
                        }}
                      />
                      <InputSelect
                        required
                        name="category"
                        id="document_category"
                        styles={{ maxWidth: 180 }}
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
                    </Horizontal>

                    <Vertical internal={0.4}>
                      <div style={{ fontSize: "var(--textSmall)" }}>
                        {t.components.translate}
                      </div>

                      <Horizontal internal={1}>
                        <InputSelect
                          required
                          disabled
                          label=""
                          value={"en"}
                          name="translate"
                          id="document_translate"
                          empty={t.stacks.no_option}
                          options={SettingsLanguages}
                          onChange={function () {
                            return;
                          }}
                        />
                        <Button
                          text=""
                          disabled
                          type="button"
                          IconSize={20}
                          Icon={Translate}
                          category="Neutral"
                        />
                      </Horizontal>
                    </Vertical>

                    <Vertical internal={0.4}>
                      <div style={{ fontSize: "var(--textSmall)" }}>
                        {t.components.ai_long}
                      </div>

                      <Horizontal internal={1}>
                        <Button
                          disabled
                          Icon={Robot}
                          type="button"
                          IconSize={20}
                          className="flex1"
                          category="Neutral"
                          text={t.document.ai_text}
                        />
                        <Button
                          disabled
                          type="button"
                          IconSize={20}
                          Icon={MagicWand}
                          className="flex1"
                          category="Neutral"
                          text={t.document.ai_correct}
                        />
                      </Horizontal>
                    </Vertical>

                    <div></div>

                    <Horizontal internal={1}>
                      <Button
                        type="submit"
                        className="flex1"
                        category="Success"
                        disabled={loading}
                        text={id ? t.components.edit : t.components.save}
                      />
                      <Button
                        type="button"
                        disabled={loading}
                        category="Neutral"
                        text={t.components.close}
                        onClick={function () {
                          OpenDialog({
                            title: t.dialog.title_close,
                            description: t.dialog.description_close,
                            category: "Danger",
                            confirmText: t.components.close,
                            onConfirm: function () {
                              navigate("/f/documents");
                              CloseDialog();
                              return;
                            },
                          });
                          return;
                        }}
                      />
                    </Horizontal>
                  </Vertical>
                </div>
              </Horizontal>
            </Vertical>
          </form>
        </RichTextContext>
      ) : (
        <Vertical>
          <Wrapper>
            <Horizontal className="justifyCenter">
              <i
                style={{
                  color: "var(--textLight)",
                  fontSize: "var(--textSmall)",
                }}
              >
                {loading ? `${t.components.loading}...` : t.stacks.no_items}
              </i>
            </Horizontal>
          </Wrapper>
        </Vertical>
      )}
    </React.Fragment>,
  );
};

export default DocumentsEditor;
