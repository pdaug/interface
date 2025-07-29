import React, { useMemo } from "react";
import { Icon as IconPhosphor } from "@phosphor-icons/react";

// slate libs
import {
  Slate,
  Editable,
  useSlate,
  withReact,
  ReactEditor,
  RenderLeafProps,
  RenderElementProps,
} from "slate-react";
import { HistoryEditor, withHistory } from "slate-history";
import {
  BaseEditor,
  BaseText,
  createEditor,
  Descendant,
  Editor,
  Element as ElementSlate,
  Transforms,
} from "slate";

// components
import Button from "../buttons/Button";

export type TypeTextStyle = "bold" | "italic" | "underline" | "strikethrough";
export type TypeTextSize = "title" | "subtitle";
export type TypeTextAlign = "left" | "center" | "right" | "justify";
export type TypeTextFormat = TypeTextStyle | TypeTextSize | TypeTextAlign;
export type TypeEditorCustom = BaseEditor & ReactEditor & HistoryEditor;

const Element = function ({
  element,
  children,
  attributes,
}: RenderElementProps) {
  const style: React.CSSProperties = {};
  if ("align" in element) style.textAlign = element.align as TypeTextAlign;
  if ("type" in element && element.type === "title")
    return (
      <h1 style={style} {...attributes}>
        {children}
      </h1>
    );
  if ("type" in element && element.type === "subtitle")
    return (
      <h2 style={style} {...attributes}>
        {children}
      </h2>
    );
  return (
    <div style={style} {...attributes}>
      {children}
    </div>
  );
};

const Leaf = function ({ attributes, children, leaf }: RenderLeafProps) {
  if ("bold" in leaf && leaf.bold) children = <b>{children}</b>;
  if ("italic" in leaf && leaf.italic) children = <i>{children}</i>;
  if ("underline" in leaf && leaf.underline) children = <u>{children}</u>;
  if ("strikethrough" in leaf && leaf.strikethrough)
    children = <s>{children}</s>;
  return <span {...attributes}>{children}</span>;
};

interface DocumentEditorButtonProps {
  format: TypeTextFormat;
  Icon: IconPhosphor;
}

const isFormatAlign = (editor: TypeEditorCustom, format: TypeTextFormat) => {
  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && "align" in n && n.align === format,
      mode: "lowest",
    }),
  );
  return !!match;
};

const isFormatStyle = function (
  editor: TypeEditorCustom,
  format: TypeTextFormat,
) {
  const marks = Editor.marks(editor);
  return marks ? marks[format as keyof Omit<BaseText, "text">] === true : false;
};

const toggleFormat = function (
  editor: TypeEditorCustom,
  format: TypeTextFormat,
) {
  const textStyles: TypeTextStyle[] = [
    "bold",
    "italic",
    "underline",
    "strikethrough",
  ];
  const alignments: TypeTextAlign[] = ["left", "center", "right", "justify"];

  if (textStyles.includes(format as TypeTextStyle)) {
    const isActive = isFormatStyle(editor, format);
    if (isActive) return Editor.removeMark(editor, format);
    return Editor.addMark(editor, format, true);
  }

  if (alignments.includes(format as TypeTextAlign)) {
    const isActive = isFormatAlign(editor, format);
    Transforms.setNodes(
      editor,
      { align: isActive ? undefined : format } as Partial<Node>,
      { match: (n) => Editor.isBlock(editor, n as ElementSlate) },
    );
    return;
  }
};

export const DocumentEditorButton = function ({
  format,
  Icon,
}: DocumentEditorButtonProps) {
  const editor = useSlate();
  return (
    <Button
      text=""
      onlyIcon
      Icon={Icon}
      type="button"
      IconSize={20}
      category={
        isFormatStyle(editor as TypeEditorCustom, format) ? "Info" : "Neutral"
      }
      onMouseDown={function (event) {
        event.preventDefault();
        toggleFormat(editor as TypeEditorCustom, format);
        return;
      }}
    />
  );
};

export type DocumentEditorContextProps = {
  content: Descendant[];
  setContent: (content: Descendant[]) => void;
  children: React.ReactNode;
};

export const DocumentEditorContext = function ({
  setContent,
  children,
}: DocumentEditorContextProps) {
  const editor = useMemo(function () {
    const newEditor = createEditor();
    const editorReact = withReact(newEditor);
    const editorHistory = withHistory(editorReact);
    return editorHistory;
  }, []);

  return (
    <Slate
      editor={editor}
      initialValue={[
        {
          type: "paragraph",
          children: [{ text: "" }],
        } as Descendant,
      ]}
      onChange={function (value) {
        setContent(value);
        return;
      }}
    >
      {children}
    </Slate>
  );
};

// message -> bold, italic, strikethrough
// document/email -> bold, italic, underline, strikethrough, title, subtitle, paragraph, align left, right, center, justify
export const DocumentEditor = function () {
  return (
    <Editable
      placeholder="Enter some plain text..."
      renderLeaf={Leaf}
      renderElement={Element}
      style={{
        flex: 1,
        background: "var(--foregroundColor)",
        backgroundColor: "var(--foregroundColor)",
        border: "1px solid var(--borderColor)",
        borderRadius: "var(--borderRadius)",
        padding: "1rem",
        outline: "none",
      }}
    />
  );
};
