import {
  Cube,
  Table,
  GearSix,
  CaretDown,
  Paperclip,
  SuitcaseSimple,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Meta } from "@storybook/react";

import Sidebar from "./Sidebar";

export default {
  title: "components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
} as Meta;

export const Default = () => {
  const [path, setPath] = useState("dashboard");
  return (
    <Sidebar
      selected={path}
      options={[
        {
          id: "dashboard",
          label: "Dashboard",
          onClick: () => setPath("dashboard"),
        },
        {
          id: "orders",
          label: "Orders",
          onClick: () => setPath("orders"),
        },
        {
          id: "inflow",
          label: "Inflow",
          onClick: () => setPath("inflow"),
        },
        {
          id: "outflow",
          label: "Outflow",
          onClick: () => setPath("outflow"),
        },
        {
          id: "statements",
          label: "Statements",
          onClick: () => setPath("statements"),
        },
      ]}
    />
  );
};

export const Group = () => {
  const [path, setPath] = useState("dashboard");
  return (
    <Sidebar
      selected={path}
      options={[
        {
          id: "financial",
          name: "Financial",
          Icon: Table,
          items: [
            {
              id: "dashboard",
              label: "Dashboard",
              onClick: () => setPath("dashboard"),
            },
            {
              id: "orders",
              label: "Orders",
              onClick: () => setPath("orders"),
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
              onClick: () => setPath("customers"),
            },
            {
              id: "suppliers",
              label: "Suppliers",
              onClick: () => setPath("suppliers"),
            },
          ],
        },
      ]}
    />
  );
};

export const WithHeader = () => {
  const [path, setPath] = useState("dashboard");
  return (
    <Sidebar
      selected={path}
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
      options={[
        {
          id: "dashboard",
          label: "Dashboard",
          onClick: () => setPath("dashboard"),
        },
        {
          id: "orders",
          label: "Orders",
          onClick: () => setPath("orders"),
        },
        {
          id: "inflow",
          label: "Inflow",
          onClick: () => setPath("inflow"),
        },
        {
          id: "outflow",
          label: "Outflow",
          onClick: () => setPath("outflow"),
        },
        {
          id: "statements",
          label: "Statements",
          onClick: () => setPath("statements"),
        },
      ]}
    />
  );
};

export const WithFooter = () => {
  const [path, setPath] = useState("dashboard");
  return (
    <Sidebar
      selected={path}
      options={[
        {
          id: "dashboard",
          label: "Dashboard",
          onClick: () => setPath("dashboard"),
        },
        {
          id: "orders",
          label: "Orders",
          onClick: () => setPath("orders"),
        },
        {
          id: "inflow",
          label: "Inflow",
          onClick: () => setPath("inflow"),
        },
        {
          id: "outflow",
          label: "Outflow",
          onClick: () => setPath("outflow"),
        },
        {
          id: "statements",
          label: "Statements",
          onClick: () => setPath("statements"),
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
            },
          ],
        },
      }}
    />
  );
};

export const All = () => {
  const [path, setPath] = useState("dashboard");
  return (
    <Sidebar
      selected={path}
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
      options={[
        {
          id: "financial",
          name: "Financial",
          Icon: Table,
          items: [
            {
              id: "dashboard",
              label: "Dashboard",
              onClick: () => setPath("dashboard"),
            },
            {
              id: "orders",
              label: "Orders",
              onClick: () => setPath("orders"),
            },
            {
              id: "inflow",
              label: "Inflow",
              onClick: () => setPath("inflow"),
            },
            {
              id: "outflow",
              label: "Outflow",
              onClick: () => setPath("outflow"),
            },
            {
              id: "statements",
              label: "Statements",
              onClick: () => setPath("statements"),
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
              onClick: () => setPath("customers"),
            },
            {
              id: "suppliers",
              label: "Suppliers",
              onClick: () => setPath("suppliers"),
            },
            {
              id: "employees",
              label: "Employees",
              onClick: () => setPath("employees"),
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
              onClick: () => setPath("products"),
            },
            {
              id: "services",
              label: "Services",
              onClick: () => setPath("services"),
            },
            {
              id: "vehicles",
              label: "Vehicles",
              onClick: () => setPath("vehicles"),
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
              onClick: () => setPath("documents"),
            },
            {
              id: "schedules",
              label: "Schedules",
              onClick: () => setPath("schedules"),
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
            },
          ],
        },
      }}
    />
  );
};
