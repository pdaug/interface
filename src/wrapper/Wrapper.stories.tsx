import { Meta, StoryObj } from "@storybook/react";

import Wrapper from "./Wrapper";
import { ButtonProps } from "../buttons/Button";

const meta: Meta<typeof Wrapper> = {
  title: "Components/Wrapper",
  component: Wrapper,
};

export default meta;

type Story = StoryObj<typeof Wrapper>;

export const Simple: Story = {
  args: {
    children: <div>Conteúdo da seção vai aqui.</div>,
  },
};

export const WithFooter: Story = {
  args: {
    children: <div>Conteúdo da seção vai aqui.</div>,
    actions: [
      {
        category: "secondary",
        text: "Editar",
        onClick: () => alert("Editar clicado"),
      },
    ],
  },
};

export const Default: Story = {
  args: {
    title: "Título da Seção",
    description: "Descrição breve da seção.",
    children: <div>Conteúdo da seção vai aqui.</div>,
  },
};

export const WithCancelConfirm: Story = {
  args: {
    title: "Confirmação",
    description: "Você tem certeza que deseja prosseguir?",
    children: <div>A ação é irreversível.</div>,
    onCancel: () => alert("Cancelado"),
    onConfirm: () => alert("Confirmado"),
  },
};

export const WithCustomActions: Story = {
  args: {
    title: "Ações Customizadas",
    description: "Abaixo estão ações adicionais.",
    children: <div>Você pode adicionar qualquer ação aqui.</div>,
    actions: [
      {
        category: "secondary",
        text: "Editar",
        onClick: () => alert("Editar clicado"),
      },
      {
        category: "danger",
        text: "Excluir",
        onClick: () => alert("Excluir clicado"),
      },
    ] as ButtonProps[],
  },
};

export const FullExample: Story = {
  args: {
    title: "Seção Completa",
    description: "Com ações, cancelamento e confirmação.",
    children: (
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    ),
    onCancel: () => alert("Ação cancelada"),
    onConfirm: () => alert("Ação confirmada"),
    actions: [
      {
        category: "neutral",
        text: "Ajuda",
        onClick: () => alert("Ajuda clicada"),
      },
    ] as ButtonProps[],
  },
};
