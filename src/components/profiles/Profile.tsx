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
      className={`profile ${border ? "profileBorder" : ""} ${padding ? "profilePadding" : ""}`}
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
      <div className="profileData">
        <div className="profileDataName">{name}</div>
        {description && (
          <div className="profileDataDescription">{description}</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
