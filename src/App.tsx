// styles
import "./App.css";

// contexts
import { DialogElement, DialogProvider } from "./dialog/Dialog";

// tests
import BadgeTest from "./badges/Badge.test";
import ButtonTest from "./buttons/Button.test";
import DialogTest from "./dialog/Dialog.test";

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
        <DialogTest />
      </div>
    </DialogProvider>
  );
};

export default App;
