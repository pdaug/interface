import { Meta } from "@storybook/react";
import { Gear, Trash, SignOut, UserCircle } from "@phosphor-icons/react";

import Dropdown from "./Dropdown";

export default {
  title: "Components/Dropdown",
  component: Dropdown,
} as Meta;

export const Default = () => {
  const handleSelect = (label: string) => () =>
    alert(`Opção selecionada: ${label}`);

  return (
    <div style={{ padding: "2rem" }}>
      <Dropdown
        text="Menu"
        category="primary"
        values={[
          {
            id: "1",
            label: "Configurações",
            Icon: Gear,
            onClick: handleSelect("Configurações"),
          },
          {
            id: "2",
            label: "Perfil",
            Icon: UserCircle,
            onClick: handleSelect("Perfil"),
          },
          {
            id: "3",
            label: "Sair",
            Icon: SignOut,
            onClick: handleSelect("Sair"),
          },
          {
            id: "4",
            label: "Deletar conta",
            Icon: Trash,
            disabled: true,
          },
        ]}
      />
    </div>
  );
};
