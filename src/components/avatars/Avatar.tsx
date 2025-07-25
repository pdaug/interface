import { Icon as PhosphorIcon } from "@phosphor-icons/react";

// styles
import "./Avatar.css";

export type AvatarStatus = "Primary" | "Secondary" | "Warning" | "Danger";

export type AvatarProps = {
  label: string;
  size: number | [number, number];
  circle?: boolean;
  Icon?: PhosphorIcon;
  photo?: string;
  status?: AvatarStatus;
};

const Avatar = function ({
  label,
  size = 4,
  circle,
  Icon,
  photo,
  status,
}: AvatarProps) {
  const iconPixel = (Array.isArray(size) ? size[0] : size) * 4;
  const sizePixel = (Array.isArray(size) ? size[0] : size) * 8;
  const fontPixel = (Array.isArray(size) ? size[0] : size) * 4;
  const outlinePixel = (Array.isArray(size) ? size[0] : size) / 2;
  return (
    <div>
      <div
        style={{
          height: Array.isArray(size) ? size[0] * 8 : sizePixel,
          width: Array.isArray(size) ? size[1] * 8 : sizePixel,
          outlineWidth: outlinePixel,
        }}
        className={`avatar ${circle ? "avatarCircle" : ""} ${status ? `avatar${status}` : ""}`}
      >
        {photo ? (
          <img src={photo} alt={label} />
        ) : Icon ? (
          <Icon size={iconPixel} />
        ) : (
          <span style={{ fontSize: fontPixel }}>{label[0] || "A"}</span>
        )}
      </div>
    </div>
  );
};

export default Avatar;
