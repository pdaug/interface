import React, { useState } from "react";
import { useParams } from "react-router-dom";

// components
import Button from "../../../components/buttons/Button";
import { Input } from "../../../components/inputs/Input";
import Wrapper from "../../../components/wrapper/Wrapper";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const OrdersEdit = function () {
  const { id } = useParams();

  const isEditing = Boolean(id);
  console.log({ isEditing });

  const [form, setForm] = useState({
    name: "",
  });

  return (
    <React.Fragment>
      <Horizontal>
        {/* TODO: change to breadcrumb */}
        <h1>Pedidos</h1>
      </Horizontal>
      <div>
        <Wrapper title="One Title" description="Description">
          <Vertical internal={1}>
            <Horizontal internal={1}>
              <Input
                label="Name"
                placeholder="Name"
                value={form.name}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.name = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
              <Input
                label="Name"
                placeholder="Name"
                value={form.name}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.name = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
              <Input
                label="Name"
                placeholder="Name"
                value={form.name}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.name = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
            </Horizontal>
            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
              <Button category="Neutral" text="Cancel" />
              <Button category="Success" text="Save" />
            </Horizontal>
          </Vertical>
        </Wrapper>
      </div>
    </React.Fragment>
  );
};

export default OrdersEdit;
