import { User } from "@phosphor-icons/react";

// styles
import "./Profile.css";
import Avatar from "../avatars/Avatar";

export type ProfileProps = {
  name: string;
  border?: boolean;
  description?: string;
  photo?: string;
  photoSize?: number;
  padding?: boolean;
  styles?: React.CSSProperties;
};

const Profile = function ({
  border,
  photo,
  photoSize = 4,
  name,
  description,
  padding = true,
  styles,
}: ProfileProps) {
  return (
    <div
      style={styles}
      className={`fz-profile ${border ? "fz-profile-border" : ""} ${padding ? "fz-profile-padding" : ""}`}
    >
      <div>
        <Avatar
          label={name}
          size={photoSize}
          photo={photo}
          circle
          Icon={User}
        />
      </div>
      <div className="fz-profile-data">
        <div className="fz-profile-data-name">{name}</div>
        {description && (
          <div className="fz-profile-data-description">{description}</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
