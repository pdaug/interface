export type TypeInputInterval = {
  start: Date | null;
  end: Date | null;
};

export type TypeProductViewMode = "shelves" | "table";

export type TypeAddress = {
  street: string;
  number: string;
  complement?: string;
  postalCode: string;
  neighborhood?: string;
  city: string;
  state: string;
};
