import {
  Plug,
  Info,
  House,
  Check,
  SignOut,
  GearSix,
  CaretDown,
  CreditCard,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// assets
import { MenuOptions } from "../assets/Menu";

// package
import { version as versionFrontend } from "../../package.json";

// hooks
import useSystem from "../hooks/useSystem";
import useSounds from "../hooks/useSounds";
import useTranslate from "../hooks/useTranslate";

// components
import Sidebar from "../components/sidebar/Sidebar";
import { Vertical } from "../components/aligns/Align";
import { useDialog } from "../components/dialogs/Dialog";
import { DropdownValue } from "../components/dropdowns/Dropdown";

const Menu = function () {
  const {
    user,
    instance,
    workspaces,
    workspaceId,
    version: versionBackend,
    clear,
    selectWorkspace,
  } = useSystem();
  const play = useSounds();
  const t = useTranslate();
  const navigate = useNavigate();
  const { OpenDialog } = useDialog();

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

  const options = MenuOptions.map(function (option) {
    return {
      id: option.id,
      name: t.menu[option.id as keyof typeof t.menu],
      Icon: option.icon,
      items: option.items.map(function (item) {
        return {
          id: `/f/${item}`,
          label: t.menu[item as keyof typeof t.menu],
          onClick: () => navigate(`/f/${item}`),
        };
      }),
    };
  });

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
          id: "integrations",
          Icon: Plug,
          label: t.menu.integrations,
          onClick: () => navigate("/f/integrations"),
        },
        {
          id: "settings",
          Icon: GearSix,
          label: t.menu.settings,
          onClick: () => navigate("/f/settings"),
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
                    {t.about.description}
                  </div>
                  <Vertical internal={0.4}>
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
                        disabled: true,
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
                          className="flex1 items-center"
                          style={{
                            fontSize: "var(--textSmall)",
                            gap: "0.2rem",
                          }}
                        >
                          <span>{item.label}</span>
                        </a>
                      );
                    })}
                  </Vertical>
                  <Vertical internal={0.2}>
                    <code style={{ fontSize: "var(--textSmall)" }}>
                      {t.about.version_backend}: {versionBackend}
                      <br />
                      {t.about.version_frontend}: {versionFrontend}
                    </code>
                  </Vertical>
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
      options={options}
      footer={footer}
    />
  );
};

export default Menu;
