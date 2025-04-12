import { Icon as PhosphorIcon } from "@phosphor-icons/react";

// styles
import "./Avatar.css";

export type AvatarProps = {
  label: string;
  size: number;
  circle?: boolean;
  Icon?: PhosphorIcon;
  photo?: string;
};

const Avatar = function ({
  label,
  size = 4,
  circle,
  Icon,
  photo,
}: AvatarProps) {
  const iconPixel = size * 4;
  const sizePixel = size * 8;
  const fontPixel = size * 4;
  return (
    <div
      style={{ height: sizePixel, width: sizePixel }}
      className={`baseui-avatar ${circle ? "baseui-avatar-circle" : ""}`}
    >
      {photo ? (
        <img src={photo} alt={label} />
      ) : Icon ? (
        <Icon size={iconPixel} />
      ) : (
        <span style={{ fontSize: fontPixel }}>{label[0] || "A"}</span>
      )}
    </div>
  );
};

export default Avatar;
