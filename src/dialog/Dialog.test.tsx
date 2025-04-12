import { Cube } from "@phosphor-icons/react";

// components
import Button from "../buttons/Button";

// context
import { useDialog } from "./Dialog";

const DialogTest = function () {
  const { OpenDialog, CloseDialog } = useDialog();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button
          text="Open dialog"
          Icon={Cube}
          IconWeight="fill"
          IconPosition="right"
          category="neutral"
          onClick={function () {
            OpenDialog({
              title: "Título",
              category: "primary",
              description: "descrição",
              onConfirm: function () {
                console.log("Clicado");
                CloseDialog();
                return;
              },
            });
            return;
          }}
        />
      </div>
    </div>
  );
};

export default DialogTest;
