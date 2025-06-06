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
  { category: "Success", name: "success" },
  { category: "Info", name: "info" },
  { category: "Warning", name: "warning" },
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
            text={category}
            category={category as ButtonCategories}
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
