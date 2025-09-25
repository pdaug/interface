import {
  Plug,
  Info,
  House,
  Truck,
  Users,
  Table,
  Check,
  Wrench,
  SignOut,
  GearSix,
  CaretDown,
  CreditCard,
  FolderSimple,
  SuitcaseSimple,
  ShoppingBagOpen,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// package
// import { version as versionFrontend } from "../../package.json";

// hooks
import useSystem from "../hooks/useSystem";
import useSounds from "../hooks/useSounds";
import useTranslate from "../hooks/useTranslate";
import usePermission from "../hooks/usePermission";

// components
import { useDialog } from "../components/dialogs/Dialog";
import { DropdownValue } from "../components/dropdowns/Dropdown";
import { Horizontal, Vertical } from "../components/aligns/Align";
import Sidebar, { SidebarOptions } from "../components/sidebar/Sidebar";

const Menu = function () {
  const {
    user,
    instance,
    workspaces,
    workspaceId,
    // version: versionBackend,
    clear,
    selectWorkspace,
  } = useSystem();
  const play = useSounds();
  const t = useTranslate();
  const navigate = useNavigate();
  const { OpenDialog } = useDialog();
  const { checkByPlan, checkByRole } = usePermission();

  const workspaceOptions = workspaces
    ?.map(function (workspace) {
      if (!workspace.status) return;
      return {
        id: workspace.id,
        label: workspace.name,
        Icon: workspace.id === workspaceId ? Check : Check,
        IconColor:
          workspace.id === workspaceId
            ? "var(--successColor)"
            : "var(--borderDark)",
        IconWeight: workspace.id === workspaceId ? "bold" : "regular",
        onClick: function () {
          if (workspace.id === workspaceId) {
            play("alert");
            toast.warning(t.toast.warning_error, {
              description: t.workspace.already_selected_workspace,
            });
            return;
          }
          selectWorkspace(workspace.id);
          play("ok");
          toast.success(t.toast.success, {
            description: t.toast.success_workspace,
          });
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
      })?.name || "",
    dropdown: {
      children: (
        <div className="cursor">
          <CaretDown />
        </div>
      ),
      values: workspaceOptions as DropdownValue[],
    },
  };

  const MenuOptions: SidebarOptions = [
    {
      id: "dashboard",
      label: t.menu.dashboard,
      onClick: () => navigate("/f"),
    },
    {
      id: "financial",
      name: t.menu.financial,
      Icon: Table,
      items: [
        {
          id: "inflow",
          label: t.menu.inflows,
          onClick: () => navigate("/f/inflows"),
        },
        {
          id: "outflows",
          label: t.menu.outflows,
          onClick: () => navigate("/f/outflows"),
        },
        {
          id: "recurrences",
          label: t.menu.recurrences,
          onClick: () => navigate("/f/recurrences"),
        },
        {
          id: "statements",
          label: t.menu.statements,
          onClick: () => navigate("/f/statements"),
        },
      ],
    },
    {
      id: "administrative",
      name: t.menu.administrative,
      Icon: SuitcaseSimple,
      items: [
        {
          id: "customers",
          label: t.menu.customers,
          onClick: () => navigate("/f/customers"),
        },
        {
          id: "suppliers",
          label: t.menu.suppliers,
          onClick: () => navigate("/f/suppliers"),
        },
      ],
    },
    {
      id: "product",
      name: t.menu.products,
      Icon: ShoppingBagOpen,
      hidden: !checkByPlan("advanced"),
      items: [
        {
          id: "products",
          label: t.menu.products,
          onClick: () => navigate("/f/products"),
        },
        {
          id: "sales",
          label: t.menu.sales,
          onClick: () => navigate("/f/sales"),
        },
        {
          id: "purchases",
          label: t.menu.purchases,
          onClick: () => navigate("/f/purchases"),
        },
      ],
    },
    {
      id: "service",
      name: t.menu.services,
      Icon: Truck,
      hidden: !checkByPlan("advanced"),
      items: [
        {
          id: "services",
          label: t.menu.services,
          onClick: () => navigate("/f/services"),
        },
        {
          id: "orders",
          label: t.menu.orders,
          onClick: () => navigate("/f/orders"),
        },
        {
          id: "vehicles",
          label: t.menu.vehicles,
          onClick: () => navigate("/f/vehicles"),
        },
      ],
    },
    {
      id: "tools",
      name: t.menu.tools,
      Icon: Wrench,
      hidden: !checkByPlan("advanced"),
      items: [
        {
          id: "automations",
          label: t.menu.automations,
          onClick: () => navigate("/f/automations"),
        },
        {
          id: "documents",
          label: t.menu.documents,
          onClick: () => navigate("/f/documents"),
        },
        {
          id: "schedules",
          label: t.menu.schedules,
          onClick: () => navigate("/f/schedules"),
        },
      ],
    },
  ];

  const footer = {
    name: user.name as string,
    description: user.email as string,
    photo: user.photo || "",
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
          Icon: House,
          label: t.menu.workspaces,
          onClick: () => navigate("/f/workspaces"),
        },
        {
          id: "accounts",
          Icon: CreditCard,
          label: t.menu.accounts,
          onClick: () => navigate("/f/accounts"),
        },
        {
          id: "users",
          Icon: Users,
          label: t.menu.users,
          onClick: () => navigate("/f/users"),
        },
        {
          id: "integrations",
          Icon: Plug,
          label: t.menu.integrations,
          disabled: !checkByPlan("advanced"),
          hidden: !checkByRole("admin"),
          onClick: () => navigate("/f/integrations"),
        },
        {
          id: "settings",
          Icon: GearSix,
          label: t.menu.settings,
          hidden: !checkByRole("admin"),
          onClick: () => navigate("/f/settings"),
        },
        {
          id: "plans",
          Icon: FolderSimple,
          label: t.menu.plans,
          hidden: !checkByRole("admin"),
          onClick: () => navigate("/f/plans"),
        },
        {
          id: "about",
          Icon: Info,
          label: t.menu.about,
          onClick: function () {
            OpenDialog({
              category: "Success",
              title: t.about.title,
              cancelText: t.components.close,
              description: (
                <Vertical internal={1}>
                  <div style={{ fontSize: "var(--textSmall)" }}>
                    {new Date().getFullYear()} {t.about.description}
                  </div>
                  <Horizontal internal={1}>
                    {[
                      {
                        id: "api",
                        label: t.about.api,
                        url: "https://api.forzasistemas.com/",
                        disabled: true,
                      },
                      {
                        id: "website",
                        label: t.about.website,
                        url: "https://forzasistemas.com/",
                        disabled: false,
                      },
                      {
                        id: "docs",
                        label: t.about.docs,
                        url: "https://docs.forzasistemas.com/",
                      },
                      {
                        id: "uptime",
                        label: t.about.uptime,
                        url: "https://stats.uptimerobot.com/qhHnk9zxJa",
                      },
                    ].map(function (item) {
                      if (item?.disabled) return;
                      return (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="itemsCenter"
                          style={{
                            fontSize: "var(--textSmall)",
                            gap: "0.2rem",
                          }}
                        >
                          <span>{item.label}</span>
                        </a>
                      );
                    })}
                  </Horizontal>
                  {/* <Vertical internal={0.2}>
                    <code style={{ fontSize: "var(--textSmall)" }}>
                      {t.about.version_backend}: {versionBackend}
                      <br />
                      {t.about.version_frontend}: {versionFrontend}
                    </code>
                  </Vertical> */}
                </Vertical>
              ),
            });
            return;
          },
        },
        {
          id: "logout",
          Icon: SignOut,
          label: t.menu.logout,
          styles: { color: "var(--dangerColor)" },
          IconColor: "var(--dangerColor)",
          onClick: async function () {
            await play("logout");
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
      options={MenuOptions}
      footer={footer}
    />
  );
};

export default Menu;
