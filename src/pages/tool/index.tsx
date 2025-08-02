// pages
import DocumentsFolder from "./documents/DocumentsFolder";
import DocumentsEditor from "./documents/DocumentsEditor";
import DocumentsRecycle from "./documents/DocumentsRecycle";

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
      {
        path: "recycle",
        Component: DocumentsRecycle,
      },
    ],
  },
];
