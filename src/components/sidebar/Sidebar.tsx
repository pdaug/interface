// styles
import "./Sidebar.css";

// components
import Profile, { ProfileProps } from "../profiles/Profile";

export type SidebarProps = {
  header: ProfileProps;
  footer: ProfileProps;
};

const Sidebar = function ({ header, footer }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebarContainer">
        {/* header */}
        <Profile {...header} />
        {/* menu */}
        <div className="sidebarMenu"></div>
        {/* footer */}
        <Profile {...footer} />
      </div>
    </div>
  );
};

export default Sidebar;
