import { useState } from "react";
import { Descendant } from "slate";

// hooks
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  RichText,
  RichTextButton,
  RichTextContext,
} from "../../../components/richtext/RichText";
import Button from "../../../components/buttons/Button";
import Sidebar from "../../../components/sidebar/Sidebar";
import { Input, InputSelect } from "../../../components/inputs/Input";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

// TODO: text with ai
// TODO: correct with ai
const DocumentsPanel = function () {
  const t = useTranslate();
  const [content, setContent] = useState<Descendant[]>([]);

  // email, message, sms, document
  const [form, setForm] = useState({
    name: "",
    category: "document",
  });

  return (
    <RichTextContext content={content} setContent={setContent}>
      <Horizontal internal={1} styles={{ flex: 1 }}>
        <Vertical internal={1}>
          <Horizontal>
            <Button
              category="Neutral"
              text="New document"
              style={{ flex: 1 }}
            />
          </Horizontal>

          <Sidebar
            styles={{
              background: "transparent",
              backgroundColor: "transparent",
              border: "none",
              height: "auto",
              flex: 1,
            }}
            stylesMenu={{ padding: "0" }}
            selected="message"
            options={[
              {
                id: "documents",
                name: "Documents",
                items: [
                  {
                    id: "document",
                    label: "Contrato para cliente",
                  },
                  {
                    id: "message",
                    label: "Mensagem de boas vindas",
                  },
                  {
                    id: "email",
                    label: "Email de alerta",
                  },
                ],
              },
            ]}
          />
        </Vertical>

        <Vertical internal={1} styles={{ flex: 1 }}>
          <Horizontal internal={0.4}>
            <Button type="button" text="Save" category="Success" />
            <div style={{ width: 8 }}></div>
            <Button type="button" text="Undo" category="Neutral" />
            <Button type="button" text="Redo" category="Neutral" />
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
          </Horizontal>

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
            <div style={{ minWidth: 180 }}>
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
                onChange={function () {
                  return;
                }}
              />
            </div>
            <Button type="button" text="Download" category="Neutral" />
          </Horizontal>

          <RichText />
        </Vertical>
      </Horizontal>
    </RichTextContext>
  );
};

export default DocumentsPanel;
