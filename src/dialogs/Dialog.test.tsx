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
              title:
                "Nunc ullamcorper cursus neque, in sollicitudin erat aliquam vehicula. Phasellus finibus, dui et suscipit finibus, tellus nibh maximus nibh, vel semper enim magna eu nisl.",
              category: "secondary",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices facilisis metus sed mollis. Fusce elit lorem, efficitur ut sem eu, laoreet tempor mauris. Nullam nisl libero, facilisis ut dapibus in, eleifend in urna. Nulla facilisi. Donec scelerisque leo vitae semper pharetra. Vivamus ex turpis, laoreet sed nisi eget, tristique pretium mi. Ut vel neque ultricies, congue mauris nec, scelerisque est. Vivamus ultrices pellentesque eros, a semper ex posuere et. Donec lacinia magna mauris, id ullamcorper dolor vulputate non. Quisque vel luctus lectus, vel aliquam magna. Proin viverra viverra mi, in maximus metus semper nec. Pellentesque gravida sollicitudin lacinia. Nunc ullamcorper cursus neque, in sollicitudin erat aliquam vehicula. Phasellus finibus, dui et suscipit finibus, tellus nibh maximus nibh, vel semper enim magna eu nisl.",
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
