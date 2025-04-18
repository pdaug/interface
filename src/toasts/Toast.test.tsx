import { toast } from "sonner";

// components
import Button from "../buttons/Button";

const ToastTest = function () {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>Toasts</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button
          text="Toast Success"
          category="primary"
          onClick={function () {
            toast.success("Toast Success");
            return;
          }}
        />
        <Button
          text="Toast Info"
          category="secondary"
          onClick={function () {
            toast.info("Toast Info");
            return;
          }}
        />
        <Button
          text="Toast Warning"
          category="warn"
          onClick={function () {
            toast.warning("Toast Warning");
            return;
          }}
        />
        <Button
          text="Toast Danger"
          category="danger"
          onClick={function () {
            toast.error("Toast Danger");
            return;
          }}
        />
        <Button
          text="Toast Neutral"
          category="neutral"
          onClick={function () {
            toast.message("Toast Neutral");
            return;
          }}
        />
      </div>
    </div>
  );
};

export default ToastTest;
