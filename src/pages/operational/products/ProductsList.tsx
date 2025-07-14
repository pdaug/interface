import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { endOfDay, startOfDay, subMonths } from "date-fns";
import { Plus, QuestionMark } from "@phosphor-icons/react";

// hooks
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputInterval,
  InputSelect,
} from "../../../components/inputs/Input";
import Badge from "../../../components/badges/Badge";
import Table from "../../../components/tables/Table";
import Button from "../../../components/buttons/Button";
import Tooltip from "../../../components/tooltips/Tooltip";
import Profile from "../../../components/profiles/Profile";
import { useDialog } from "../../../components/dialogs/Dialog";
import Pagination from "../../../components/paginations/Pagination";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const ProductsList = function () {
  const t = useTranslate();
  const navigate = useNavigate();
  const { OpenDialog } = useDialog();

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [interval, setInterval] = useState({
    start: subMonths(startOfDay(new Date()), 1),
    end: endOfDay(new Date()),
  });

  return (
    <React.Fragment>
      <Horizontal>
        <h1>{t.product.products}</h1>
      </Horizontal>
      <Horizontal internal={1} styles={{ overflow: "hidden" }}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.product.new}
          onClick={() => navigate("/f/operational/products/inspect")}
        />
        <div>
          <InputSelect
            label=""
            empty=""
            value="all"
            options={[
              {
                id: "all",
                value: "all",
                text: t.components.all,
              },
              {
                id: "physical",
                value: "physical",
                text: t.product.physical,
              },
              {
                id: "digital",
                value: "digital",
                text: t.product.digital,
              },
            ]}
          />
        </div>
        <div>
          <InputInterval
            label=""
            value={[
              interval.start.toISOString().slice(0, 10),
              interval.end.toISOString().slice(0, 10),
            ]}
          />
        </div>
        <Input
          label=""
          value={""}
          placeholder={t.components.search}
          onChange={function () {
            return;
          }}
        />
        <div style={{ flex: 1 }}></div>
        <Button category="Neutral" text={t.components.import} />
        <Button category="Neutral" text={t.components.export} />
        <Tooltip content={t.components.help}>
          <Button
            text=""
            onlyIcon
            category="Neutral"
            Icon={QuestionMark}
            onClick={function () {
              OpenDialog({
                width: 700,
                category: "Success",
                title: t.components.help,
                cancelText: t.components.close,
                description: (
                  <iframe
                    height={400}
                    style={{ border: "none", width: "100%" }}
                    src="https://www.youtube.com/embed/L-yA7-puosA"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  />
                ),
              });
              return;
            }}
          />
        </Tooltip>
      </Horizontal>
      <Vertical internal={1} styles={{ flex: 1 }}>
        <Table
          border
          data={[
            {
              id: "123",
              status: true,
              originName: "Fulano de Tal",
              priceMethod: "pix",
              priceTotal: "200",
              dateOverdue: "2025-01-01T00:00:00.000Z",
              datePayment: "",
              destinationName: "Cliente de Tal",
              userId: 123,
            },
          ]}
          columns={{
            status: {
              label: "Status",
              maxWidth: "96px",
              handler: function (data) {
                return (
                  <Badge
                    category={data.status ? "Success" : "Danger"}
                    value={data.status ? "Active" : "Disabled"}
                  />
                );
              },
            },
            originName: { label: "Origem" },
            priceMethod: { label: "Forma de pagamento" },
            priceTotal: { label: "Valor" },
            dateOverdue: {
              label: "Data do vencimento",
              handler: function (data) {
                const dateFormatted = new Date(
                  String(data.dateOverdue),
                ).toLocaleString();
                return dateFormatted;
              },
            },
            datePayment: {
              label: "Data do pagamento",
              handler: function (data) {
                const dateFormatted = data.datePayment
                  ? new Date(String(data.datePayment)).toLocaleString()
                  : "no data";
                return dateFormatted;
              },
            },
            destinationName: { label: "Destino" },
            userId: {
              label: "Responsável",
              maxWidth: "15%",
              handler: function () {
                return (
                  <Profile
                    padding={false}
                    name={"currentUser.name"}
                    photo={"currentUser.photo"}
                    description={"currentUser.description"}
                    photoSize={3}
                  />
                );
              },
            },
          }}
          selected={selected}
          setSelected={setSelected}
          options={[
            {
              id: "1",
              label: "Paste",
              onClick: () => alert(`Paste clicked!`),
            },
            {
              id: "2",
              label: "Copy",
              onClick: () => alert(`Copy clicked!`),
            },
            {
              id: "3",
              label: "Delete",
              disabled: true,
            },
          ]}
        />
        <Pagination
          display
          pageCurrent={page}
          setPage={setPage}
          itemsTotal={100}
          pageSize={10}
        />
      </Vertical>
    </React.Fragment>
  );
};

export default ProductsList;
