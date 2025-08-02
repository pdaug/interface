import {
  Robot,
  TextAa,
  TextHOne,
  TextHTwo,
  TextItalic,
  TextBolder,
  TextAlignLeft,
  TextUnderline,
  ArrowClockwise,
  TextAlignRight,
  TextAlignCenter,
  TextAlignJustify,
  TextStrikethrough,
  Icon as IconPhosphor,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import React, { useEffect, useMemo } from "react";

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
  Node,
  Editor,
  BaseText,
  Transforms,
  BaseEditor,
  Descendant,
  createEditor,
  Element as ElementSlate,
  Text,
} from "slate";
import { HistoryEditor, withHistory } from "slate-history";

// style
import "./RichText.css";

// hooks
import useTranslate from "../../hooks/useTranslate";

// components
import Button from "../buttons/Button";
import Tooltip from "../tooltips/Tooltip";

const actionsList = ["ai", "undo", "redo"] as const;
const typesList = ["title", "subtitle", "paragraph"] as const;
const alignsList = ["left", "center", "right", "justify"] as const;
const stylesList = ["bold", "italic", "underline", "strikethrough"] as const;

export type FormatTypes = (typeof typesList)[number];
export type FormatStyles = (typeof stylesList)[number];
export type FormatAligns = (typeof alignsList)[number];
export type FormatProps = FormatStyles | FormatTypes | FormatAligns;

export type ActionProps = (typeof actionsList)[number];

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
  if ("color" in leaf && leaf.color)
    children = (
      <span {...attributes} style={{ color: leaf.color as string }}>
        {children}
      </span>
    );
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

const RichTextToolIcons: Record<FormatProps, IconPhosphor> = {
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

export type RichTextToolProps = {
  format: FormatProps;
  Icon?: IconPhosphor;
};

// hooks
export const useRichTextActions = function () {
  const editor = useSlate();

  useEffect(
    function () {
      const onKeyDown = (event: KeyboardEvent) => {
        if (!HistoryEditor.isHistoryEditor(editor)) return;

        if (!ReactEditor.isFocused(editor as unknown as ReactEditor)) return;

        const isMod = event.metaKey || event.ctrlKey;
        if (!isMod) return;

        const key = event.key.toLowerCase();

        if (key === "z") {
          event.preventDefault();
          if (event.shiftKey) HistoryEditor.redo(editor);
          else HistoryEditor.undo(editor);
        } else if (key === "y") {
          event.preventDefault();
          HistoryEditor.redo(editor);
        }

        return;
      };

      window.addEventListener("keydown", onKeyDown);
      return function () {
        window.removeEventListener("keydown", onKeyDown);
        return;
      };
    },
    [editor],
  );
};

// component
export const RichTextTool = function ({ format, Icon }: RichTextToolProps) {
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
        Icon={Icon || RichTextToolIcons[format]}
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

const RichTextActionIcons: Record<ActionProps, IconPhosphor> = {
  ai: Robot,
  undo: ArrowCounterClockwise,
  redo: ArrowClockwise,
};

export type RichTextActionProps = {
  action: ActionProps;
  Icon?: IconPhosphor;
};

// component
export const RichTextAction = function ({ action }: RichTextActionProps) {
  const t = useTranslate();
  const editor = useSlate();
  const canUndo =
    HistoryEditor.isHistoryEditor(editor) && editor.history.undos.length > 0;
  const canRedo =
    HistoryEditor.isHistoryEditor(editor) && editor.history.redos.length > 0;

  const disabled: Record<ActionProps, boolean> = {
    undo: !canUndo,
    redo: !canRedo,
    ai: true,
  };

  const onMouseDown: Record<
    ActionProps,
    React.MouseEventHandler<HTMLButtonElement>
  > = {
    undo: function (event) {
      event.preventDefault();
      if (HistoryEditor.isHistoryEditor(editor)) {
        HistoryEditor.undo(editor);
      }
      return;
    },
    redo: function (event) {
      event.preventDefault();
      if (HistoryEditor.isHistoryEditor(editor)) {
        HistoryEditor.redo(editor);
      }
      return;
    },
    ai: function (event) {
      event.preventDefault();
      return;
    },
  };

  const textAction: Record<ActionProps, string> = {
    redo: "",
    undo: "",
    ai: t.document.ai_text,
  };

  if (!actionsList.includes(action)) {
    console.error("[src/components/richtext/RichText.tsx]", action);
    return;
  }

  return (
    <Tooltip
      placement="bottom"
      content={
        t.components[action as keyof typeof t.components] ||
        t.document[action as keyof typeof t.document] ||
        t.components.unknown
      }
    >
      <Button
        type="button"
        IconSize={20}
        text={textAction[action]}
        disabled={disabled[action]}
        onMouseDown={onMouseDown[action]}
        Icon={RichTextActionIcons[action]}
        onlyIcon={action === "undo" || action === "redo"}
        category={action === "undo" || action === "redo" ? "Neutral" : "Info"}
      />
    </Tooltip>
  );
};

// component
export const RichTextColor = function () {
  const editor = useSlate();

  const [match] = Array.from(
    Editor.nodes(editor, {
      match: function (node) {
        const hasText = Text.isText(node);
        const hasColor = "color" in node && node.color !== undefined;
        return hasText && hasColor;
      },
      mode: "lowest",
    }),
  );

  const color =
    match?.[0] && "color" in match[0] && typeof match[0].color === "string"
      ? match[0].color
      : "#000000";

  return (
    <input
      type="color"
      value={color}
      id="rich_text_color"
      name="richTextColor"
      className="richTextColor"
      onChange={function (event) {
        const newColor = event.currentTarget?.value || "#0000000";
        if (!editor.selection) return;
        Transforms.setNodes(
          editor,
          {
            color: newColor,
          } as Partial<Node>,
          {
            split: true,
            match: function (node) {
              return Text.isText(node);
            },
          },
        );
        return;
      }}
    />
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
        !content.length
          ? [
              {
                type: "paragraph",
                align: "left",
                children: [{ text: "" }],
              } as Descendant,
            ]
          : (content as Descendant[])
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
  useRichTextActions();

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
