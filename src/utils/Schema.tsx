import { toast } from "sonner";

// hooks
import useTranslate from "../hooks/useTranslate";

const Schema = function (err: string[]): void {
  const t = useTranslate();
  const errors = [];
  for (const item of err) {
    const splitted = item.split(".");
    const path = splitted.slice(1, -1).join(".");
    const stack = splitted[splitted.length - 1];
    const stackTranslated = t.stacks[stack as keyof typeof t.stacks] || stack;
    errors.push(`${path}: ${stackTranslated}`);
  }
  toast.warning(errors[0]);
  return;
};

export default Schema;
