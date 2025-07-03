import { createBrowserRouter, RouterProvider } from "react-router-dom";

// layouts
import Container from "./layouts/Container";

// components
import { ToastElement } from "./components/toasts/Toast";
import { DialogProvider } from "./components/dialogs/Dialog";

// pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const Router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "f",
    element: <Container />,
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);

const Routes = (
  <DialogProvider>
    <ToastElement />
    <RouterProvider router={Router} />
  </DialogProvider>
);
export default Routes;
