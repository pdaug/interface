import {
  Cube,
  Table as TableIcon,
  GearSix,
  CaretDown,
  Paperclip,
  SuitcaseSimple,
  QuestionMark,
  Plus,
} from "@phosphor-icons/react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Table from "../components/tables/Table";
import Badge from "../components/badges/Badge";
import Button from "../components/buttons/Button";
import Sidebar from "../components/sidebar/Sidebar";
import Profile from "../components/profiles/Profile";
import { Horizontal, Vertical } from "../components/aligns/Align";
import { InputSelect, InputInterval } from "../components/inputs/Input";
import Pagination from "../components/paginations/Pagination";

const meta: Meta = {
  title: "Layout/List",
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj = {
  render: () => {
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
    const [path, setPath] = useState("orders");
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <Horizontal styles={{ height: "100vh" }}>
        <Sidebar
          path={path}
          header={{
            name: "Company Name",
            description: "Workspace Selected",
            dropdown: {
              children: (
                <div className="cursor">
                  <CaretDown />
                </div>
              ),
              values: [
                {
                  id: "workspace_1",
                  label: "Workspace 1",
                },
                {
                  id: "workspace_2",
                  label: "Workspace 2",
                },
              ],
            },
          }}
          menu={[
            {
              id: "financial",
              name: "Financial",
              Icon: TableIcon,
              items: [
                {
                  id: "dashboard",
                  label: "Dashboard",
                  onClick: () => setPath("dashboard"),
                },
                {
                  id: "orders",
                  label: "Orders",
                  onClick: () => setPath("orders"),
                },
                {
                  id: "inflow",
                  label: "Inflow",
                  onClick: () => setPath("inflow"),
                },
                {
                  id: "outflow",
                  label: "Outflow",
                  onClick: () => setPath("outflow"),
                },
                {
                  id: "statements",
                  label: "Statements",
                  onClick: () => setPath("statements"),
                },
              ],
            },
            {
              id: "administrative",
              name: "Administrative",
              Icon: SuitcaseSimple,
              items: [
                {
                  id: "customers",
                  label: "Customers",
                  onClick: () => setPath("customers"),
                },
                {
                  id: "suppliers",
                  label: "Suppliers",
                  onClick: () => setPath("suppliers"),
                },
                {
                  id: "employees",
                  label: "Employees",
                  onClick: () => setPath("employees"),
                },
              ],
            },
            {
              id: "operational",
              name: "Operational",
              Icon: Cube,
              items: [
                {
                  id: "products",
                  label: "Products",
                  onClick: () => setPath("products"),
                },
                {
                  id: "services",
                  label: "Services",
                  onClick: () => setPath("services"),
                },
                {
                  id: "vehicles",
                  label: "Vehicles",
                  onClick: () => setPath("vehicles"),
                },
              ],
            },
            {
              id: "tools",
              name: "Tools",
              Icon: Paperclip,
              items: [
                {
                  id: "documents",
                  label: "Documents",
                  onClick: () => setPath("documents"),
                },
                {
                  id: "schedules",
                  label: "Schedules",
                  onClick: () => setPath("schedules"),
                },
              ],
            },
          ]}
          footer={{
            name: "",
            description: "John Doe",
            photoCircle: true,
            dropdown: {
              children: (
                <div className="cursor">
                  <GearSix />
                </div>
              ),
              values: [
                {
                  id: "settings",
                  label: "Settings",
                },
                {
                  id: "sign_out",
                  label: "Sign Out",
                },
              ],
            },
          }}
        />
        <Vertical
          internal={1}
          styles={{ padding: "1rem", flex: 1, overflowY: "scroll" }}
        >
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
          <Vertical>
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
        </Vertical>
      </Horizontal>
    );
  },
};
