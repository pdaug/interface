import { Cube } from "@phosphor-icons/react";

// components
import Dropdown from "./Dropdown";

const DropdownTest = function () {
  const values = [
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
      <div>Dropdowns</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Dropdown text="Dropdown Primary" category="primary" values={values} />
        <Dropdown
          text="Dropdown Secondary"
          category="secondary"
          values={values}
        />
        <Dropdown text="Dropdown Warning" category="warn" values={values} />
        <Dropdown text="Dropdown Danger" category="danger" values={values} />
        <Dropdown text="Dropdown Neutral" category="neutral" values={values} />
      </div>
    </div>
  );
};

export default DropdownTest;
