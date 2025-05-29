// styles
import "./App.css";

// contexts
import { ToastElement } from "./toasts/Toast";
import { DialogElement, DialogProvider } from "./dialogs/Dialog";

// tests
import PaginationTest from "./paginations/Pagination.test";
import PanelTest from "./panels/Panel.test";
import SectionTest from "./sections/Section.test";
import TableTest from "./tables/Table.test";

const App = function () {
  return (
    <DialogProvider>
      <DialogElement />
      <ToastElement />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          padding: "1rem",
        }}
      >
        <PaginationTest />
        <PanelTest />
        <SectionTest />
        <TableTest />
      </div>
    </DialogProvider>
  );
};

export default App;
