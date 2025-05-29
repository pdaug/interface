// styles
import "./App.css";

// contexts
import { ToastElement } from "./toasts/Toast";
import { DialogElement, DialogProvider } from "./dialogs/Dialog";

// tests
import DropdownTest from "./dropdowns/Dropdown.test";
import FormTest from "./forms/Form.test";
import PaginationTest from "./paginations/Pagination.test";
import PanelTest from "./panels/Panel.test";
import ProfileTest from "./profiles/Profile.test";
import SectionTest from "./sections/Section.test";
import StatsTest from "./stats/Stats.test";
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
        <DropdownTest />
        <FormTest />
        <PaginationTest />
        <PanelTest />
        <ProfileTest />
        <SectionTest />
        <StatsTest />
        <TableTest />
      </div>
    </DialogProvider>
  );
};

export default App;
