import React from "react";
import { toast } from "sonner";

import { ToastElement } from "./Toast";
import { Horizontal } from "../aligns/Align";
import Button, { ButtonCategories } from "../buttons/Button";

export default {
  title: "components/Toast",
  component: ToastElement,
  tags: ["autodocs"],
};

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
    <React.Fragment>
      <ToastElement />
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
    </React.Fragment>
  );
};
