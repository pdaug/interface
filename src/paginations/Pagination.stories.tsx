import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        pageCurrent={page}
        pageSize={10}
        itemsTotal={42}
        setPage={setPage}
      />
    );
  },
};
