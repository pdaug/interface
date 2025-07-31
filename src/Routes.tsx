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
import financial from "./pages/financial";
import operational from "./pages/operational";
import administrative from "./pages/administrative";
import DocumentsPage from "./pages/tool/documents/DocumentsPage";

const Router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
    errorElement: <ErrorPage />,
  },
  {
    path: "/share/document/:id",
    Component: DocumentsPage,
  },
  {
    path: "f",
    element: <Container />,
    errorElement: <ErrorPage />,
    children: [
      ...financial,
      ...settings,
      ...operational,
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
