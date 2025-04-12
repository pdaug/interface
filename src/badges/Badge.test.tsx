// components
import Badge from "./Badge";

const BadgeTest = function () {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>Badges</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Badge text="Badge Primary" category="primary" />
        <Badge text="Badge Secondary" category="secondary" />
        <Badge text="Badge Warning" category="warn" />
        <Badge text="Badge Danger" category="danger" />
        <Badge text="Badge Neutral" category="neutral" />
      </div>
    </div>
  );
};

export default BadgeTest;
