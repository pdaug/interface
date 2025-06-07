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
      companyLogo=""
      companyName="Company Example Large Name Long SA"
      workspaceName="My Workspace Name Long Large"
      userName="John Doe Large Name Person Testing"
    />
  );
};
