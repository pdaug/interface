import { createBrowserRouter, RouterProvider } from "react-router-dom";

// layouts
import Container from "./layouts/Container";

// components
import { ToastElement } from "./components/toasts/Toast";
import { DialogElement, DialogProvider } from "./components/dialogs/Dialog";

// pages public
import Login from "./pages/Login";
import Shares from "./pages/Shares";
import Password from "./pages/password";

// pages private
import tool from "./pages/tool";
import settings from "./pages/settings";
import services from "./pages/services";
import products from "./pages/products";
import Dashboard from "./pages/Dashboard";
import financial from "./pages/financial";
import administrative from "./pages/administrative";

// pages other
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/ErrorPage";

const Router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
    errorElement: <ErrorPage />,
  },
  Shares,
  Password,
  {
    path: "f",
    element: <Container />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      ...financial,
      ...settings,
      ...services,
      ...products,
      ...administrative,
      ...tool,
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
    <DialogElement />
    <RouterProvider
      router={Router}
      future={{
        v7_startTransition: true,
      }}
    />
  </DialogProvider>
);
export default Routes;
