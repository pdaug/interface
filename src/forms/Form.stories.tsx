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
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          width: "30rem",
        }}
      >
        <FormInput
          id="input-text"
          label="Input Text"
          value={value}
          placeholder="John Doe"
          onChange={(e) => setValue(e.target.value)}
        />
        <FormInput
          required
          id="input-required"
          label="Input with required"
          value={value}
          placeholder="John Doe"
          onChange={(e) => setValue(e.target.value)}
        />
        <FormInput
          id="input-validator"
          label="Input with validator"
          value={value}
          placeholder="John Doe"
          helper={value.length ? "" : "Invalid"}
          onChange={(e) => setValue(e.target.value)}
        />
        <FormInput
          readOnly
          id="input-readonly"
          label="Input with readonly"
          value={value}
          placeholder="John Doe"
          onChange={(e) => setValue(e.target.value)}
        />
        <FormInput
          disabled
          id="input-disabled"
          label="Input disabled"
          value={value}
          placeholder="John Doe"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const Number = () => {
  const [value, setValue] = useState("");
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexDirection: "column",
        width: "30rem",
      }}
    >
      <FormInput
        id="input-number"
        label="Input number"
        type="number"
        value={value}
        placeholder="Type a number"
        onChange={(e) => setValue(e.target.value)}
      />
      <FormInput
        id="input-limit"
        label="Input with limit"
        type="number"
        value={value}
        placeholder="Type a number"
        onChange={(e) => setValue(e.target.value)}
        min={1}
        max={100}
        step={1}
      />
      <FormInput
        id="input-step"
        label="Input number float"
        type="number"
        value={value}
        placeholder="Type a number"
        onChange={(e) => setValue(e.target.value)}
        min={1}
        max={100}
        step={0.1}
      />
    </div>
  );
};

export const Password = () => {
  const [value, setValue] = useState("");
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexDirection: "column",
        width: "30rem",
      }}
    >
      <FormInput
        id="input-password"
        label="Password"
        type="password"
        value={value}
        placeholder="**********"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export const Date = () => {
  const [value, setValue] = useState<string>("2025-01-01");
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexDirection: "column",
        width: "30rem",
      }}
    >
      <FormInput
        id="input-date"
        label="Input date"
        type="date"
        value={value}
        placeholder="DD/MM/AAAA"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export const DateTime = () => {
  const [value, setValue] = useState("2025-01-01T00:00:00");
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexDirection: "column",
        width: "30rem",
      }}
    >
      <FormInput
        id="input-datetime"
        label="Input date, hour and minutes"
        type="datetime-local"
        value={value}
        placeholder="DD/MM/AAAA HH:MM:SS"
        onChange={(e) => setValue(e.target.value)}
      />
      <FormInput
        id="input-datetime"
        label="Input date and time"
        type="datetime-local"
        value={value}
        step={1}
        placeholder="DD/MM/AAAA HH:MM:SS"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export const Mask: StoryObj = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          width: "30rem",
        }}
      >
        <FormMask
          id="input-mask"
          label="Input mask only number"
          mask="9999"
          value={value}
          placeholder="1234"
          onChange={(e) => setValue(e.target.value)}
        />
        <FormMask
          id="input-mask"
          label="Input mask only text"
          mask="AAA"
          value={value}
          placeholder="ABC"
          onChange={(e) => setValue(e.target.value)}
        />
        <FormMask
          id="input-mask"
          label="Input mask"
          mask="AAA-9999"
          value={value}
          placeholder="ABC-1234"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const Check: StoryObj = {
  render: () => {
    const [checked, setChecked] = useState<boolean>(false);
    const [terms, setTerms] = useState<boolean>(false);
    const [games, setGames] = useState<string[]>([""]);
    const [fruits, setFruits] = useState<string[]>(["apple"]);

    return (
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          width: "30rem",
        }}
      >
        <FormCheck
          value={checked}
          onChange={(newChecked) => {
            setChecked(newChecked);
            console.log(newChecked);
          }}
          options={[{ id: "check", value: "check", label: "Without label" }]}
        />
        <FormCheck
          value={terms}
          label="Input check"
          onChange={(newTerms) => {
            setTerms(newTerms);
            console.log(newTerms);
          }}
          options={[{ id: "agree", value: "agree", label: "Agree" }]}
        />
        <FormCheck
          value={fruits}
          label="Input check multiples"
          onChange={(newFruits) => {
            setFruits(newFruits);
            console.log(newFruits);
          }}
          options={[
            { id: "apple", value: "apple", label: "Apple" },
            { id: "banana", value: "banana", label: "Banana" },
            { id: "orange", value: "orange", label: "Orange" },
            { id: "kiwi", value: "kiwi", label: "Kiwi" },
          ]}
        />
        <FormCheck
          value={games}
          horizontal
          label="Input check horizontal"
          onChange={(newGames) => {
            setGames(newGames);
            console.log(newGames);
          }}
          options={[
            { id: "galaga", value: "galaga", label: "Galaga" },
            { id: "tetris", value: "tetris", label: "Tetris" },
            { id: "pitfall", value: "pitfall", label: "Pitfall" },
          ]}
        />
      </div>
    );
  },
};

export const Radio: StoryObj = {
  render: () => {
    const [yesOrNot, setYesOrNot] = useState("yes");
    return (
      <div style={{ display: "flex", gap: "1rem", width: "30rem" }}>
        <FormRadio
          name="input-radio"
          value={yesOrNot}
          onChange={setYesOrNot}
          options={[
            { id: "yes", value: "yes", label: "Yes" },
            { id: "no", value: "no", label: "No" },
          ]}
        />
      </div>
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
