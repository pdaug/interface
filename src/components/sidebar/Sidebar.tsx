import { Icon as IconPhosphor } from "@phosphor-icons/react";

// styles
import "./Sidebar.css";

// components
import Profile, { ProfileProps } from "../profiles/Profile";

export type SidebarMenuItem = {
  Icon?: IconPhosphor;
  id: string;
  label: string;
  onClick?: () => void;
};

export type SidebarOptions =
  | {
      id: string;
      name: string;
      Icon?: IconPhosphor;
      items: SidebarMenuItem[];
    }[]
  | SidebarMenuItem[];

export type SidebarProps = {
  selected: string;
  header?: ProfileProps;
  options: SidebarOptions;
  footer?: ProfileProps;
};

const Sidebar = function ({ selected, header, options, footer }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebarContainer">
        {header && <Profile {...header} />}
        <div className="sidebarMenu">
          {options?.map(function (groupOrItem) {
            return "items" in groupOrItem ? (
              <div className="sidebarMenuGroup" key={groupOrItem.id}>
                <div className="sidebarMenuName">
                  {groupOrItem.Icon && <groupOrItem.Icon size={20} />}
                  <span>{groupOrItem.name}</span>
                </div>
                <div className="sidebarMenuContent">
                  {groupOrItem?.items?.map(function (item) {
                    return (
                      <div
                        key={item.id}
                        onClick={item?.onClick}
                        className={`sidebarMenuItem ${selected === item.id ? "sidebarMenuItemSelected" : ""}`}
                      >
                        {item.Icon && <item.Icon size={16} />}
                        <span>{item.label}</span>
                      </div>
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
