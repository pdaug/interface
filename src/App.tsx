// styles
import "./App.css";

// contexts
import { DialogElement, DialogProvider } from "./dialogs/Dialog";

// tests
import BadgeTest from "./badges/Badge.test";
import ButtonTest from "./buttons/Button.test";
import CalloutTest from "./callouts/Callout.test";
import DialogTest from "./dialogs/Dialog.test";

const App = function () {
  return (
    <DialogProvider>
      <DialogElement />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        <BadgeTest />
        <ButtonTest />
        <CalloutTest />
        <DialogTest />
      </div>
    </DialogProvider>
  );
};

export default App;
