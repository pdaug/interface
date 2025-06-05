import { toast } from "sonner";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "../components/inputs/Input";
import Wrapper from "../components/wrapper/Wrapper";
import { ToastElement } from "../components/toasts/Toast";
import { Center, Horizontal, Vertical } from "../components/aligns/Align";

export default {
  title: "Layout/Login",
  tags: ["autodocs"],
  decorators: (Story) => (
    <Center>
      <ToastElement />
      <Story />
    </Center>
  ),
} as Meta;

export const Default: StoryObj = {
  render: () => {
    const [form, setForm] = useState({
      username: "",
      password: "",
    });
    return (
      <Wrapper
        styles={{ maxWidth: "35rem" }}
        actions={[
          {
            category: "Neutral",
            text: "Forgot Password",
            onClick: function () {
              toast.message("Forgot Password!");
              return;
            },
          },
          {
            category: "Primary",
            text: "Login",
            onClick: function () {
              toast.success("Login!");
              return;
            },
          },
        ]}
      >
        <Vertical internal={1}>
          <Horizontal styles={{ flex: 1, justifyContent: "center" }}>
            <img src="https://placehold.co/400x200" alt="logo" />
          </Horizontal>
          <Input
            required
            label="Username"
            placeholder="John Doe"
            value={form.username}
            onChange={function (event) {
              setForm({ ...form, username: event.currentTarget?.value || "" });
              return;
            }}
          />
          <Input
            required
            label="Password"
            placeholder="********"
            value={form.username}
            onChange={function (event) {
              setForm({ ...form, username: event.currentTarget?.value || "" });
              return;
            }}
          />
        </Vertical>
      </Wrapper>
    );
  },
};
