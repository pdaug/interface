// pages
import DocumentsEditor from "./DocumentsEditor";
import DocumentsFolder from "./DocumentsFolder";
import DocumentsRecycle from "./DocumentsRecycle";

export default [
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
];
