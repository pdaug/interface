import { Descendant } from "slate";
import html2canvas from "html2canvas";

// components
import { fontBasicList } from "../components/richtext/RichText";

const NodesToHtml = function (nodes: Descendant[]): string {
  const content = new Array<string>();
  let fontFamily = null;
  for (const node of nodes) {
    if ("font" in node && node.font)
      fontFamily = fontBasicList[node.font as keyof typeof fontBasicList];
    if ("text" in node) {
      let text = node.text;
      if ("color" in node && node.color)
        text = `<span style="color:${node.color};font-family:${fontFamily};">${text}</span>`;
      if ("bold" in node && node.bold)
        text = `<b style="font-family:${fontFamily};">${text}</b>`;
      if ("italic" in node && node.italic)
        text = `<i style="font-family:${fontFamily};">${text}</i>`;
      if ("underline" in node && node.underline)
        text = `<u style="font-family:${fontFamily};">${text}</u>`;
      if ("strikethrough" in node && node.strikethrough)
        text = `<s style="font-family:${fontFamily};">${text}</s>`;
      content.push(text);
      continue;
    }
    let textAlign = "left";
    if ("align" in node) textAlign = node.align as string;
    const children = NodesToHtml(node.children);
    if ("type" in node && node.type === "title")
      content.push(
        `<h1 style="font-size:22px;font-family:${fontFamily};margin:12px 0;text-align:${textAlign};">${children}</h1>`,
      );
    else if ("type" in node && node.type === "subtitle")
      content.push(
        `<h2 style="font-size:18px;font-family:${fontFamily};margin:10px 0;text-align:${textAlign};">${children}</h2>`,
      );
    else
      content.push(
        `<p style="font-size:14px;font-family:${fontFamily};margin:8px 0;text-align:${textAlign};">${children}</p>`,
      );
  }
  return content.join("");
};

const HtmlToImage = async function (
  content: string,
  options?: {
    scale?: number;
    type?: "image/jpg" | "image/png";
    quality?: number;
    width?: number;
    height?: number;
    padding?: number;
    background?: string;
  },
): Promise<string> {
  await document.fonts.ready;
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.width = `${options?.width || 380}px`;
  container.style.height = `${options?.height || 380}px`;
  container.style.overflow = "hidden";
  container.style.padding = `${options?.padding || 32}px`;
  container.style.background = options?.background || "white";
  container.style.backgroundColor = options?.background || "white";
  container.innerHTML = content;
  document.body.appendChild(container);
  const canvas = await html2canvas(container, {
    useCORS: true,
    backgroundColor: "#fff",
    scale: options?.scale || 1,
    logging: false,
  });
  document.body.removeChild(container);
  const base64 = canvas.toDataURL(
    options?.type || "image/jpg",
    options?.quality || 0.7,
  );
  return base64;
};

export { NodesToHtml, HtmlToImage };
