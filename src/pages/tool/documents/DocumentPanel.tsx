import { useState } from "react";
import { Descendant } from "slate";
import {
  FileDoc,
  ChatText,
  TextHOne,
  TextHTwo,
  TextItalic,
  TextBolder,
  TextAlignLeft,
  TextUnderline,
  TextAlignRight,
  EnvelopeSimple,
  TextAlignCenter,
  TextAlignJustify,
  TextStrikethrough,
} from "@phosphor-icons/react";

// hooks
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  DocumentEditor,
  DocumentEditorButton,
  DocumentEditorContext,
} from "../../../components/document_editor/DocumentEditor";
import Button from "../../../components/buttons/Button";
import Sidebar from "../../../components/sidebar/Sidebar";
import Tooltip from "../../../components/tooltips/Tooltip";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import { Input, InputSelect } from "../../../components/inputs/Input";

const DocumentsPanel = function () {
  const t = useTranslate();
  const [content, setContent] = useState<Descendant[]>([]);

  // email, message, sms, document
  const [form, setForm] = useState({
    name: "",
    category: "document",
  });

  return (
    <DocumentEditorContext content={content} setContent={setContent}>
      <Horizontal internal={1} styles={{ flex: 1 }}>
        <Vertical internal={1}>
          <Sidebar
            styles={{
              border: "1px solid var(--borderColor)",
              borderRadius: "var(--borderRadius)",
              height: "auto",
              flex: 1,
            }}
            stylesMenu={{ padding: "0.4rem 0.6rem" }}
            selected=""
            options={[
              {
                id: "documents",
                name: "Documents",
                items: [
                  {
                    id: "Contrato para cliente",
                    label: "Contrato para cliente",
                    Icon: FileDoc,
                  },
                  {
                    id: "Mensagem de boas vindas",
                    label: "Mensagem de boas vindas",
                    Icon: ChatText,
                  },
                  {
                    id: "Email de alerta",
                    label: "Email de alerta",
                    Icon: EnvelopeSimple,
                  },
                ],
              },
            ]}
          />
        </Vertical>
        <Vertical internal={1} styles={{ flex: 1 }}>
          <Horizontal styles={{ alignItems: "flex-end" }} internal={1}>
            <Input
              required
              name="name"
              value={form.name}
              id="document_name"
              label="Document name"
              placeholder="e.g. My First Document"
              onChange={function (event) {
                const newForm = { ...form };
                newForm.name = event.currentTarget?.value || "";
                setForm(newForm);
                return;
              }}
            />
            <div style={{ minWidth: 256 }}>
              <InputSelect
                required
                name="category"
                label="Category"
                value={form.category}
                id="document_category"
                empty={t.stacks.no_option}
                options={[
                  {
                    id: "email",
                    value: "email",
                    text: "Email",
                  },
                  {
                    id: "message",
                    value: "message",
                    text: "Message",
                  },
                  {
                    id: "sms",
                    value: "sms",
                    text: "SMS",
                  },
                  {
                    id: "document",
                    value: "document",
                    text: "Document",
                  },
                ]}
              />
            </div>
            <Button type="button" text="Download" category="Neutral" />
            <Button type="button" text="Save" category="Success" />
          </Horizontal>
          <Horizontal internal={1}>
            <Tooltip content={t.components.bold} placement="right">
              <DocumentEditorButton Icon={TextBolder} format="bold" />
            </Tooltip>
            <DocumentEditorButton Icon={TextItalic} format="italic" />
            <DocumentEditorButton Icon={TextUnderline} format="underline" />
            <DocumentEditorButton
              Icon={TextStrikethrough}
              format="strikethrough"
            />
            <div></div>
            <DocumentEditorButton Icon={TextHOne} format="title" />
            <DocumentEditorButton Icon={TextHTwo} format="subtitle" />
            <div></div>
            <DocumentEditorButton Icon={TextAlignLeft} format="left" />
            <DocumentEditorButton Icon={TextAlignCenter} format="center" />
            <DocumentEditorButton Icon={TextAlignRight} format="right" />
            <DocumentEditorButton Icon={TextAlignJustify} format="justify" />
          </Horizontal>
          <DocumentEditor />
        </Vertical>
      </Horizontal>
    </DocumentEditorContext>
  );
};

export default DocumentsPanel;
