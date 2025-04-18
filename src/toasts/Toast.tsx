import { Toaster, ToasterProps } from "sonner";

// icons
import {
  Info,
  Spinner,
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
  loading: <Spinner weight="fill" size={24} />,
};

const toastOptions = {
  unstyled: true,
  classNames: {
    toast: "fadeui-toast",
    error: "fadeui-toast-error",
    success: "fadeui-toast-success",
    warning: "fadeui-toast-warn",
    info: "fadeui-toast-info",
    message: "fadeui-toast-message",
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
