import React, { useState } from "react";
import { Plus, QuestionMark } from "@phosphor-icons/react";

// components
import Badge from "../../../components/badges/Badge";
import Table from "../../../components/tables/Table";
import Button from "../../../components/buttons/Button";
import Profile from "../../../components/profiles/Profile";
import Pagination from "../../../components/paginations/Pagination";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import { InputInterval, InputSelect } from "../../../components/inputs/Input";

const OrdersList = function () {
  const user: {
    [key: number]: {
      name: string;
      description: string;
      photo: string;
    };
  } = {
    123: {
      name: "Edward Cullen",
      description: "Product Designer",
      photo: "https://randomuser.me/api/portraits/men/75.jpg",
    },
  };
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <React.Fragment>
      <Horizontal>
        <h1>Pedidos</h1>
      </Horizontal>
      <Horizontal internal={1}>
        <Button category="Success" text="Novo Pedido" Icon={Plus} />
        <div>
          <InputSelect
            label=""
            empty=""
            value="general"
            options={[
              {
                id: "inflow",
                text: "Entradas",
                value: "inflow",
              },
              {
                id: "outflow",
                text: "Saídas",
                value: "outflow",
              },
              {
                id: "general",
                text: "Geral",
                value: "general",
              },
            ]}
          />
        </div>
        <div>
          <InputInterval label="" value={["2025-01-01", "2025-02-02"]} />
        </div>
        <div style={{ flex: 1 }}></div>
        <Button category="Neutral" text="Importar" />
        <Button category="Neutral" text="Exportar" />
        <Button category="Neutral" text="" Icon={QuestionMark} onlyIcon />
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
              handler: function (data) {
                const currentUser = user?.[data.userId as number];
                return (
                  <Profile
                    padding={false}
                    name={currentUser.name}
                    photo={currentUser.photo}
                    description={currentUser.description}
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

export default OrdersList;
