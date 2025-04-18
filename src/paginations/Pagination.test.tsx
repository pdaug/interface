import { useState } from "react";

// components
import Pagination from "./Pagination";

const PaginationTest = function () {
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>Pagination</div>
      <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
        <Pagination
          pageCurrent={currentPage1}
          pageSize={10}
          itemsTotal={100}
          setPage={setCurrentPage1}
        />
        <Pagination
          pageCurrent={currentPage2}
          pageSize={10}
          itemsTotal={10000}
          setPage={setCurrentPage2}
        />
      </div>
    </div>
  );
};

export default PaginationTest;
