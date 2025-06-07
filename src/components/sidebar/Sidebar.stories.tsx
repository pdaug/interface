import { Meta } from "@storybook/react";
import { CaretDown, GearSix } from "@phosphor-icons/react";

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
