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
import financial from "./pages/financial";
import settings from "./pages/settings";
import operational from "./pages/operational";
import administrative from "./pages/administrative";

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
    children: [...financial, ...settings, ...operational, ...administrative],
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
