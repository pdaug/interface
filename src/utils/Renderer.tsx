import React from "react";
import { Descendant } from "slate";

// components
import { fontBasicList } from "../components/richtext/RichText";

export type RendererProps = {
  content: Descendant[];
  params: Record<string, string>;
};

// customerName
// customerMobile
// customerPhone1
// customerPhone2
// customerEmail
// customerDocument1
// customerDocument2
// companyName
// companyPhone
// companyMobile
// companyWebsite
// companyEmail
// companyDocument1
// companyDocument2

const Renderer = function ({ content, params }: RendererProps) {
  let fontFamily = "sans-serif";

  const RendererText = function (text: string) {
    const expression = /{{(.*?)}}/g;
    const textReplaced = text.replace(expression, function (_, key) {
      const keyTrimmed = key.trim();
      const value = params[keyTrimmed] ?? "";
      return value;
    });
    return textReplaced;
  };

  const RendererNode = function (node: Descendant, index: number) {
    // font
    if ("font" in node && node.font)
      fontFamily =
        (fontBasicList?.[node.font as keyof typeof fontBasicList] as string) ||
        "sans-serif";

    // node
    if ("text" in node && node.text) {
      const text = RendererText(node.text);

      if ("bold" in node && node.bold)
        return (
          <b key={`node-${index}`} style={{ fontFamily }}>
            {text}
          </b>
        );
      if ("italic" in node && node.italic)
        return (
          <i key={`node-${index}`} style={{ fontFamily }}>
            {text}
          </i>
        );
      if ("underline" in node && node.underline)
        return (
          <u key={`node-${index}`} style={{ fontFamily }}>
            {text}
          </u>
        );
      if ("strikethrough" in node && node.strikethrough)
        return (
          <s key={`node-${index}`} style={{ fontFamily }}>
            {text}
          </s>
        );
      if ("color" in node && node.color)
        return (
          <span
            key={`node-${index}`}
            style={{ fontFamily, color: node.color as string }}
          >
            {text}
          </span>
        );
      return (
        <span key={`node-${index}`} style={{ fontFamily }}>
          {text}
        </span>
      );
    }

    // align
    let textAlign: React.CSSProperties["textAlign"] = "left";
    if ("align" in node)
      textAlign = node.align as React.CSSProperties["textAlign"];

    // blocks
    if ("type" in node && node.type === "title" && "children" in node)
      return (
        <h1 style={{ fontFamily, fontSize: "24pt", textAlign }}>
          {(node.children as unknown as Descendant[])?.map(RendererNode)}
        </h1>
      );
    else if ("type" in node && node.type === "subtitle" && "children" in node)
      return (
        <h2 style={{ fontFamily, fontSize: "18pt", textAlign }}>
          {(node.children as unknown as Descendant[])?.map(RendererNode)}
        </h2>
      );
    else if ("type" in node && node.type === "ul" && "children" in node)
      return (
        <ul style={{ fontFamily, textAlign }}>
          {(node.children as unknown as Descendant[])?.map(RendererNode)}
        </ul>
      );
    else if ("type" in node && node.type === "ol" && "children" in node)
      return (
        <ol style={{ fontFamily, textAlign }}>
          {(node.children as unknown as Descendant[])?.map(RendererNode)}
        </ol>
      );
    else if ("type" in node && node.type === "li" && "children" in node)
      return (
        <li style={{ fontFamily, textAlign }}>
          {(node.children as unknown as Descendant[])?.map(RendererNode)}
        </li>
      );
    else
      return (
        <div style={{ fontFamily, textAlign }}>
          {"children" in node
            ? (node.children as unknown as Descendant[])?.map(RendererNode)
            : ""}
        </div>
      );
  };

  return content.map(RendererNode);
};

export default Renderer;
