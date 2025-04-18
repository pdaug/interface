// styles
import "./App.css";

// contexts
import { DialogElement, DialogProvider } from "./dialogs/Dialog";

// tests
import AvatarTest from "./avatars/Avatar.test";
import BadgeTest from "./badges/Badge.test";
import BreadcrumbTest from "./breadcrumbs/Breadcrumb.test";
import ButtonTest from "./buttons/Button.test";
import CalloutTest from "./callouts/Callout.test";
import DialogTest from "./dialogs/Dialog.test";
import DropdownTest from "./dropdowns/Dropdown.test";
import PaginationTest from "./paginations/Pagination.test";
import PanelTest from "./panels/Panel.test";
import ProfileTest from "./profiles/Profile.test";
import SectionTest from "./sections/Section.test";
import StatsTest from "./stats/Stats.test";
import TableTest from "./tables/Table.test";
import TooltipTest from "./tooltips/Tooltip.test";

const App = function () {
  return (
    <DialogProvider>
      <DialogElement />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          padding: "1rem",
        }}
      >
        <AvatarTest />
        <BadgeTest />
        <BreadcrumbTest />
        <ButtonTest />
        <CalloutTest />
        <DialogTest />
        <DropdownTest />
        <PaginationTest />
        <PanelTest />
        <ProfileTest />
        <SectionTest />
        <StatsTest />
        <TableTest />
        <TooltipTest />
      </div>
    </DialogProvider>
  );
};

export default App;
