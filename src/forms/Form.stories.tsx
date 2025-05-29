// Form.stories.tsx
import { useState } from "react";
import type { StoryObj } from "@storybook/react";

import {
  FormCheck,
  FormFile,
  FormInput,
  FormMask,
  FormMoney,
  FormRadio,
  FormSelect,
  FormText,
} from "./Form";

export default {
  title: "Components/Form",
  tags: ["autodocs"],
};

export const Input: StoryObj = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <FormInput
        id="input-example"
        label="Full name"
        value={value}
        placeholder="John Doe"
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
      label="Age"
      type="number"
      value={value}
      placeholder="Type your age"
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
      label="Password Top-Secret"
      type="password"
      value={value}
      placeholder="**********"
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Date = () => {
  const [value, setValue] = useState("");
  return (
    <FormInput
      id="input-date"
      label="Birthdate"
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
      label="Datetime"
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
      label="Input disabled"
      value="Don't edit input"
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
        label="Document"
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
