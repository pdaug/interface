// styles
import "./App.css";

// tests
import PaginationTest from "./paginations/Pagination.test";
import TableTest from "./tables/Table.test";

const App = function () {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4rem",
        padding: "1rem",
      }}
    >
      <PaginationTest />
      <TableTest />
    </div>
  );
};

export default App;
