import { createBrowserRouter, RouterProvider } from "react-router-dom";

// layouts
import Container from "./layouts/Container";

// components
import { ToastElement } from "./components/toasts/Toast";
import { DialogElement, DialogProvider } from "./components/dialogs/Dialog";

// pages
import tool from "./pages/tool";
import Login from "./pages/Login";
import settings from "./pages/settings";
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";
import financial from "./pages/financial";
import administrative from "./pages/administrative";
import DocumentsShare from "./pages/tool/documents/DocumentsShare";
import services from "./pages/services";
import products from "./pages/products";

const Router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
    errorElement: <ErrorPage />,
  },
  {
    path: "/share/document/:id",
    Component: DocumentsShare,
  },
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
