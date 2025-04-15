// components
import Profile from "./Profile";

const ProfileTest = function () {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>Profile</div>
      <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
        <Profile
          name="Pedro Augusto"
          description="Developer"
          photo="http://picsum.photos/100/100"
          photoSize={48}
        />
        <Profile border name="John Doe" description="john@email.com" />
        <Profile border name="John Doe" />
      </div>
    </div>
  );
};

export default ProfileTest;
