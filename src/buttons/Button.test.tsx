import { Cube } from "@phosphor-icons/react";

// components
import Button from "./Button";

const ButtonTest = function () {
  const dropdown = [
    {
      id: "option1",
      label: "Opção 1",
    },
    {
      id: "option2",
      Icon: Cube,
      label: "Opção 2",
    },
    {
      id: "option3",
      label: "Opção 3",
      disabled: true,
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>Buttons</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button text="Button Primary" category="primary" />
        <Button text="Button Secondary" category="secondary" />
        <Button text="Button Warning" category="warn" />
        <Button text="Button Danger" category="danger" />
        <Button text="Button Neutral" category="neutral" />
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button
          text=""
          Icon={Cube}
          IconWeight="fill"
          IconSize={20}
          category="primary"
        />
        <Button
          text=""
          Icon={Cube}
          IconWeight="fill"
          IconSize={20}
          category="secondary"
        />
        <Button
          text=""
          Icon={Cube}
          IconWeight="fill"
          IconSize={20}
          category="warn"
        />
        <Button
          text=""
          Icon={Cube}
          IconWeight="fill"
          IconSize={20}
          category="danger"
        />
        <Button
          text=""
          Icon={Cube}
          IconWeight="fill"
          IconSize={20}
          category="neutral"
        />
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button
          text="Button with Icon"
          Icon={Cube}
          IconWeight="fill"
          category="primary"
        />
        <Button
          text="Button with Icon"
          Icon={Cube}
          IconWeight="fill"
          category="secondary"
        />
        <Button
          text="Button with Icon"
          Icon={Cube}
          IconWeight="fill"
          category="warn"
        />
        <Button
          text="Button with Icon"
          Icon={Cube}
          IconWeight="fill"
          category="danger"
        />
        <Button
          text="Button with Icon"
          Icon={Cube}
          IconWeight="fill"
          IconPosition="right"
          category="neutral"
        />
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button
          text="Button with Dropdown"
          category="primary"
          dropdown={dropdown}
        />
        <Button
          text="Button with Dropdown"
          category="secondary"
          dropdown={dropdown}
        />
        <Button
          text="Button with Dropdown"
          category="warn"
          dropdown={dropdown}
        />
        <Button
          text="Button with Dropdown"
          category="danger"
          dropdown={dropdown}
        />
        <Button
          text="Button with Dropdown"
          category="neutral"
          dropdown={dropdown}
        />
      </div>
    </div>
  );
};

export default ButtonTest;
