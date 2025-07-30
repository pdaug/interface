// pages
import DocumentsFolder from "./documents/DocumentsFolder";
import DocumentsEditor from "./documents/DocumentsEditor";

export default [
  {
    path: "documents",
    children: [
      {
        index: true,
        Component: DocumentsFolder,
      },
      {
        path: "editor",
        Component: DocumentsEditor,
      },
      {
        path: "editor/:id",
        Component: DocumentsEditor,
      },
    ],
  },
];
