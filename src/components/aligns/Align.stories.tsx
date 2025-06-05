import type { StoryObj } from "@storybook/react";

import Button from "../buttons/Button";
import { Center, Horizontal, Vertical } from "./Align";

export default {
  title: "Components/Align",
  tags: ["autodocs"],
};

export const AlignVertical: StoryObj = {
  render: () => (
    <Center>
      <Vertical internal={1}>
        <Button category="Primary" text="1" />
        <Button category="Primary" text="2" />
        <Button category="Primary" text="3" />
        <Button category="Primary" text="4" />
      </Vertical>
    </Center>
  ),
};

export const AlignHorizontal: StoryObj = {
  render: () => (
    <Center>
      <Horizontal internal={1}>
        <Button category="Primary" text="1" />
        <Button category="Primary" text="2" />
        <Button category="Primary" text="3" />
        <Button category="Primary" text="4" />
      </Horizontal>
    </Center>
  ),
};
