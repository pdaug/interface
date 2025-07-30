import { Descendant } from "slate";
import html2canvas from "html2canvas";

const ObjectToHTML = function (nodes: Descendant[]): string {
  const content = nodes
    .map(function (node) {
      if ("text" in node) return node.text;
      const children = ObjectToHTML(node.children);
      if ("type" in node)
        switch (node.type) {
          case "title":
            return `<h1 style="font-size:28px; margin:12px 0;">${children}</h1>`;
          case "subtitle":
            return `<h2 style="font-size:20px; margin:10px 0;">${children}</h2>`;
          default:
            return `<p style="margin:8px 0;">${children}</p>`;
        }
    })
    .join("");
  return content;
};

const GetImageHTML = async function (html: string): Promise<string> {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "800px";
  container.style.height = "800px";
  container.style.padding = "24px";
  container.style.background = "#fff";
  container.innerHTML = html;

  document.body.appendChild(container);

  await document.fonts.ready;

  const canvas = await html2canvas(container, {
    useCORS: true,
    backgroundColor: "#fff",
    scale: 2,
  });

  document.body.removeChild(container);

  const dataUrl = canvas.toDataURL("image/png");
  return dataUrl;
};

export { ObjectToHTML, GetImageHTML };
