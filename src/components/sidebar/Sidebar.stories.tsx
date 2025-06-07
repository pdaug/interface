import {
  Bank,
  CaretDown,
  GearSix,
  IdentificationCard,
  Package,
} from "@phosphor-icons/react";
import { Meta } from "@storybook/react";

import Sidebar from "./Sidebar";

export default {
  title: "components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
} as Meta;

export const Default = () => {
  return (
    <Sidebar
      header={{
        padding: true,
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
          Icon: Bank,
          items: [
            {
              id: "dashboard",
              label: "Dashboard",
            },
            {
              id: "orders",
              label: "Orders",
            },
            {
              id: "inflow",
              label: "Inflow",
            },
            {
              id: "outflow",
              label: "Outflow",
            },
            {
              id: "operation_statement",
              label: "Operation Statement",
            },
          ],
        },
        {
          id: "administrative",
          name: "Administrative",
          Icon: IdentificationCard,
          items: [
            {
              id: "customers",
              label: "Customers",
            },
            {
              id: "employees",
              label: "Employees",
            },
            {
              id: "suppliers",
              label: "Suppliers",
            },
          ],
        },
        {
          id: "operational",
          name: "Operational",
          Icon: Package,
          items: [
            {
              id: "products",
              label: "Products",
            },
            {
              id: "services",
              label: "Services",
            },
            {
              id: "vehicles",
              label: "Vehicles",
            },
          ],
        },
      ]}
      footer={{
        padding: true,
        name: "User John Doe",
        photoCircle: true,
        dropdown: {
          children: (
            <div className="cursor">
              <GearSix />
            </div>
          ),
          values: [
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
