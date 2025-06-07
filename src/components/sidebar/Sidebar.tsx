import { Briefcase, CaretDown, GearSix, User } from "@phosphor-icons/react";

// styles
import "./Sidebar.css";

// components
import Dropdown from "../dropdowns/Dropdown";

export type SidebarProps = {
  companyLogo?: string;
  companyName: string;
  workspaceName: string;
  userPhoto?: string;
  userName: string;
};

const Sidebar = function ({
  companyLogo,
  companyName,
  workspaceName,
  userPhoto,
  userName,
}: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebarContainer">
        {/* header */}
        <div className="sidebarHeader">
          <div className="sidebarHeaderImage">
            {companyLogo ? (
              <img src={companyLogo} alt="logo" />
            ) : (
              <Briefcase size={20} />
            )}
          </div>
          <div className="sidebarHeaderInfo">
            <div className="sidebarHeaderInfoCompany">{companyName}</div>
            <div className="sidebarHeaderInfoWorkspace">{workspaceName}</div>
          </div>
          <Dropdown
            values={[
              { id: "workspace1", label: "Workspace 1" },
              { id: "workspace2", label: "Workspace 2" },
            ]}
          >
            <CaretDown />
          </Dropdown>
        </div>
        {/* menu */}
        <div className="sidebarMenu"></div>
        {/* footer */}
        <div className="sidebarFooter">
          <div className="sidebarFooterPhoto">
            {userPhoto ? (
              <img src={userPhoto} alt="logo" />
            ) : (
              <User size={20} />
            )}
          </div>
          <div className="sidebarFooterName">
            <span>{userName}</span>
          </div>
          <Dropdown
            values={[
              { id: "workspace1", label: "Workspace 1" },
              { id: "workspace2", label: "Workspace 2" },
            ]}
          >
            <GearSix />
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
