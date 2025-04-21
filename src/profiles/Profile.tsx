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
};

const Profile = function ({
  border,
  photo,
  photoSize = 3,
  name,
  description,
  padding = true,
}: ProfileProps) {
  return (
    <div
      className={`fadeui-profile ${border ? "fadeui-profile-border" : ""} ${padding ? "fadeui-profile-padding" : ""}`}
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
