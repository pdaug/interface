// styles
import "./App.css";

// contexts
import { DialogElement, DialogProvider } from "./dialog/Dialog";

// tests
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
        <ButtonTest />
        <DialogTest />
      </div>
    </DialogProvider>
  );
};

export default App;
