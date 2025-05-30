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
          label="Input with Required"
          value={value}
          placeholder="John Doe"
          onChange={(e) => setValue(e.target.value)}
        />
        <FormInput
          id="input-helper"
          label="Input with Helper"
          value={value}
          placeholder="John Doe"
          helper={value.length ? "" : "Invalid"}
          onChange={(e) => setValue(e.target.value)}
        />
        <FormInput
          readOnly
          id="input-readonly"
          label="Input Read Only"
          value={value}
          placeholder="John Doe"
          onChange={(e) => setValue(e.target.value)}
        />
        <FormInput
          disabled
          id="input-disabled"
          label="Input Disabled"
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
        label="Input Number"
        type="number"
        value={value}
        placeholder="Type a number"
        onChange={(e) => setValue(e.target.value)}
      />
      <FormInput
        id="input-limit"
        label="Input Number with Limit"
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
        label="Input Number Float"
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
        label="Input Date"
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
        label="Input Date, Hour and Minutes"
        type="datetime-local"
        value={value}
        placeholder="DD/MM/AAAA HH:MM:SS"
        onChange={(e) => setValue(e.target.value)}
      />
      <FormInput
        id="input-datetime"
        label="Input Date and Time"
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
          label="Input Mask only Numbers"
          mask="9999"
          value={value}
          placeholder="1234"
          onChange={(e) => setValue(e.target.value)}
        />
        <FormMask
          id="input-mask"
          label="Input Mask only Text"
          mask="AAA"
          value={value}
          placeholder="ABC"
          onChange={(e) => setValue(e.target.value)}
        />
        <FormMask
          id="input-mask"
          label="Input Mask Numbers and Text"
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
          label="Input Check"
          onChange={(newTerms) => {
            setTerms(newTerms);
            console.log(newTerms);
          }}
          options={[{ id: "agree", value: "agree", label: "Agree" }]}
        />
        <FormCheck
          value={fruits}
          label="Input Check Multiple"
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
          label="Input Check Horizontal"
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
    const [gender, setGender] = useState("none");
    const [yesOrNot, setYesOrNot] = useState("yes");
    const [yesNotOrMaybe, setYesNotOrMaybe] = useState("maybe");
    return (
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          width: "30rem",
        }}
      >
        <FormRadio
          name="input-radio-option"
          value="option"
          onChange={() => {}}
          options={[{ id: "option", value: "option", label: "Option 1" }]}
        />
        <FormRadio
          name="input-radio-label"
          label="Input Radio Label"
          value={yesOrNot}
          onChange={setYesOrNot}
          options={[
            { id: "yes", value: "yes", label: "Yes" },
            { id: "no", value: "no", label: "No" },
          ]}
        />
        <FormRadio
          name="input-radio-multiple"
          label="Input Radio Multiple"
          value={yesNotOrMaybe}
          onChange={setYesNotOrMaybe}
          options={[
            { id: "yes", value: "yes", label: "Yes" },
            { id: "no", value: "no", label: "No" },
            { id: "maybe", value: "maybe", label: "Maybe" },
          ]}
        />
        <FormRadio
          horizontal
          name="input-radio-horizontal"
          label="Input Radio Horizontal"
          value={gender}
          onChange={setGender}
          options={[
            { id: "male", value: "male", label: "Male" },
            { id: "female", value: "female", label: "Female" },
            { id: "none", value: "none", label: "None" },
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
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          width: "30rem",
        }}
      >
        <FormSelect
          label="Select"
          value={value}
          empty="No options selected"
          onChange={(e) => setValue(e.target.value)}
          options={[
            { id: "br", value: "br", text: "Brazil" },
            { id: "us", value: "us", text: "United States" },
          ]}
        />
        <FormSelect
          required
          empty="No options selected"
          label="Select with Required"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          options={[
            { id: "br", value: "br", text: "Brazil" },
            { id: "us", value: "us", text: "United States" },
          ]}
        />
        <FormSelect
          empty="No options selected"
          label="Select with Helper"
          helper={value ? "" : "Invalid"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          options={[
            { id: "br", value: "br", text: "Brazil" },
            { id: "us", value: "us", text: "United States" },
          ]}
        />

        <FormSelect
          empty="No options selected"
          label="Select with Group Option"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          options={[
            { id: "br", value: "br", text: "Brazil", group: "America" },
            { id: "cl", value: "cl", text: "Chile", group: "America" },
            { id: "ar", value: "ar", text: "Argentina", group: "America" },
            { id: "fr", value: "fr", text: "France", group: "Europe" },
            {
              id: "it",
              value: "it",
              text: "Italy",
              group: "Europe",
              disabled: true,
            },
          ]}
        />

        <FormSelect
          disabled
          empty="No options selected"
          label="Select Disabled"
          value={""}
          onChange={() => {}}
          options={[]}
        />
      </div>
    );
  },
};

export const Money: StoryObj = {
  render: () => {
    const [value, setValue] = useState("0.00");
    const [currency, setCurrency] = useState("USD");
    return (
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          width: "30rem",
        }}
      >
        <FormMoney
          label="Money"
          value={value}
          placeholder="0.00"
          onChange={(val) => setValue(val)}
        />
        <FormMoney
          required
          label="Money with Required"
          value={value}
          placeholder="0.00"
          onChange={(val) => setValue(val)}
        />
        <FormMoney
          helper={parseFloat(value) ? "" : "No value"}
          label="Money with Helper"
          value={value}
          placeholder="0.00"
          onChange={(val) => setValue(val)}
        />
        <FormMoney
          label="Money with Currency"
          value={value}
          currency={currency}
          setCurrency={setCurrency}
          placeholder="0.00"
          onChange={(val) => setValue(val)}
        />
        <FormMoney
          readOnly
          currency={currency}
          setCurrency={setCurrency}
          label="Money Read Only"
          value={value}
          placeholder="0.00"
          onChange={(val) => setValue(val)}
        />
        <FormMoney
          disabled
          label="Money Disabled"
          value={value}
          placeholder="0.00"
          onChange={(val) => setValue(val)}
        />
        <FormMoney
          disabled
          currency={currency}
          setCurrency={setCurrency}
          label="Money Disabled With Currency"
          value={value}
          placeholder="0.00"
          onChange={(val) => setValue(val)}
        />
      </div>
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
