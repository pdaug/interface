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
    const OnSubmit = function (event: React.FormEvent) {
      event.preventDefault();
      return;
    };
    return (
      <form onSubmit={OnSubmit}>
        <Wrapper
          styles={{ maxWidth: "35rem" }}
          actions={[
            {
              type: "button",
              category: "Neutral",
              text: "Forgot Password",
              onClick: function () {
                toast.message("Forgot Password!");
                return;
              },
            },
            {
              type: "submit",
              category: "Success",
              text: "Login",
            },
          ]}
        >
          <Vertical internal={1}>
            <Horizontal styles={{ flex: 1, justifyContent: "center" }}>
              <img src="https://placehold.co/400x200" alt="logo" />
            </Horizontal>
            <Input
              required
              id="login_username"
              name="username"
              label="Username"
              placeholder="John Doe"
              value={form.username}
              onChange={function (event) {
                const newForm = { ...form };
                newForm.username = event.currentTarget?.value || "";
                setForm(newForm);
                return;
              }}
            />
            <Input
              required
              id="login_password"
              name="password"
              type="password"
              label="Password"
              placeholder="********"
              value={form.password}
              onChange={function (event) {
                const newForm = { ...form };
                newForm.password = event.currentTarget?.value || "";
                setForm(newForm);
                return;
              }}
            />
          </Vertical>
        </Wrapper>
      </form>
    );
  },
};
