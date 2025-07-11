import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";
import { Icon as PhosphorIcon } from "@phosphor-icons/react";

// styles
import "./Dialog.css";

// hooks
import useTranslate from "../../hooks/useTranslate";

// components
import Button, { ButtonCategories } from "../buttons/Button";

export type DialogContextProps = {
  open: boolean;
  title: string;
  description: string | React.JSX.Element | (() => React.JSX.Element);
  category: ButtonCategories;
  confirmIcon?: PhosphorIcon;
  confirmText?: string;
  onConfirm?: () => void;
  Icon?: PhosphorIcon;
  cancelText?: string;
  onCancel?: () => void;
  width?: number | string;
};

export type DialogContextType = {
  dialogProps: DialogContextProps;
  OpenDialog: (props: Omit<DialogContextProps, "open">) => void;
  CloseDialog: () => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

type DialogProviderProps = {
  children: React.ReactNode;
};

export const DialogProvider = function ({ children }: DialogProviderProps) {
  const initialDialogProps: DialogContextProps = {
    open: false,
    title: "",
    description: "",
    confirmText: "Confirmar",
    category: "Success",
    onConfirm: function () {
      return;
    },
    onCancel: function () {
      CloseDialog();
      return;
    },
  };

  const [dialogProps, setDialogProps] =
    useState<DialogContextProps>(initialDialogProps);

  const OpenDialog = function (
    newDialogProps: Omit<DialogContextProps, "open">,
  ) {
    setDialogProps({
      ...newDialogProps,
      open: true,
    });
    return;
  };

  const CloseDialog = function () {
    setDialogProps(initialDialogProps);
    return;
  };

  return (
    <DialogContext.Provider value={{ dialogProps, OpenDialog, CloseDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = function () {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

export const DialogElement = function () {
  const t = useTranslate();
  const { dialogProps, CloseDialog } = useDialog();
  const dialogContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(function () {
    const HandleClickButton = function (event: MouseEvent) {
      if (
        event.target &&
        dialogContainerRef.current &&
        !dialogContainerRef.current.contains(event.target as Node)
      ) {
        CloseDialog();
        return;
      }
      return;
    };
    document.addEventListener("mousedown", HandleClickButton);
    return function () {
      document.removeEventListener("mousedown", HandleClickButton);
      return;
    };
  }, []);

  return (
    <div className={`dialog ${dialogProps?.open ? "dialogOpen" : ""}`}>
      <div
        ref={dialogContainerRef}
        style={{ width: dialogProps?.width || "35rem" }}
        className={`dialogContainer ${dialogProps?.open ? "dialogContainerOpen" : ""}`}
      >
        <div className="dialogContent">
          <div className="dialogTitle">
            {dialogProps.Icon && <dialogProps.Icon />}
            <span>{dialogProps.title}</span>
          </div>
          <div className="dialogDescription">
            {typeof dialogProps.description === "function" ? (
              <dialogProps.description />
            ) : (
              dialogProps.description
            )}
          </div>
        </div>
        <div className="dialogFooter">
          <Button
            type="button"
            category="Neutral"
            text={dialogProps.cancelText || t.components.cancel}
            onClick={dialogProps?.onCancel || CloseDialog}
          />
          {dialogProps.confirmText && (
            <Button
              type="submit"
              Icon={dialogProps.confirmIcon}
              text={dialogProps.confirmText}
              category={dialogProps.category}
              onClick={dialogProps.onConfirm}
            />
          )}
        </div>
      </div>
    </div>
  );
};
