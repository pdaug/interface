import { Icon } from "@phosphor-icons/react";

// styles
import "./Profile.css";
import Avatar from "../avatars/Avatar";
import Dropdown, { DropdownProps } from "../dropdowns/Dropdown";

export type ProfileProps = {
  name: React.ReactNode;
  border?: boolean;
  description?: React.ReactNode;
  photo?: string;
  photoSize?: number;
  photoCircle?: boolean;
  photoIcon?: Icon;
  padding?: boolean;
  styles?: React.CSSProperties;
  dropdown?: DropdownProps;
  dropdownChildren?: React.ReactElement;
};

const Profile = function ({
  border,
  padding = true,
  photo,
  photoSize = 4,
  photoCircle = false,
  photoIcon,
  name,
  description,
  styles,
  dropdown,
}: ProfileProps) {
  return (
    <div
      style={styles}
      className={`profile ${border ? "profileBorder" : ""} ${padding ? "profilePadding" : ""}`}
    >
      <div>
        <Avatar
          label={String(name)}
          photo={photo}
          size={photoSize}
          Icon={photoIcon}
          circle={photoCircle}
        />
      </div>
      <div className="profileData">
        <div className="profileDataName">{name}</div>
        {description && (
          <div className="profileDataDescription">{description}</div>
        )}
      </div>
      {dropdown && (
        <div className="profileDropdown">
          <Dropdown {...dropdown} />
        </div>
      )}
    </div>
  );
};

export default Profile;
