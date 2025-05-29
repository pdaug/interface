import { toast } from "sonner";

import Button from "../buttons/Button";
import { ToastElement } from "./Toast";

export default {
  title: "components/Toast",
  component: ToastElement,
  tags: ["autodocs"],
};

export const All = () => {
  return (
    <>
      <ToastElement />
      <div
        style={{
          display: "flex",
          gap: "1rem",
          padding: "1rem",
        }}
      >
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
      </div>
    </>
  );
};
