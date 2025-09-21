import { Icon as IconPhosphor } from "@phosphor-icons/react";

// styles
import "./Sidebar.css";

// components
import Profile, { ProfileProps } from "../profiles/Profile";

export type SidebarMenuItem = {
  Icon?: IconPhosphor;
  id: string;
  label: string;
  hidden?: boolean;
  onClick?: () => void;
};

export type SidebarOptions = (
  | {
      id: string;
      name: string;
      Icon?: IconPhosphor;
      items: SidebarMenuItem[];
      hidden?: boolean;
    }
  | SidebarMenuItem
)[];

export type SidebarProps = {
  selected: string;
  header?: ProfileProps;
  options: SidebarOptions;
  footer?: ProfileProps;
  styles?: React.CSSProperties;
  stylesMenu?: React.CSSProperties;
};

const Sidebar = function ({
  styles,
  stylesMenu,
  selected,
  header,
  options,
  footer,
}: SidebarProps) {
  return (
    <div className="sidebar" style={styles}>
      <div className="sidebarContainer">
        {header && <Profile {...header} />}
        <div className="sidebarMenu" style={stylesMenu}>
          {options?.map(function (groupOrItem) {
            if (groupOrItem.hidden) return;
            return "items" in groupOrItem ? (
              <div className="sidebarMenuGroup" key={groupOrItem.id}>
                <div className="sidebarMenuName">
                  {groupOrItem.Icon && <groupOrItem.Icon size={20} />}
                  <span>{groupOrItem.name}</span>
                </div>
                <div className="sidebarMenuContent">
                  {groupOrItem?.items?.map(function (item) {
                    if (item.hidden) return;
                    return (
                      <a
                        key={item.id}
                        href={item.id}
                        style={{ appearance: "none", textDecoration: "none" }}
                        onClick={function (event) {
                          event.preventDefault();
                          return;
                        }}
                      >
                        <div
                          onClick={item?.onClick}
                          className={`sidebarMenuItem ${selected.includes(item.id) ? "sidebarMenuItemSelected" : ""}`}
                        >
                          {item.Icon && <item.Icon size={16} />}
                          <span>{item.label}</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                key={groupOrItem.id}
                onClick={groupOrItem?.onClick}
                className={`sidebarMenuItem ${selected === groupOrItem.id ? "sidebarMenuItemSelected" : ""}`}
              >
                {groupOrItem.Icon && <groupOrItem.Icon size={16} />}
                <span>{groupOrItem.label}</span>
              </div>
            );
          })}
        </div>
        {footer && <Profile {...footer} />}
      </div>
    </div>
  );
};

export default Sidebar;
