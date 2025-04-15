// components
import Badge from "../badges/Badge";
import Profile from "../profiles/Profile";
import Table from "./Table";

const TableTest = function () {
  const columns = [
    {
      id: "brand",
      label: "Brand",
    },
    {
      id: "model",
      label: "Model",
    },
    {
      id: "year",
      label: "Year",
    },
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
    {
      id: "status",
      label: "Status",
      width: "100px",
    },
    {
      id: "brand",
      label: "Brand",
    },
    {
      id: "model",
      label: "Model",
    },
    {
      id: "year",
      label: "Year",
    },
  ];
  const rowsStatus = [
    {
      id: "1",
      datas: {
        status: {
          id: "1-status",
          value: <Badge category="primary" text="Primary" />,
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
          value: <Badge category="secondary" text="Secondary" />,
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
          value: <Badge category="warn" text="Warning" />,
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
          value: <Badge category="danger" text="Danger" />,
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
          value: <Badge category="neutral" text="Neutral" />,
        },
        brand: "Volkswagen",
        model: "Saveiro",
        year: "2023",
      },
    },
  ];
  const columnsProfile = [
    {
      id: "status",
      label: "Status",
      width: "100px",
    },
    {
      id: "brand",
      label: "Brand",
    },
    {
      id: "profile",
      label: "Profile",
    },
    {
      id: "model",
      label: "Model",
    },
    {
      id: "year",
      label: "Year",
    },
  ];
  const rowsProfile = [
    {
      id: "1",
      datas: {
        status: {
          id: "1-status",
          value: <Badge category="primary" text="Primary" />,
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
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>Table</div>
      <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
        <Table columns={columns} rows={rows} />
        <Table border columns={columnsStatus} rows={rowsStatus} />
      </div>
      <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
        <Table border checkbox columns={columnsStatus} rows={rowsStatus} />
        <Table
          border
          striped
          checkbox
          columns={columnsStatus}
          rows={rowsStatus}
        />
      </div>
      <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
        <Table border columns={columnsProfile} rows={rowsProfile} />
        <Table border columns={columnsProfile} rows={rowsProfile} />{" "}
      </div>
    </div>
  );
};

export default TableTest;
