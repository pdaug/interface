import type { StoryObj } from "@storybook/react";

import Button from "../buttons/Button";
import { Horizontal, Vertical } from "./Align";

export default {
  title: "Components/Align",
  tags: ["autodocs"],
};

export const AlignVertical: StoryObj = {
  render: () => (
    <Vertical internal={1}>
      <Button category="Primary" text="1" />
      <Button category="Primary" text="2" />
      <Button category="Primary" text="3" />
      <Button category="Primary" text="4" />
    </Vertical>
  ),
};

export const AlignHorizontal: StoryObj = {
  render: () => (
    <Horizontal internal={1}>
      <Button category="Primary" text="1" />
      <Button category="Primary" text="2" />
      <Button category="Primary" text="3" />
      <Button category="Primary" text="4" />
    </Horizontal>
  ),
};
