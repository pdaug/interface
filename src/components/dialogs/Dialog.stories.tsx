import { Trash } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";

// components
import {
  useDialog,
  DialogElement,
  DialogProvider,
  DialogContextProps,
} from "./Dialog";
import { Center } from "../aligns/Align";
import Button, { ButtonCategories } from "../buttons/Button";

export default {
  title: "Components/Dialog",
  tags: ["autodocs"],
  decorators: (Story) => (
    <DialogProvider>
      <Center>
        <Story />
        <DialogElement />
      </Center>
    </DialogProvider>
  ),
} as Meta;

const Template = (
  dialogProps: {
    buttonText: string;
    buttonCategory: ButtonCategories;
  } & Omit<DialogContextProps, "open">,
) => {
  const { OpenDialog, CloseDialog } = useDialog();
  return (
    <Button
      text={dialogProps.buttonText}
      category={dialogProps.buttonCategory}
      onClick={() =>
        OpenDialog({
          ...dialogProps,
          onConfirm: () => {
            dialogProps.onConfirm?.();
            CloseDialog();
          },
        })
      }
    />
  );
};

export const Success: StoryObj = {
  render: () =>
    Template({
      buttonText: "Dialog Success",
      buttonCategory: "Success",
      title: "Title",
      category: "Success",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras venenatis metus est, finibus dignissim ex bibendum quis. ",
      confirmText: "Confirm",
      onConfirm: () => null,
    }),
};

export const Info: StoryObj = {
  render: () =>
    Template({
      buttonText: "Dialog Info",
      buttonCategory: "Info",
      title: "Title",
      category: "Info",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras venenatis metus est, finibus dignissim ex bibendum quis. ",
      confirmText: "Ok",
      onConfirm: () => null,
      cancelText: "Close",
    }),
};

export const Warn: StoryObj = {
  render: () =>
    Template({
      buttonText: "Dialog Warning",
      buttonCategory: "Warning",
      title: "Title",
      category: "Warning",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras venenatis metus est, finibus dignissim ex bibendum quis. ",
      confirmText: "I agree",
      onConfirm: () => null,
      cancelText: "Don't agree",
    }),
};

export const Danger: StoryObj = {
  render: () =>
    Template({
      buttonText: "Dialog Danger",
      buttonCategory: "Danger",
      Icon: Trash,
      title: "Title",
      category: "Danger",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras venenatis metus est, finibus dignissim ex bibendum quis. ",
      confirmText: "Delete",
      cancelText: "No",
      confirmIcon: Trash,
      onConfirm: () => null,
    }),
};
