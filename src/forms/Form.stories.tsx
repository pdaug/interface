// Form.stories.tsx
import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import {
  FormCheck,
  FormCheckSimple,
  FormFile,
  FormInput,
  FormMask,
  FormMoney,
  FormRadio,
  FormSelect,
  FormText,
} from "./Form";

const meta: Meta = {
  title: "Components/Form",
};

export default meta;

export const Input: StoryObj = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <FormInput
        id="input-example"
        label="Nome"
        value={value}
        placeholder="Digite seu nome"
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const Number = () => {
  const [value, setValue] = useState("");
  return (
    <FormInput
      id="input-number"
      label="Número"
      type="number"
      value={value}
      placeholder="Digite um número"
      onChange={(e) => setValue(e.target.value)}
      min={0}
      max={100}
      step={1}
    />
  );
};

export const Password = () => {
  const [value, setValue] = useState("");
  return (
    <FormInput
      id="input-password"
      label="Senha"
      type="password"
      value={value}
      placeholder="Digite sua senha"
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Date = () => {
  const [value, setValue] = useState("");
  return (
    <FormInput
      id="input-date"
      label="Data"
      type="date"
      value={value}
      placeholder=""
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const DateTimeLocal = () => {
  const [value, setValue] = useState("");
  return (
    <FormInput
      id="input-datetime-local"
      label="Data e Hora"
      type="datetime-local"
      value={value}
      placeholder=""
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Disabled = () => {
  return (
    <FormInput
      id="input-disabled"
      label="Desabilitado"
      value="Não pode editar"
      placeholder=""
      onChange={() => {}}
      disabled
    />
  );
};

export const Mask: StoryObj = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <FormMask
        id="cpf-mask"
        label="CPF"
        mask="999.999.999-99"
        value={value}
        placeholder="000.000.000-00"
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const Check: StoryObj = {
  render: () => {
    const [values, setValues] = useState<string[]>(["apple"]);
    return (
      <FormCheck
        name="frutas"
        options={[
          { id: "check-1", value: "apple", label: "Maçã" },
          { id: "check-2", value: "banana", label: "Banana" },
        ]}
        values={values}
        onChange={setValues}
      />
    );
  },
};

export const Radio: StoryObj = {
  render: () => {
    const [value, setValue] = useState("yes");
    return (
      <FormRadio
        name="sim-nao"
        value={value}
        onChange={setValue}
        options={[
          { id: "radio-yes", value: "yes", label: "Sim" },
          { id: "radio-no", value: "no", label: "Não" },
        ]}
      />
    );
  },
};

export const Select: StoryObj = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <FormSelect
        id="select-pais"
        label="País"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        options={[
          { id: "br", value: "br", text: "Brasil" },
          { id: "us", value: "us", text: "Estados Unidos" },
        ]}
      />
    );
  },
};

export const Money: StoryObj = {
  render: () => {
    const [value, setValue] = useState("0.00");
    return (
      <FormMoney
        id="money"
        label="Valor"
        value={value}
        placeholder="0,00"
        onChange={(val) => setValue(val)}
      />
    );
  },
};

export const File: StoryObj = {
  render: () => {
    const [value, setValue] = useState<FileList | null>(null);
    return (
      <FormFile
        id="file-upload"
        label="Upload de Arquivo"
        value={value}
        onChange={(e) => setValue(e.target.files)}
      />
    );
  },
};

export const Text: StoryObj = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <FormText
        id="descricao"
        label="Descrição"
        value={value}
        placeholder="Escreva algo"
        height={4}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const CheckSimple: StoryObj = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <FormCheckSimple
        id="check-termos"
        label="Aceito os termos"
        value="1"
        onChange={() => setChecked(!checked)}
      />
    );
  },
};
