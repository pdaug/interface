import React, { useState } from "react";
import { Asterisk } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// types
import { TypeOrder } from "../../../types/Order";

// hooks
import useSystem from "../../../hooks/useSystem";
import useTranslate from "../../../hooks/useTranslate";

// components
import Button from "../../../components/buttons/Button";
import { Input } from "../../../components/inputs/Input";
import Wrapper from "../../../components/wrapper/Wrapper";
import Callout from "../../../components/callouts/Callout";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const OrdersInspect = function () {
  const t = useTranslate();
  const { id } = useParams();
  const navigate = useNavigate();
  const { workspaces, workspaceId } = useSystem();

  const [form, setForm] = useState<Partial<TypeOrder>>({
    id: "",
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
                label: form?.id || t.components.empty_name,
                url: `/f/orders/inspect${id ? `/${id}` : ""}`,
              },
            ]}
          />
        </h2>
      </Horizontal>
      <form>
        <Vertical internal={1}>
          <Wrapper title="One Title" description="Description">
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <Input
                  label="Name"
                  placeholder="Name"
                  value={form.id || ""}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.id = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
            </Vertical>
          </Wrapper>

          <Callout
            Icon={Asterisk}
            category="Warning"
            text={t.callout.required_fields}
            styles={{ fontSize: "var(--textSmall)" }}
          />

          <Wrapper>
            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
              <Button
                type="button"
                category="Neutral"
                text={t.components.cancel}
                onClick={function () {
                  navigate("/f/orders");
                  return;
                }}
              />
              <Button
                type="submit"
                category="Success"
                text={id ? t.components.edit : t.components.save}
              />
            </Horizontal>
          </Wrapper>
        </Vertical>
      </form>
    </React.Fragment>
  );
};

export default OrdersInspect;
