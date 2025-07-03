import { toast } from "sonner";

// hooks
import useTranslate from "../hooks/useTranslate";

const Schema = function (err: string[]): void {
  const t = useTranslate();
  const errors = [];
  for (const item of err) {
    const splitted = item.split(".");
    const module = splitted[0];
    const moduleTranslated =
      t.modules[module as keyof typeof t.modules] || module;
    const path = splitted.slice(1, -1).join(".");
    const stack = splitted[splitted.length - 1];
    const stackTranslated = t.stacks[stack as keyof typeof t.stacks] || stack;
    errors.push(
      `${t.toast.field} "${path}" ${t.toast.in} ${moduleTranslated}: ${stackTranslated}`,
    );
  }
  toast.warning(errors[0]);
  return;
};

export default Schema;
