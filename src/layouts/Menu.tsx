import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { GearSix, CaretDown } from "@phosphor-icons/react";

// assets
import { MenuOptions } from "../assets/Menu";

// hooks
import useSystem from "../hooks/useSystem";
import useTranslate from "../hooks/useTranslate";

// components
import Sidebar from "../components/sidebar/Sidebar";
import { DropdownValue } from "../components/dropdowns/Dropdown";

const Menu = function () {
  const t = useTranslate();
  const navigate = useNavigate();
  const { user, instance, workspaces, workspaceId, clear, selectWorkspace } =
    useSystem();

  const workspaceOptions = workspaces
    ?.map(function (workspace) {
      if (!workspace.status) return;
      return {
        id: workspace.id,
        label: workspace.name,
        onClick: function () {
          if (workspace.id === workspaceId) {
            toast.warning(t.workspace.already_selected_workspace);
            return;
          }
          selectWorkspace(workspace.id);
          toast.success(t.toast.success_workspace);
          return;
        },
      } as DropdownValue;
    })
    ?.filter(Boolean);

  const header = {
    name: instance?.companyName,
    photo: instance?.logo || "",
    description:
      workspaces?.find(function (workspace) {
        if (!workspace.status) return;
        return workspaceId == workspace?.id;
      })?.name || "no_workspace",
    dropdown: {
      children: (
        <div className="cursor">
          <CaretDown />
        </div>
      ),
      values: workspaceOptions as DropdownValue[],
    },
  };

  const options = MenuOptions.map(function (option) {
    return {
      id: option.id,
      name: t.menu[option.id as keyof typeof t.menu],
      Icon: option.icon,
      items: option.items.map(function (item) {
        return {
          id: `/f/${option.id}/${item}`,
          label: t.menu[item as keyof typeof t.menu],
          onClick: () => navigate(`/f/${option.id}/${item}`),
        };
      }),
    };
  });

  const footer = {
    name: user.name as string,
    description: user.email as string,
    photoCircle: true,
    dropdown: {
      children: (
        <div className="cursor">
          <GearSix />
        </div>
      ),
      values: [
        {
          id: "workspaces",
          label: t.menu.workspaces,
          onClick: () => navigate("/f/workspaces"),
        },
        {
          id: "integrations",
          label: t.menu.integrations,
          onClick: () => navigate("/f/integrations"),
        },
        {
          id: "accounts",
          label: t.menu.accounts,
          onClick: () => navigate("/f/accounts"),
        },
        {
          id: "settings",
          label: t.menu.settings,
          onClick: () => navigate("/f/settings"),
        },
        {
          id: "logout",
          label: t.menu.logout,
          onClick: function () {
            clear();
            navigate("/");
            return;
          },
        },
      ],
    },
  };

  return (
    <Sidebar
      selected={location.pathname}
      header={header}
      options={options}
      footer={footer}
    />
  );
};

export default Menu;
