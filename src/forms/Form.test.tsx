import React, { useState } from "react";
import { At, LinkSimple, MagnifyingGlass } from "@phosphor-icons/react";

// components
import {
  FormInput,
  FormMask,
  FormMoney,
  FormPrefix,
  FormSelect,
  FormText,
} from "./Form";

const FormTest = function () {
  const [form, setForm] = useState({
    name: "",
    word: "",
    age: 0,
    password: "",
    birthday: "",
    today: "",
    money: "0.00",
    url: "",
    username: "",
    search: "",
    country: "",
    trip: "",
    carplate: "",
    zipcode: "",
    poem: "",
  });

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>Form: Input</div>
        <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
          <FormInput
            type="text"
            label="Name"
            value={form.name}
            id="form_input_name"
            placeholder="John Doe"
            onChange={function (event) {
              setForm({
                ...form,
                name: event.currentTarget?.value || "",
              });
              return;
            }}
          />
          <FormInput
            type="text"
            label="Word"
            value={form.word}
            id="form_input_word"
            placeholder="Random english word"
            helper={form.word.length ? "" : "Empty word"}
            onChange={function (event) {
              setForm({
                ...form,
                word: event.currentTarget?.value || "",
              });
              return;
            }}
          />
        </div>
        <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
          <FormInput
            label="Age"
            type="number"
            id="form_input_age"
            placeholder="20 years old"
            value={String(form.age || "")}
            onChange={function (event) {
              setForm({
                ...form,
                age: Number(event.currentTarget?.value) || 0,
              });
              return;
            }}
          />
          <FormInput
            type="password"
            label="Password"
            placeholder="********"
            id="form_input_password"
            value={form.password}
            helper={form.password.includes("123") ? "Weak" : ""}
            onChange={function (event) {
              setForm({
                ...form,
                password: event.currentTarget?.value || "",
              });
              return;
            }}
          />
        </div>
        <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
          <FormInput
            type="date"
            placeholder=""
            label="Birthday"
            value={form.birthday}
            id="form_input_birthday"
            onChange={function (event) {
              setForm({
                ...form,
                birthday: event.currentTarget?.value || "",
              });
              return;
            }}
          />
          <FormInput
            required
            label="Today"
            placeholder=""
            value={form.today}
            type="datetime-local"
            id="form_input_today"
            onChange={function (event) {
              setForm({
                ...form,
                today: event.currentTarget?.value || "",
              });
              return;
            }}
          />
        </div>
        <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
          <FormInput
            disabled
            value=""
            type="text"
            label="Disabled"
            placeholder="Disabled"
            id="form_input_disabled"
          />
          <FormInput
            readOnly
            type="text"
            label="Read Only"
            value="Read Only"
            placeholder="Read Only"
            id="form_input_readonly"
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>Form: Mask</div>
        <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
          <FormMask
            value={form.carplate}
            id="form_mask_carplate"
            label="Car Plate"
            mask="AAA-9999"
            placeholder="AAA-9999"
            onChange={function (event) {
              setForm({
                ...form,
                carplate: event.currentTarget?.value || "",
              });
              return;
            }}
          />
          <FormMask
            required
            label="ZIP Code"
            mask="99999-999"
            value={form.zipcode}
            id="form_mask_zipcode"
            placeholder="12345-678"
            onChange={function (event) {
              setForm({
                ...form,
                zipcode: event.currentTarget?.value || "",
              });
              return;
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>Form: Money</div>
        <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
          <FormMoney
            label="Money"
            value={form.money}
            id="form_input_money"
            placeholder="R$ 0.00"
            onChange={function (value) {
              setForm({
                ...form,
                money: value || "0.00",
              });
              return;
            }}
          />
          <FormMoney
            disabled
            label="Total"
            value={form.money}
            id="form_input_total"
            placeholder="R$ 0.00"
            onChange={function (value) {
              setForm({
                ...form,
                money: value || "0.00",
              });
              return;
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>Form: Prefix</div>
        <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
          <FormPrefix
            label="URL"
            prefix="https://"
            id="form_input_url"
            placeholder="example.com"
            value={form.url || ""}
            onChange={function (event) {
              setForm({
                ...form,
                url: event.currentTarget?.value || "",
              });
              return;
            }}
          />
          <FormPrefix
            label="GitHub"
            Icon={LinkSimple}
            id="form_input_github"
            placeholder="username"
            prefix="https://github.com/"
            value={form.username || ""}
            onChange={function (event) {
              setForm({
                ...form,
                username: event.currentTarget?.value || "",
              });
              return;
            }}
          />
        </div>
        <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
          <FormPrefix
            Icon={At}
            label="Username"
            placeholder="username"
            id="form_input_username"
            value={form.username || ""}
            onChange={function (event) {
              setForm({
                ...form,
                username: event.currentTarget?.value || "",
              });
              return;
            }}
          />
          <FormPrefix
            label="Search"
            Icon={MagnifyingGlass}
            id="form_input_search"
            placeholder="Search..."
            value={form.search || ""}
            onChange={function (event) {
              setForm({
                ...form,
                search: event.currentTarget?.value || "",
              });
              return;
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>Form: Select</div>
        <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
          <FormSelect
            label="Country"
            value={form.country}
            id="form_select_country"
            options={[
              {
                id: "br",
                value: "br",
                text: "Brazil",
              },
              {
                id: "us",
                value: "us",
                text: "USA",
              },
              {
                id: "fr",
                value: "fr",
                text: "France",
              },
            ]}
            onChange={function (event) {
              setForm({
                ...form,
                country: event.currentTarget?.value || "",
              });
              return;
            }}
          />
          <FormSelect
            label="Trip"
            value={form.trip}
            id="form_select_trip"
            options={[
              {
                id: "br",
                value: "br",
                text: "Brazil",
                optionGroup: "America",
              },
              {
                id: "us",
                value: "us",
                text: "USA",
                optionGroup: "America",
              },
              {
                id: "fr",
                value: "fr",
                text: "France",
                optionGroup: "Europe",
              },
              {
                id: "it",
                value: "it",
                text: "Italy",
                optionGroup: "Europe",
              },
              {
                id: "pt",
                value: "pt",
                text: "Portugal",
                optionGroup: "Europe",
              },
            ]}
            onChange={function (event) {
              setForm({
                ...form,
                trip: event.currentTarget?.value || "",
              });
              return;
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>Form: Select</div>
        <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
          <FormText
            label="Poem"
            value={form.poem}
            id="form_text_poem"
            placeholder="Type your poem here..."
            onChange={function (event) {
              setForm({
                ...form,
                poem: event.currentTarget?.value || "",
              });
              return;
            }}
          />
          <FormText
            required
            disabled
            height={5}
            label="Poem"
            resize="none"
            value={form.poem}
            id="form_text_poem"
            placeholder="Type your poem here..."
            onChange={function (event) {
              setForm({
                ...form,
                poem: event.currentTarget?.value || "",
              });
              return;
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default FormTest;
