// pages
import ErrorPage from "../ErrorPage";
import PasswordChange from "./PasswordChange";

export default {
  path: "password",
  errorElement: <ErrorPage />,
  children: [
    {
      path: "forgot",
      Component: PasswordChange,
    },
    {
      path: "change/:id",
      Component: PasswordChange,
    },
  ],
};
