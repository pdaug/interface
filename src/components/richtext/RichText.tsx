import React, { useMemo } from "react";
import {
  TextAa,
  TextHOne,
  TextHTwo,
  TextItalic,
  TextBolder,
  TextAlignLeft,
  TextUnderline,
  TextAlignRight,
  TextAlignCenter,
  TextAlignJustify,
  TextStrikethrough,
  Icon as IconPhosphor,
} from "@phosphor-icons/react";

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
import {
  Editor,
  BaseText,
  Transforms,
  BaseEditor,
  Descendant,
  createEditor,
  Element as ElementSlate,
  Node,
} from "slate";
import { HistoryEditor, withHistory } from "slate-history";

// hooks
import useTranslate from "../../hooks/useTranslate";

// components
import Button from "../buttons/Button";
import Tooltip from "../tooltips/Tooltip";

const stylesList = ["bold", "italic", "underline", "strikethrough"] as const;
const typesList = ["title", "subtitle", "paragraph"] as const;
const alignsList = ["left", "center", "right", "justify"] as const;

export type FormatStyles = (typeof stylesList)[number];
export type FormatTypes = (typeof typesList)[number];
export type FormatAligns = (typeof alignsList)[number];
export type FormatProps = FormatStyles | FormatTypes | FormatAligns;

export type EditorCustom = BaseEditor & ReactEditor & HistoryEditor;

// transformer
const Element = function ({
  element,
  children,
  attributes,
}: RenderElementProps) {
  const style: React.CSSProperties = {};
  if ("align" in element) style.textAlign = element.align as FormatAligns;
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

// transformer
const Leaf = function ({ attributes, children, leaf }: RenderLeafProps) {
  if ("bold" in leaf && leaf.bold) children = <b>{children}</b>;
  if ("italic" in leaf && leaf.italic) children = <i>{children}</i>;
  if ("underline" in leaf && leaf.underline) children = <u>{children}</u>;
  if ("strikethrough" in leaf && leaf.strikethrough)
    children = <s>{children}</s>;
  return <span {...attributes}>{children}</span>;
};

// checker
const isAligned = (editor: EditorCustom, format: FormatAligns) => {
  const [match] = Array.from(
    Editor.nodes(editor, {
      match: function (node) {
        const notEditor = !Editor.isEditor(node);
        const isElement = ElementSlate.isElement(node);
        const hasFormat = "align" in node && node.align === format;
        return notEditor && isElement && hasFormat;
      },
      mode: "highest",
    }),
  );
  return Boolean(match);
};

// checker
const isTyped = (editor: EditorCustom, format: FormatTypes) => {
  const [match] = Array.from(
    Editor.nodes(editor, {
      match: function (node) {
        const notEditor = !Editor.isEditor(node);
        const isElement = ElementSlate.isElement(node);
        const hasFormat = "type" in node && node.type === format;
        return notEditor && isElement && hasFormat;
      },
      mode: "highest",
    }),
  );
  return Boolean(match);
};

// checker
const isStyled = function (editor: EditorCustom, format: FormatStyles) {
  const marks = Editor.marks(editor);
  return marks ? marks[format as keyof Omit<BaseText, "text">] === true : false;
};

// toggle
const toggleFormat = function (editor: EditorCustom, format: FormatProps) {
  if (stylesList.includes(format as FormatStyles)) {
    const isActive = isStyled(editor, format as FormatStyles);
    if (isActive) return Editor.removeMark(editor, format);
    return Editor.addMark(editor, format, true);
  }

  if (alignsList.includes(format as FormatAligns)) {
    const isActive = isAligned(editor, format as FormatAligns);
    Transforms.setNodes(
      editor,
      {
        align: isActive ? "left" : format,
      } as Partial<Node>,
      {
        match: function (node) {
          return ElementSlate.isElement(node);
        },
        mode: "highest",
      },
    );
    return;
  }

  if (typesList.includes(format as FormatTypes)) {
    const isActive = isTyped(editor, format as FormatTypes);
    Transforms.setNodes(
      editor,
      {
        type: isActive ? "paragraph" : format,
      } as Partial<Node>,
      {
        match: function (node) {
          return ElementSlate.isElement(node);
        },
        mode: "highest",
      },
    );
  }
};

const RichTextButtonIcons: Record<FormatProps, IconPhosphor> = {
  bold: TextBolder,
  italic: TextItalic,
  underline: TextUnderline,
  strikethrough: TextStrikethrough,
  title: TextHOne,
  subtitle: TextHTwo,
  paragraph: TextAa,
  left: TextAlignLeft,
  center: TextAlignCenter,
  right: TextAlignRight,
  justify: TextAlignJustify,
};

export type RichTextButtonProps = {
  format: FormatProps;
  Icon?: IconPhosphor;
};

// component
export const RichTextButton = function ({ format, Icon }: RichTextButtonProps) {
  const t = useTranslate();
  const editor = useSlate();
  const hasSelected =
    isStyled(editor as EditorCustom, format as string as FormatStyles) ||
    isAligned(editor as EditorCustom, format as string as FormatAligns) ||
    isTyped(editor as EditorCustom, format as string as FormatTypes);

  return (
    <Tooltip
      content={
        t.components[format as keyof typeof t.components] ||
        t.components.unknown
      }
      placement="bottom"
    >
      <Button
        text=""
        onlyIcon
        type="button"
        IconSize={20}
        Icon={Icon || RichTextButtonIcons[format]}
        category={hasSelected ? "Info" : "Neutral"}
        onMouseDown={function (event) {
          event.preventDefault();
          toggleFormat(editor as EditorCustom, format);
          return;
        }}
      />
    </Tooltip>
  );
};

export type RichTextContextProps = {
  content: Descendant[];
  setContent: (content: Descendant[]) => void;
  children: React.ReactNode;
};

// component
export const RichTextContext = function ({
  content,
  setContent,
  children,
}: RichTextContextProps) {
  const editor = useMemo(function () {
    const newEditor = createEditor();
    const editorReact = withReact(newEditor);
    const editorHistory = withHistory(editorReact);
    return editorHistory;
  }, []);

  return (
    <Slate
      editor={editor}
      initialValue={
        content || [
          {
            type: "paragraph",
            align: "left",
            children: [{ text: "" }],
          } as Descendant,
        ]
      }
      onChange={function (value) {
        setContent(value);
        return;
      }}
    >
      {children}
    </Slate>
  );
};

// component
export const RichText = function () {
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
