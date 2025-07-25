import React, { useState } from "react";
import { useParams } from "react-router-dom";

// hooks
import useSystem from "../../../hooks/useSystem";
import useTranslate from "../../../hooks/useTranslate";

// components
import Button from "../../../components/buttons/Button";
import { Input } from "../../../components/inputs/Input";
import Wrapper from "../../../components/wrapper/Wrapper";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const OrdersInspect = function () {
  const t = useTranslate();
  const { id } = useParams();
  const { workspaces, workspaceId } = useSystem();

  const [form, setForm] = useState({
    name: "",
  });

  return (
    <React.Fragment>
      <Horizontal>
        <h2>
          <Breadcrumb
            links={[
              {
                id: "workspace",
                label:
                  workspaces.find(function (workspace) {
                    return workspace.id === workspaceId;
                  })?.name || "",
                url: "/f/",
              },
              {
                id: "orders",
                label: t.order.orders,
                url: "/f/orders",
              },
              {
                id: "order",
                label: form?.name || t.components.empty_name,
                url: `/f/orders/inspect${id ? `/${id}` : ""}`,
              },
            ]}
          />
        </h2>
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

export default OrdersInspect;
