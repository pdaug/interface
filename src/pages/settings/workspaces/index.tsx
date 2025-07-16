// pages
import WorkspaceList from "./WorkspaceList";
import WorkspaceInspect from "./WorkspaceInspect";

export default [
  {
    index: true,
    Component: WorkspaceList,
  },
  {
    path: "inspect",
    Component: WorkspaceInspect,
  },
  {
    path: "inspect/:id",
    Component: WorkspaceInspect,
  },
];
