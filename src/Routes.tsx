import { createBrowserRouter, RouterProvider } from "react-router-dom";

// layouts
import Container from "./layouts/Container";

// components
import { ToastElement } from "./components/toasts/Toast";
import { DialogProvider } from "./components/dialogs/Dialog";

// pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/financial/Dashboard";
import OrdersList from "./pages/financial/orders/OrdersList";
import OrdersEdit from "./pages/financial/orders/OrdersEdit";
import ErrorPage from "./pages/ErrorPage";
import WorkspaceList from "./pages/workspaces/WorkspaceList";

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
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "orders",
        children: [
          {
            index: true,
            Component: OrdersList,
          },
          {
            path: "inspect",
            Component: OrdersEdit,
          },
          {
            path: "inspect/:id",
            Component: OrdersEdit,
          },
        ],
      },
      {
        path: "workspaces",
        children: [
          {
            index: true,
            Component: WorkspaceList,
          },
          {
            path: "inspect",
            Component: OrdersEdit,
          },
          {
            path: "inspect/:id",
            Component: OrdersEdit,
          },
        ],
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
