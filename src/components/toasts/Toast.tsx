import { Toaster, ToasterProps } from "sonner";

// icons
import {
  Info,
  Warning,
  CheckCircle,
  WarningOctagon,
} from "@phosphor-icons/react";

// styles
import "./Toast.css";

const toastIcons = {
  success: <CheckCircle weight="fill" size={24} />,
  info: <Info weight="fill" size={24} />,
  warning: <Warning weight="fill" size={24} />,
  error: <WarningOctagon weight="fill" size={24} />,
};

const toastOptions = {
  unstyled: true,
  classNames: {
    toast: "toast",
    success: "toastSuccess",
    info: "toastSecondary",
    warning: "toastWarn",
    error: "toastDanger",
  },
};

const toastConfig = {
  position: "bottom-center" as ToasterProps["position"],
  duration: 5000,
};

const ToastElement = function () {
  return (
    <Toaster
      closeButton
      icons={toastIcons}
      toastOptions={toastOptions}
      position={toastConfig.position}
      duration={toastConfig.duration}
    />
  );
};

export { ToastElement };
