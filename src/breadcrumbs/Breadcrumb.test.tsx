import { Buildings, House } from "@phosphor-icons/react";

// components
import Breadcrumb from "./Breadcrumb";

const BreadcrumbTest = function () {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>Breadcrumb</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Breadcrumb
          Icon={House}
          links={[
            {
              id: "financial",
              label: "Financial",
              url: "/financial",
            },
            {
              id: "financial_create",
              label: "Create",
              url: "/financial/create",
            },
          ]}
        />
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Breadcrumb
          Icon={Buildings}
          links={[
            {
              id: "corporation",
              label: "Corporation",
              url: "/corporation",
            },
            {
              id: "corporation_workspace",
              label: "Workspace",
              url: "/corporation/workspace",
            },
            {
              id: "corporation_workspace_johnsmith",
              label: "John Smith",
              url: "/corporation/workspace/JohnSmith",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default BreadcrumbTest;
