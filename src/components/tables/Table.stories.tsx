import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Badge from "../badges/Badge";
import Profile from "../profiles/Profile";
import Table, { TableColumn } from "./Table";
import { Center } from "../aligns/Align";

export default {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  decorators: (Story) => (
    <Center>
      <Story />
    </Center>
  ),
} as Meta;

const users: {
  [key: number]: { name: string; description: string; photo: string };
} = {
  123: {
    name: "Edward Cullen",
    description: "Product Designer",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
  },
};

// id, name, description, userId, createdAt
const columns: TableColumn = {
  status: {
    label: "Status",
    maxWidth: "96px",
    handler: function (data) {
      return (
        <Badge
          category={data.status ? "Primary" : "Danger"}
          value={data.status ? "Active" : "Disabled"}
        />
      );
    },
  },
  name: { label: "Name" },
  model: { label: "Model" },
  description: { label: "Description" },
  userId: {
    label: "Owner",
    maxWidth: "18%",
    handler: function (data) {
      const currentUser = users?.[data.userId as number];
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
  createdAt: {
    label: "Created at",
    handler: function (data) {
      const dateFormatted = new Date(String(data.createdAt)).toLocaleString();
      return dateFormatted;
    },
  },
};
const data = [
  {
    id: "A123",
    status: true,
    name: "Volkswagen",
    model: "Taos",
    description:
      "Volkswagen is a German automobile manufacturer based in Wolfsburg, Lower Saxony, Germany. Established in 1937 by The German Labour Front, it was revitalized into the global brand it is today after World War II by British Army officer Ivan Hirst. The company is well known for the Beetle and serves as the flagship marque of the Volkswagen Group, which became the world's largest automotive manufacturer by global sales in 2016 and 2017",
    userId: 123,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "B124",
    name: "Fiat",
    model: "500",
    status: true,
    description:
      "Fiat Automobiles S.p.A., commonly known as simply Fiat, is an Italian automobile manufacturer. It became a part of Fiat Chrysler Automobiles in 2014 and, in 2021, became a subsidiary of Stellantis through its Italian division, Stellantis Europe.",
    userId: 123,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "C125",
    name: "Renault",
    model: "Clio",
    status: false,
    description:
      "Renault S.A., commonly referred to as Groupe Renault, also known as the Renault Group in English), is a French multinational automobile manufacturer established in 1899. The company currently produces a range of cars and vans. It has manufactured trucks, tractors, tanks, buses/coaches, aircraft and aircraft engines, as well as autorail vehicles.",
    userId: 123,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "D126",
    name: "Peugeot",
    model: "206",
    status: false,
    description:
      "The family business that preceded the current Peugeot companies was established in 1810, making it the oldest car company in the world. On 20 November 1858, Émile Peugeot applied for the lion trademark. Armand Peugeot (1849-1915) built the company's first vehicle, a steam-powered tricycle. In 1886, the company collaborated with Léon Serpollet, followed by the development of an internal combustion car in 1890, which used a Panhard-Daimler engine.",
    userId: 123,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
];

export const Default: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <Table
        columns={columns}
        data={data}
        selected={selected}
        setSelected={setSelected}
      />
    );
  },
};

export const WithBorder: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <Table
        border
        columns={columns}
        data={data}
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
    );
  },
};
