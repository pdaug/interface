import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "./Pagination";
import { Vertical } from "../aligns/Align";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Vertical internal={1} styles={{ width: "30rem" }}>
        <Pagination
          pageCurrent={page}
          pageSize={10}
          itemsTotal={42}
          setPage={setPage}
        />
      </Vertical>
    );
  },
};

export const WithData: StoryObj = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        data
        pageCurrent={page}
        pageSize={10}
        itemsTotal={42}
        setPage={setPage}
      />
    );
  },
};
