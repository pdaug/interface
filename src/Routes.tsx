import { createBrowserRouter, RouterProvider } from "react-router-dom";

// layouts
import Container from "./layouts/Container";

// components
import { ToastElement } from "./components/toasts/Toast";
import { DialogElement, DialogProvider } from "./components/dialogs/Dialog";

// pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/ErrorPage";
import workspaces from "./pages/workspaces";
import financial from "./pages/financial";
import integrations from "./pages/integrations";
import accounts from "./pages/accounts";

const Router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
    errorElement: <ErrorPage />,
  },
  {
    path: "f",
    element: <Container />,
    errorElement: <ErrorPage />,
    children: [accounts, financial, workspaces, integrations],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);

const Routes = (
  <DialogProvider>
    <ToastElement />
    <DialogElement />
    <RouterProvider router={Router} />
  </DialogProvider>
);
export default Routes;
