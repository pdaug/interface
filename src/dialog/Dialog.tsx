import { Icon as PhosphorIcon } from "@phosphor-icons/react";
import React, { createContext, useContext, useState } from "react";

// styles
import "./Dialog.css";

// components
import Button from "../buttons/Button";

// types
import type { ButtonCategories } from "../buttons/Button";

export type DialogContextProps = {
  open: boolean;
  title: string;
  description: string;
  category: ButtonCategories;
  onConfirm: () => void;
  Icon?: PhosphorIcon;
  onCancel?: () => void;
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
    category: "primary",
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
  const { dialogProps, CloseDialog } = useDialog();
  return (
    dialogProps?.open && (
      <div className="baseui-dialog">
        <div className="baseui-dialog-container">
          <div className="baseui-dialog-content">
            <div className="baseui-dialog-title">{dialogProps.title}</div>
            <div>{dialogProps.description}</div>
          </div>
          <div className="baseui-dialog-footer">
            <Button
              type="button"
              category="neutral"
              text="Cancelar"
              onClick={dialogProps?.onCancel || CloseDialog}
            />
            <Button
              type="submit"
              text="Confirmar"
              category={dialogProps.category}
              onClick={dialogProps.onConfirm}
            />
          </div>
        </div>
      </div>
    )
  );
};
