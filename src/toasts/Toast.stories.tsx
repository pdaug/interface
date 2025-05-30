import React from "react";
import { toast } from "sonner";

import Button from "../buttons/Button";
import { ToastElement } from "./Toast";
import { Horizontal } from "../aligns/Align";

export default {
  title: "components/Toast",
  component: ToastElement,
  tags: ["autodocs"],
};

export const All = () => {
  return (
    <React.Fragment>
      <ToastElement />
      <Horizontal internal={1} styles={{ width: "30rem" }}>
        <Button
          category="primary"
          text="Primary"
          onClick={() =>
            toast.success(
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            )
          }
        />
        <Button
          category="secondary"
          text="Secondary"
          onClick={() =>
            toast.info(
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            )
          }
        />
        <Button
          category="warn"
          text="Warning"
          onClick={() =>
            toast.warning(
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            )
          }
        />
        <Button
          category="danger"
          text="Danger"
          onClick={() =>
            toast.error(
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            )
          }
        />
        <Button
          category="neutral"
          text="Neutral"
          onClick={() => {
            toast.loading(
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            );
          }}
        />
      </Horizontal>
    </React.Fragment>
  );
};
