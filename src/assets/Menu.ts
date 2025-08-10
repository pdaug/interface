import { Table, Wrench, Package, SuitcaseSimple } from "@phosphor-icons/react";

export const MenuOptions = [
  {
    id: "financial",
    icon: Table,
    items: ["dashboard", "inflows", "outflows", "recurring"],
  },
  {
    id: "administrative",
    icon: SuitcaseSimple,
    items: ["customers", "suppliers", "employees"],
  },
  {
    id: "products",
    icon: Package,
    items: ["list", "sales"],
  },
  {
    id: "services",
    icon: SuitcaseSimple,
    items: ["list", "orders", "vehicles"],
  },
  {
    id: "tools",
    icon: Wrench,
    items: ["automations", "documents", "schedules"],
  },
];
