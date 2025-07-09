import { Cube, Table, Wrench, SuitcaseSimple } from "@phosphor-icons/react";

export const MenuOptions = [
  {
    id: "financial",
    icon: Table,
    items: ["dashboard", "orders", "inflows", "outflows", "statements"],
  },
  {
    id: "administrative",
    icon: SuitcaseSimple,
    items: ["customers", "suppliers", "employees"],
  },
  {
    id: "operational",
    icon: Cube,
    items: ["products", "services", "vehicles"],
  },
  {
    id: "tools",
    icon: Wrench,
    items: ["documents", "schedules"],
  },
];
