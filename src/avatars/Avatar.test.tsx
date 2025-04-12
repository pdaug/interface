import { Image } from "@phosphor-icons/react";

// components
import Avatar from "./Avatar";

const AvatarTest = function () {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>Avatar</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Avatar label="Text" size={4} />
        <Avatar label="Text" size={6} />
        <Avatar label="Text" size={8} />
        <Avatar label="Text" size={10} />
        <Avatar Icon={Image} label="Text" size={10} />
        <Avatar circle label="Text" size={10} />
      </div>
      <div style={{ display: "flex", gap: "1rem" }}></div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Avatar photo="http://picsum.photos/100/100" label="Photo" size={4} />
        <Avatar photo="http://picsum.photos/100/100" label="Photo" size={6} />
        <Avatar photo="http://picsum.photos/100/100" label="Photo" size={8} />
        <Avatar photo="http://picsum.photos/100/100" label="Photo" size={10} />
        <Avatar
          circle
          photo="http://picsum.photos/100/100"
          label="Photo"
          size={10}
        />
      </div>
    </div>
  );
};

export default AvatarTest;
