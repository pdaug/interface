import { toast } from "sonner";
import { Meta } from "@storybook/react";

import { ToastElement } from "./Toast";
import { Center, Horizontal } from "../aligns/Align";
import Button, { ButtonCategories } from "../buttons/Button";

export default {
  title: "components/Toast",
  component: ToastElement,
  tags: ["autodocs"],
  decorators: (Story) => (
    <Center>
      <ToastElement />
      <Story />
    </Center>
  ),
} as Meta;

type toastTypes = "success" | "info" | "warning" | "error" | "message";

const toasts = [
  { category: "Primary", name: "success" },
  { category: "Secondary", name: "info" },
  { category: "Warn", name: "warning" },
  { category: "Danger", name: "error" },
  { category: "Neutral", name: "message" },
];

export const All = () => {
  return (
    <Horizontal internal={1} styles={{ width: "30rem" }}>
      {toasts.map(function ({ category, name }) {
        return (
          <Button
            key={category}
            category={category as ButtonCategories}
            text={category}
            onClick={() =>
              toast[name as toastTypes](
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              )
            }
          />
        );
      })}
    </Horizontal>
  );
};
