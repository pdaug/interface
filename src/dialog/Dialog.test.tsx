import Button from "../buttons/Button";

// components
import { Trash } from "@phosphor-icons/react";

// context
import { useDialog } from "./Dialog";

const DialogTest = function () {
  const { OpenDialog, CloseDialog } = useDialog();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>Dialogs</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button
          text="Dialog Primary"
          category="primary"
          onClick={function () {
            OpenDialog({
              title: "Título",
              category: "primary",
              description: "descrição",
              confirmText: "Confirmar",
              onConfirm: function () {
                console.log("Clicado");
                CloseDialog();
                return;
              },
            });
            return;
          }}
        />
        <Button
          text="Dialog Secondary"
          category="secondary"
          onClick={function () {
            OpenDialog({
              title: "Título",
              category: "secondary",
              description: "descrição",
              confirmText: "Confirmar",
              onConfirm: function () {
                console.log("Clicado");
                CloseDialog();
                return;
              },
            });
            return;
          }}
        />
        <Button
          text="Dialog Warning"
          category="warn"
          onClick={function () {
            OpenDialog({
              title: "Título",
              category: "warn",
              description: "descrição",
              confirmText: "Confirmar",
              onConfirm: function () {
                console.log("Clicado");
                CloseDialog();
                return;
              },
            });
            return;
          }}
        />
        <Button
          text="Dialog Danger"
          category="danger"
          onClick={function () {
            OpenDialog({
              Icon: Trash,
              title: "Título",
              category: "danger",
              description: "descrição",
              confirmIcon: Trash,
              confirmText: "Deletar",
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
