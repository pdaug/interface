import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { GearSix, CaretDown, LinkSimple } from "@phosphor-icons/react";

// assets
import { MenuOptions } from "../assets/Menu";

// package
import { version as versionFrontend } from "../../package.json";

// hooks
import useSystem from "../hooks/useSystem";
import useTranslate from "../hooks/useTranslate";

// components
import Sidebar from "../components/sidebar/Sidebar";
import { Vertical } from "../components/aligns/Align";
import { useDialog } from "../components/dialogs/Dialog";
import { DropdownValue } from "../components/dropdowns/Dropdown";

const Menu = function () {
  const t = useTranslate();
  const navigate = useNavigate();
  const { OpenDialog } = useDialog();
  const {
    user,
    instance,
    workspaces,
    workspaceId,
    version: versionBackend,
    clear,
    selectWorkspace,
  } = useSystem();

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
          id: "about",
          label: t.menu.about,
          onClick: function () {
            OpenDialog({
              category: "Success",
              title: t.about.title,
              cancelText: t.components.close,
              description: (
                <Vertical internal={1}>
                  <div style={{ fontSize: "var(--textSmall)" }}>
                    {t.about.description}
                  </div>
                  <Vertical internal={0.4}>
                    {[
                      {
                        id: "api",
                        label: t.about.api,
                        url: "https://api.forzasistemas.com/",
                      },
                      {
                        id: "website",
                        label: t.about.website,
                        url: "https://forzasistemas.com/",
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
                      return (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            alignItems: "center",
                            display: "flex",
                            fontSize: "var(--textSmall)",
                            gap: "0.2rem",
                          }}
                        >
                          <LinkSimple />
                          <span>{item.label}</span>
                        </a>
                      );
                    })}
                  </Vertical>
                  <Vertical internal={0.2}>
                    <div style={{ fontSize: "var(--textSmall)" }}>
                      {t.about.version_backend}: {versionBackend}
                    </div>
                    <div style={{ fontSize: "var(--textSmall)" }}>
                      {t.about.version_frontend}: {versionFrontend}
                    </div>
                  </Vertical>
                </Vertical>
              ),
            });
            return;
          },
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
