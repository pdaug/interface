import {
  Cube,
  Table,
  Wrench,
  GearSix,
  CaretDown,
  SuitcaseSimple,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

// hooks
import useSystem from "../hooks/useSystem";
import useTranslate from "../hooks/useTranslate";

// components
import Sidebar from "../components/sidebar/Sidebar";

const MenuOptions = [
  {
    id: "financial",
    icon: Table,
    items: ["dashboard", "orders", "inflows", "outflows", "statements"],
  },
  {
    id: "administrative",
    icon: SuitcaseSimple,
    items: ["customers", "suppliers", "employees"],
  },
  {
    id: "operational",
    icon: Cube,
    items: ["products", "services", "vehicles"],
  },
  {
    id: "tools",
    icon: Wrench,
    items: ["documents", "schedules"],
  },
];

const Menu = function () {
  const t = useTranslate();
  const navigate = useNavigate();
  const { user, instance, workspaces, clear } = useSystem();

  if (!instance || !user) return;

  const selected = location.pathname.replace("/f/", "");

  const header = {
    name: instance?.companyName,
    description: instance?.paymentPlan || "standard",
    dropdown: {
      children: (
        <div className="cursor">
          <CaretDown />
        </div>
      ),
      values: workspaces?.map(function (workspace) {
        return {
          id: workspace.id,
          label: workspace.name,
        };
      }),
    },
  };

  const options = MenuOptions.map(function (option) {
    return {
      id: option.id,
      name: t.menu[option.id as keyof typeof t.menu],
      Icon: option.icon,
      items: option.items.map(function (item) {
        return {
          id: item,
          label: t.menu[item as keyof typeof t.menu],
          onClick: () => navigate(`/f/${item}`),
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
      selected={selected}
      header={header}
      options={options}
      footer={footer}
    />
  );
};

export default Menu;
