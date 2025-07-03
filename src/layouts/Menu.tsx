import {
  Cube,
  Table,
  GearSix,
  Paperclip,
  CaretDown,
  SuitcaseSimple,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

// hooks
import useSystem from "../hooks/useSystem";

// components
import Sidebar from "../components/sidebar/Sidebar";

const Menu = function () {
  const navigate = useNavigate();
  const { module, clear, openModule } = useSystem();

  return (
    <Sidebar
      path={module}
      header={{
        name: "Company Name",
        description: "Workspace Selected",
        dropdown: {
          children: (
            <div className="cursor">
              <CaretDown />
            </div>
          ),
          values: [
            {
              id: "workspace_1",
              label: "Workspace 1",
            },
            {
              id: "workspace_2",
              label: "Workspace 2",
            },
          ],
        },
      }}
      menu={[
        {
          id: "financial",
          name: "Financial",
          Icon: Table,
          items: [
            {
              id: "dashboard",
              label: "Dashboard",
              onClick: () => {
                openModule("dashboard");
                navigate("/f/dashboard");
                return;
              },
            },
            {
              id: "orders",
              label: "Orders",
              onClick: () => {
                openModule("orders");
                navigate("/f/orders");
                return;
              },
            },
            {
              id: "inflow",
              label: "Inflow",
              onClick: () => {
                openModule("inflow");
                navigate("/f/inflow");
                return;
              },
            },
            {
              id: "outflow",
              label: "Outflow",
              onClick: () => {
                openModule("outflow");
                navigate("/f/outflow");
                return;
              },
            },
            {
              id: "statements",
              label: "Statements",
              onClick: () => {
                openModule("statements");
                navigate("/f/statements");
                return;
              },
            },
          ],
        },
        {
          id: "administrative",
          name: "Administrative",
          Icon: SuitcaseSimple,
          items: [
            {
              id: "customers",
              label: "Customers",
              onClick: () => openModule("customers"),
            },
            {
              id: "suppliers",
              label: "Suppliers",
              onClick: () => openModule("suppliers"),
            },
            {
              id: "employees",
              label: "Employees",
              onClick: () => openModule("employees"),
            },
          ],
        },
        {
          id: "operational",
          name: "Operational",
          Icon: Cube,
          items: [
            {
              id: "products",
              label: "Products",
              onClick: () => openModule("products"),
            },
            {
              id: "services",
              label: "Services",
              onClick: () => openModule("services"),
            },
            {
              id: "vehicles",
              label: "Vehicles",
              onClick: () => openModule("vehicles"),
            },
          ],
        },
        {
          id: "tools",
          name: "Tools",
          Icon: Paperclip,
          items: [
            {
              id: "documents",
              label: "Documents",
              onClick: () => openModule("documents"),
            },
            {
              id: "schedules",
              label: "Schedules",
              onClick: () => openModule("schedules"),
            },
          ],
        },
      ]}
      footer={{
        name: "",
        description: "John Doe",
        photoCircle: true,
        dropdown: {
          children: (
            <div className="cursor">
              <GearSix />
            </div>
          ),
          values: [
            {
              id: "settings",
              label: "Settings",
            },
            {
              id: "sign_out",
              label: "Sign Out",
              onClick: function () {
                clear();
                navigate("/");
                return;
              },
            },
          ],
        },
      }}
    />
  );
};

export default Menu;
