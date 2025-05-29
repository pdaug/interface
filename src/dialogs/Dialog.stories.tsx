import type { Meta, StoryObj } from "@storybook/react";
import { Trash } from "@phosphor-icons/react";

// components
import Button, { ButtonCategories } from "../buttons/Button";
import {
  DialogProvider,
  useDialog,
  DialogElement,
  DialogContextProps,
} from "./Dialog";

const meta: Meta = {
  title: "Components/Dialog",
  decorators: [
    (Story) => (
      <DialogProvider>
        <Story />
        <DialogElement />
      </DialogProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj;

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

export const Primary: Story = {
  render: () =>
    Template({
      buttonText: "Dialog Primary",
      buttonCategory: "primary",
      title: "Título",
      category: "primary",
      description: "Descrição do diálogo primário",
      confirmText: "Confirmar",
      onConfirm: () => null,
    }),
};

export const Secondary: Story = {
  render: () =>
    Template({
      buttonText: "Dialog Secondary",
      buttonCategory: "secondary",
      title: "Informação Importante",
      category: "secondary",
      description:
        "Este é um diálogo de categoria secundária para confirmações gerais.",
      confirmText: "Entendi",
      onConfirm: () => null,
    }),
};

export const Warn: Story = {
  render: () =>
    Template({
      buttonText: "Dialog Warning",
      buttonCategory: "warn",
      title: "Atenção!",
      category: "warn",
      description: "Você tem certeza que deseja continuar?",
      confirmText: "Sim, continuar",
      onConfirm: () => null,
    }),
};

export const Danger: Story = {
  render: () =>
    Template({
      buttonText: "Dialog Danger",
      buttonCategory: "danger",
      Icon: Trash,
      title: "Excluir item?",
      category: "danger",
      description: "Essa ação não poderá ser desfeita.",
      confirmText: "Deletar",
      confirmIcon: Trash,
      onConfirm: () => null,
    }),
};
