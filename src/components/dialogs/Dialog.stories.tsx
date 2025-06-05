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

export const Primary: StoryObj = {
  render: () =>
    Template({
      buttonText: "Dialog Primary",
      buttonCategory: "Primary",
      title: "Título",
      category: "Primary",
      description: "Descrição do diálogo primário",
      confirmText: "Confirmar",
      onConfirm: () => null,
    }),
};

export const Secondary: StoryObj = {
  render: () =>
    Template({
      buttonText: "Dialog Secondary",
      buttonCategory: "Secondary",
      title: "Informação Importante",
      category: "Secondary",
      description:
        "Este é um diálogo de categoria secundária para confirmações gerais.",
      confirmText: "Entendi",
      onConfirm: () => null,
    }),
};

export const Warn: StoryObj = {
  render: () =>
    Template({
      buttonText: "Dialog Warning",
      buttonCategory: "Warn",
      title: "Atenção!",
      category: "Warn",
      description: "Você tem certeza que deseja continuar?",
      confirmText: "Sim, continuar",
      onConfirm: () => null,
    }),
};

export const Danger: StoryObj = {
  render: () =>
    Template({
      buttonText: "Dialog Danger",
      buttonCategory: "Danger",
      Icon: Trash,
      title: "Excluir item?",
      category: "Danger",
      description: "Essa ação não poderá ser desfeita.",
      confirmText: "Deletar",
      confirmIcon: Trash,
      onConfirm: () => null,
    }),
};
