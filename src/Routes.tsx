import { createBrowserRouter, RouterProvider } from "react-router-dom";

// pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// hooks
import { SessionProvider } from "./hooks/useSession";
import { InstanceProvider } from "./hooks/useInstance";

// components
import { ToastElement } from "./components/toasts/Toast";
import { DialogProvider } from "./components/dialogs/Dialog";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "f",
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
      },
    ],
  },
]);

const Routes = (
  <InstanceProvider>
    <SessionProvider>
      <DialogProvider>
        <ToastElement />
        <RouterProvider router={router} />
      </DialogProvider>
    </SessionProvider>
  </InstanceProvider>
);
export default Routes;
