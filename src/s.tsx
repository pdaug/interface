import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
  },
  {
    path: "/home",
  },
]);

const Routes = <RouterProvider router={router} />;

export default Routes;
