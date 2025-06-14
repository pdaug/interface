import type { StoryObj } from "@storybook/react";

import Button from "../buttons/Button";
import { Center, Horizontal, Vertical } from "./Align";

export default {
  title: "Components/Align",
  tags: ["autodocs"],
};

export const AlignCenter: StoryObj = {
  render: () => (
    <Center>
      <Button category="Success" text="Center" />
    </Center>
  ),
};

export const AlignVertical: StoryObj = {
  render: () => (
    <Center>
      <Vertical internal={1}>
        <Button category="Success" text="Vertical 1" />
        <Button category="Success" text="Vertical 2" />
        <Button category="Success" text="Vertical 3" />
      </Vertical>
    </Center>
  ),
};

export const AlignHorizontal: StoryObj = {
  render: () => (
    <Center>
      <Horizontal internal={1}>
        <Button category="Success" text="Horizontal 1" />
        <Button category="Success" text="Horizontal 2" />
        <Button category="Success" text="Horizontal 3" />
      </Horizontal>
    </Center>
  ),
};
