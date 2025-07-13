import { Toaster, ToasterProps } from "sonner";

// icons
import {
  Info,
  Warning,
  SpinnerGap,
  CheckCircle,
  WarningOctagon,
} from "@phosphor-icons/react";

// styles
import "./Toast.css";

const toastIcons = {
  loading: (
    <SpinnerGap size={24}>
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        dur="1s"
        from="0 0 0"
        to="360 0 0"
        repeatCount="indefinite"
      ></animateTransform>
    </SpinnerGap>
  ),
  success: <CheckCircle weight="fill" size={24} />,
  info: <Info weight="fill" size={24} />,
  warning: <Warning weight="fill" size={24} />,
  error: <WarningOctagon weight="fill" size={24} />,
};

const toastOptions = {
  unstyled: true,
  classNames: {
    toast: "toast",
    loading: "toast",
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
