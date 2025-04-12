// components
import Button from "../buttons/Button";

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
              title: "Título",
              category: "danger",
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
