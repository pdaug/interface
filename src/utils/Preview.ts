import { Descendant } from "slate";
import html2canvas from "html2canvas";

const NodesToHtml = function (nodes: Descendant[]): string {
  const content = new Array<string>();
  for (const node of nodes) {
    if ("text" in node) {
      let text = node.text;
      if ("bold" in node && node.bold) text = `<b>${text}</b>`;
      if ("italic" in node && node.italic) text = `<i>${text}</i>`;
      if ("underline" in node && node.underline) text = `<u>${text}</u>`;
      if ("strikethrough" in node && node.strikethrough)
        text = `<s>${text}</s>`;
      content.push(text);
      continue;
    }
    let textAlign = "left";
    if ("align" in node) textAlign = node.align as string;
    const children = NodesToHtml(node.children);
    if ("type" in node && node.type === "title")
      content.push(
        `<h1 style="font-size:22px;margin:12px 0;text-align:${textAlign};">${children}</h1>`,
      );
    else if ("type" in node && node.type === "subtitle")
      content.push(
        `<h2 style="font-size:18px;margin:10px 0;text-align:${textAlign};">${children}</h2>`,
      );
    else
      content.push(
        `<p style="font-size:14px;margin:8px 0;text-align:${textAlign};">${children}</p>`,
      );
  }
  return content.join("");
};

const HtmlToImage = async function (
  content: string,
  options?: {
    width?: number;
    height?: number;
    padding?: number;
    background?: string;
  },
): Promise<string> {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.width = `${options?.width || 320}px`;
  container.style.height = `${options?.height || 320}px`;
  container.style.overflow = "hidden";
  container.style.padding = `${options?.padding || 24}px`;
  container.style.background = options?.background || "white";
  container.style.backgroundColor = options?.background || "white";
  container.innerHTML = content;
  document.body.appendChild(container);
  const canvas = await html2canvas(container, {
    useCORS: true,
    backgroundColor: "#fff",
    scale: 0.8,
    logging: false,
    removeContainer: true,
    imageTimeout: 0,
  });
  document.body.removeChild(container);
  const base64 = canvas.toDataURL("image/jpg", 0.2);
  return base64;
};

export { NodesToHtml, HtmlToImage };
