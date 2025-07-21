import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Input,
  InputCheck,
  InputColor,
  InputFile,
  InputInterval,
  InputMask,
  InputMoney,
  InputRadio,
  InputSelect,
  InputText,
} from "./Input";
import { Center, Vertical } from "../aligns/Align";

export default {
  title: "Components/Input",
  tags: ["autodocs"],
  decorators: (Story) => (
    <Center>
      <Story />
    </Center>
  ),
} as Meta;

export const Text: StoryObj = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Vertical internal={1} styles={{ width: "30rem" }}>
        <Input
          label="Input Text"
          value={value}
          placeholder="John Doe"
          onChange={(e) => setValue(e.target.value)}
        />
        <Input
          required
          label="Input with Required"
          value={value}
          placeholder="John Doe"
          onChange={(e) => setValue(e.target.value)}
        />
        <Input
          label="Input with Helper"
          value={value}
          placeholder="John Doe"
          helper={value.length ? "" : "Invalid"}
          onChange={(e) => setValue(e.target.value)}
        />
        <Input
          readOnly
          label="Input Read Only"
          value={value}
          placeholder="John Doe"
          onChange={(e) => setValue(e.target.value)}
        />
        <Input
          disabled
          label="Input Disabled"
          value={value}
          placeholder="John Doe"
          onChange={(e) => setValue(e.target.value)}
        />
        <InputText
          label="Input Text Area"
          value={value}
          placeholder="Type here your name"
          height={4}
          resize="vertical"
          onChange={(e) => setValue(e.target.value)}
        />
      </Vertical>
    );
  },
};

export const Number = () => {
  const [value, setValue] = useState("");
  return (
    <Vertical internal={1} styles={{ width: "30rem" }}>
      <Input
        label="Input Number"
        type="number"
        value={value}
        placeholder="Type a number"
        onChange={(e) => setValue(e.target.value)}
      />
      <Input
        label="Input Number with Limit"
        type="number"
        value={value}
        placeholder="Type a number"
        onChange={(e) => setValue(e.target.value)}
        min={1}
        max={100}
        step={1}
      />
      <Input
        label="Input Number Float"
        type="number"
        value={value}
        placeholder="Type a number"
        onChange={(e) => setValue(e.target.value)}
        min={1}
        max={100}
        step={0.1}
      />
    </Vertical>
  );
};

export const Password = () => {
  const [value, setValue] = useState("");
  return (
    <Vertical internal={1} styles={{ width: "30rem" }}>
      <Input
        label="Password"
        type="password"
        value={value}
        placeholder="**********"
        onChange={(e) => setValue(e.target.value)}
      />
    </Vertical>
  );
};

export const Interval = () => {
  const [value, setValue] = useState<[Date | null, Date | null]>([
    new globalThis.Date("2025-01-01"),
    new globalThis.Date("2025-01-28"),
  ]);
  return (
    <Vertical internal={1} styles={{ width: "30rem" }}>
      <InputInterval
        value={value}
        label="Input Interval"
        onChange={(newValue) => setValue(newValue)}
      />
      <InputInterval
        required
        value={value}
        label="Input Interval Required"
        onChange={(newValue) => setValue(newValue)}
      />
      <InputInterval
        readOnly
        value={value}
        label="Input Interval Read Only"
        onChange={(newValue) => setValue(newValue)}
      />
      <InputInterval
        disabled
        value={value}
        label="Input Interval Disabled"
        onChange={(newValue) => setValue(newValue)}
      />
    </Vertical>
  );
};

export const Date = () => {
  const [value, setValue] = useState<string>("2025-01-01");
  return (
    <Vertical internal={1} styles={{ width: "30rem" }}>
      <Input
        label="Input Date"
        type="date"
        value={value}
        placeholder="DD/MM/AAAA"
        onChange={(e) => setValue(e.target.value)}
      />
    </Vertical>
  );
};

export const DateTime = () => {
  const [value, setValue] = useState("2025-01-01T00:00:00");
  return (
    <Vertical internal={1} styles={{ width: "30rem" }}>
      <Input
        label="Input Date, Hour and Minutes"
        type="datetime-local"
        value={value}
        placeholder="DD/MM/AAAA HH:MM:SS"
        onChange={(e) => setValue(e.target.value)}
      />
      <Input
        label="Input Date and Time"
        type="datetime-local"
        value={value}
        step={1}
        placeholder="DD/MM/AAAA HH:MM:SS"
        onChange={(e) => setValue(e.target.value)}
      />
    </Vertical>
  );
};

export const Mask: StoryObj = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Vertical internal={1} styles={{ width: "30rem" }}>
        <InputMask
          label="Input Mask only Numbers"
          mask="9999"
          value={value}
          placeholder="1234"
          onChange={(e) => setValue(e.target.value)}
        />
        <InputMask
          label="Input Mask only Text"
          mask="AAA"
          value={value}
          placeholder="ABC"
          onChange={(e) => setValue(e.target.value)}
        />
        <InputMask
          label="Input Mask Numbers and Text"
          mask="AAA-9999"
          value={value}
          placeholder="ABC-1234"
          onChange={(e) => setValue(e.target.value)}
        />
      </Vertical>
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
      <Vertical internal={1} styles={{ width: "30rem" }}>
        <InputCheck
          value={checked}
          onChange={(newChecked) => {
            setChecked(newChecked);
            console.log(newChecked);
          }}
          options={[{ id: "check", value: "check", label: "Without label" }]}
        />
        <InputCheck
          value={terms}
          label="Input Check"
          onChange={(newTerms) => {
            setTerms(newTerms);
            console.log(newTerms);
          }}
          options={[{ id: "agree", value: "agree", label: "Agree" }]}
        />
        <InputCheck
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
        <InputCheck
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
      </Vertical>
    );
  },
};

export const Color = () => {
  const [value, setValue] = useState("#ff0000");
  return (
    <Vertical internal={1} styles={{ width: "30rem" }}>
      <InputColor
        value={value}
        label="Input Color"
        onChange={(e) => setValue(e.target.value)}
      />
    </Vertical>
  );
};

export const Radio: StoryObj = {
  render: () => {
    const [gender, setGender] = useState("none");
    const [yesOrNot, setYesOrNot] = useState("yes");
    const [yesNotOrMaybe, setYesNotOrMaybe] = useState("maybe");
    return (
      <Vertical internal={1} styles={{ width: "30rem" }}>
        <InputRadio
          name="input-radio-option"
          value="option"
          onChange={() => {}}
          options={[{ id: "option", value: "option", label: "Option 1" }]}
        />
        <InputRadio
          name="input-radio-label"
          label="Input Radio Label"
          value={yesOrNot}
          onChange={setYesOrNot}
          options={[
            { id: "yes", value: "yes", label: "Yes" },
            { id: "no", value: "no", label: "No" },
          ]}
        />
        <InputRadio
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
        <InputRadio
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
      </Vertical>
    );
  },
};

export const Select: StoryObj = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Vertical internal={1} styles={{ width: "30rem" }}>
        <InputSelect
          label="Select"
          value={value}
          empty="No options selected"
          onChange={(e) => setValue(e.target.value)}
          options={[
            { id: "br", value: "br", text: "Brazil" },
            { id: "us", value: "us", text: "United States" },
          ]}
        />
        <InputSelect
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
        <InputSelect
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

        <InputSelect
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

        <InputSelect
          disabled
          empty="No options selected"
          label="Select Disabled"
          value={""}
          onChange={() => {}}
          options={[]}
        />
      </Vertical>
    );
  },
};

export const Money: StoryObj = {
  render: () => {
    const [value, setValue] = useState("0.00");
    const [currency, setCurrency] = useState("USD");
    return (
      <Vertical internal={1} styles={{ width: "30rem" }}>
        <InputMoney
          label="Money"
          value={value}
          placeholder="0.00"
          onChange={(val) => setValue(val)}
        />
        <InputMoney
          required
          label="Money with Required"
          value={value}
          placeholder="0.00"
          onChange={(val) => setValue(val)}
        />
        <InputMoney
          helper={parseFloat(value) ? "" : "No value"}
          label="Money with Helper"
          value={value}
          placeholder="0.00"
          onChange={(val) => setValue(val)}
        />
        <InputMoney
          label="Money with Currency"
          value={value}
          currency={currency}
          setCurrency={setCurrency}
          placeholder="0.00"
          onChange={(val) => setValue(val)}
        />
        <InputMoney
          readOnly
          currency={currency}
          setCurrency={setCurrency}
          label="Money Read Only"
          value={value}
          placeholder="0.00"
          onChange={(val) => setValue(val)}
        />
        <InputMoney
          disabled
          label="Money Disabled"
          value={value}
          placeholder="0.00"
          onChange={(val) => setValue(val)}
        />
        <InputMoney
          disabled
          currency={currency}
          setCurrency={setCurrency}
          label="Money Disabled With Currency"
          value={value}
          placeholder="0.00"
          onChange={(val) => setValue(val)}
        />
      </Vertical>
    );
  },
};

export const File: StoryObj = {
  render: () => {
    const [value, setValue] = useState<FileList | null>(null);
    return (
      <Vertical internal={1} styles={{ width: "30rem" }}>
        <InputFile
          id="input-file"
          label="Input File"
          value={value}
          onChange={(e) => setValue(e.target.files)}
        />
        <InputFile
          id="input-file-required"
          required
          accept="image/*"
          label="Input File Required"
          value={value}
          onChange={(e) => setValue(e.target.files)}
        />
        <InputFile
          id="input-file-disabled"
          disabled
          multiple
          accept="video/*"
          label="Input File Disabled"
          value={value}
          onChange={(e) => setValue(e.target.files)}
        />
      </Vertical>
    );
  },
};
