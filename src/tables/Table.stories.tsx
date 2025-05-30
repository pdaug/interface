import type { Meta, StoryObj } from "@storybook/react";

import Table from "./Table";
import Badge from "../badges/Badge";
import Profile from "../profiles/Profile";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
};

export default meta;

// Dados base
const columns = [
  { id: "brand", label: "Brand" },
  { id: "model", label: "Model" },
  { id: "year", label: "Year" },
];

const rows = [
  {
    id: "1",
    datas: {
      brand: "Volkswagen",
      model: "Polo",
      year: "2024",
    },
  },
  {
    id: "2",
    datas: {
      brand: "Volkswagen",
      model: "Nivus",
      year: "2025",
    },
  },
  {
    id: "3",
    datas: {
      brand: "Volkswagen",
      model: "Tcross",
      year: "2025",
    },
  },
];

const columnsStatus = [
  { id: "status", label: "Status", width: "100px" },
  { id: "brand", label: "Brand" },
  { id: "model", label: "Model" },
  { id: "year", label: "Year" },
];

const rowsStatus = [
  {
    id: "1",
    datas: {
      status: {
        id: "1-status",
        value: <Badge category="primary" value="Primary" />,
      },
      brand: "Volkswagen",
      model: "Polo",
      year: "2024",
    },
  },
  {
    id: "2",
    datas: {
      status: {
        id: "2-status",
        value: <Badge category="secondary" value="Secondary" />,
      },
      brand: "Volkswagen",
      model: "Nivus",
      year: "2025",
    },
  },
  {
    id: "3",
    datas: {
      status: {
        id: "3-status",
        value: <Badge category="warn" value="Warning" />,
      },
      brand: "Volkswagen",
      model: "Tcross",
      year: "2025",
    },
  },
  {
    id: "4",
    datas: {
      status: {
        id: "4-status",
        value: <Badge category="danger" value="Danger" />,
      },
      brand: "Volkswagen",
      model: "Taos",
      year: "2026",
    },
  },
  {
    id: "5",
    datas: {
      status: {
        id: "5-status",
        value: <Badge category="neutral" value="Neutral" />,
      },
      brand: "Volkswagen",
      model: "Saveiro",
      year: "2023",
    },
  },
];

const columnsProfile = [
  { id: "status", label: "Status", width: "100px" },
  { id: "brand", label: "Brand" },
  { id: "profile", label: "Profile" },
  { id: "model", label: "Model" },
  { id: "year", label: "Year" },
];

const rowsProfile = [
  {
    id: "1",
    datas: {
      status: {
        id: "1-status",
        value: <Badge category="primary" value="Primary" />,
      },
      brand: "Volkswagen",
      profile: {
        id: "1-profile",
        value: (
          <Profile
            name="Pedro Augusto"
            description="Developer"
            photo="http://picsum.photos/100/100"
            padding={false}
          />
        ),
      },
      model: "Polo",
      year: "2024",
    },
  },
];

// Stories

export const Basic: StoryObj = {
  name: "Basic Table",
  args: {
    columns,
    rows,
  },
};

export const WithBorder: StoryObj = {
  name: "With Border",
  args: {
    columns: columnsStatus,
    rows: rowsStatus,
    border: true,
  },
};

export const WithCheckbox: StoryObj = {
  name: "With Checkbox",
  args: {
    columns: columnsStatus,
    rows: rowsStatus,
    border: true,
    checkbox: true,
  },
};

export const WithStripedRows: StoryObj = {
  name: "Striped Rows with Checkbox",
  args: {
    columns: columnsStatus,
    rows: rowsStatus,
    border: true,
    checkbox: true,
    striped: true,
  },
};

export const WithProfile: StoryObj = {
  name: "With Profile Column",
  args: {
    columns: columnsProfile,
    rows: rowsProfile,
    border: true,
  },
};
