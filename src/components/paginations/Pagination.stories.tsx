import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Pagination from "./Pagination";
import { Center, Vertical } from "../aligns/Align";

export default {
  title: "Components/Pagination",
  tags: ["autodocs"],
  component: Pagination,
  decorators: (Story) => (
    <Center>
      <Story />
    </Center>
  ),
} as Meta;

export const Default: StoryObj = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Vertical internal={1}>
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
        display
        pageCurrent={page}
        pageSize={10}
        itemsTotal={42}
        setPage={setPage}
      />
    );
  },
};
