import { toast } from "sonner";

// hooks
import useTranslate from "./useTranslate";

const useSchema = function () {
  const t = useTranslate();

  const Schema = function (err: string[]): void {
    const errors = [];
    for (const item of err) {
      const splitted = item.split(".");
      const path = splitted.slice(1, -1).join(".");
      const stack = splitted[splitted.length - 1];
      const stackTranslated =
        t.stacks?.[stack as keyof typeof t.stacks] || stack;
      errors.push(`${path}: ${stackTranslated}`);
    }
    toast.warning(t.toast.warning_error, {
      description: errors[0],
    });
    return;
  };

  return Schema;
};

export default useSchema;
