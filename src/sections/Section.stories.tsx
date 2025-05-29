import { Meta, StoryObj } from "@storybook/react";

import Section from "./Section";
import { ButtonProps } from "../buttons/Button";

const meta: Meta<typeof Section> = {
  title: "Components/Section",
  component: Section,
};

export default meta;

type Story = StoryObj<typeof Section>;

export const Default: Story = {
  args: {
    title: "Título da Seção",
    description: "Descrição breve da seção.",
    children: <p>Conteúdo da seção vai aqui.</p>,
  },
};

export const WithCancelConfirm: Story = {
  args: {
    title: "Confirmação",
    description: "Você tem certeza que deseja prosseguir?",
    children: <p>A ação é irreversível.</p>,
    onCancel: () => alert("Cancelado"),
    onConfirm: () => alert("Confirmado"),
  },
};

export const WithCustomActions: Story = {
  args: {
    title: "Ações Customizadas",
    description: "Abaixo estão ações adicionais.",
    children: <p>Você pode adicionar qualquer ação aqui.</p>,
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
