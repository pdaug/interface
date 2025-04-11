// styles
import "./App.css";

// tests
import ButtonTest from "./buttons/Button.test";

const App = function () {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      <ButtonTest />
    </div>
  );
};

export default App;
