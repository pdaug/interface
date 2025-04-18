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
      className={`fadeui-profile ${border ? "fadeui-profile-border" : ""} ${padding ? "fadeui-profile-padding" : ""}`}
    >
      <div
        className="fadeui-profile-photo"
        style={{ height: photoSize, width: photoSize }}
      >
        {photo ? <img src={photo} alt={name} /> : <User />}
      </div>
      <div className="fadeui-profile-data">
        <div className="fadeui-profile-data-name">{name}</div>
        {description && (
          <div className="fadeui-profile-data-description">{description}</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
