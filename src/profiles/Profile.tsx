import { User } from "@phosphor-icons/react";

// styles
import "./Profile.css";

export type ProfileProps = {
  name: string;
  border?: boolean;
  description?: string;
  photo?: string;
  photoSize?: number;
  padding?: boolean;
};

const Profile = function ({
  border,
  photo,
  photoSize = 32,
  name,
  description,
  padding = true,
}: ProfileProps) {
  return (
    <div
      className={`baseui-profile ${border ? "baseui-profile-border" : ""} ${padding ? "baseui-profile-padding" : ""}`}
    >
      <div
        className="baseui-profile-photo"
        style={{ height: photoSize, width: photoSize }}
      >
        {photo ? <img src={photo} alt={name} /> : <User />}
      </div>
      <div className="baseui-profile-data">
        <div className="baseui-profile-data-name">{name}</div>
        {description && (
          <div className="baseui-profile-data-description">{description}</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
