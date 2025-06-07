import { Icon as IconPhosphor } from "@phosphor-icons/react";

// styles
import "./Sidebar.css";

// components
import Profile, { ProfileProps } from "../profiles/Profile";

export type SidebarMenu = {
  id: string;
  name: string;
  Icon: IconPhosphor;
  items: {
    id: string;
    label: string;
    onClick?: () => void;
  }[];
}[];

export type SidebarProps = {
  header: ProfileProps;
  menu: SidebarMenu;
  footer: ProfileProps;
};

const Sidebar = function ({ header, menu, footer }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebarContainer">
        <Profile {...header} />
        <div className="sidebarMenu">
          {menu?.map(function (menuGroup) {
            return (
              <div className="sidebarMenuGroup" key={menuGroup.id}>
                <div className="sidebarMenuName">
                  <menuGroup.Icon size={20} />
                  <span>{menuGroup.name}</span>
                </div>
                <div className="sidebarMenuContent">
                  {menuGroup?.items?.map(function (item) {
                    return (
                      <div
                        key={item.id}
                        onClick={item?.onClick}
                        className="sidebarMenuItem"
                      >
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <Profile {...footer} />
      </div>
    </div>
  );
};

export default Sidebar;
