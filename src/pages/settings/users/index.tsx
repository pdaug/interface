// pages
import UsersList from "./UsersList.tsx";
import UsersAudit from "./UsersAudit.tsx";
import UsersInspect from "./UsersInspect.tsx";

export default [
  {
    index: true,
    Component: UsersList,
  },
  {
    path: "inspect",
    Component: UsersInspect,
  },
  {
    path: "inspect/:id",
    Component: UsersInspect,
  },
  {
    path: "audit/:id",
    Component: UsersAudit,
  },
];
