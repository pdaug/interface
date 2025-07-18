export type TypeProductType = "physical" | "digital";

export type TypeProductCategory = "variant" | "single";

export type TypeProductVariants = {
  id: string;
  name: string;
  price: number;
};

export type TypeProductLicense = "lifetime" | "subscription" | "single_use";

export type TypeProductMethod = "website" | "email" | "service";

export type TypeProductAccess = "download" | "streaming" | "cloud" | "external";

export type TypeProductCondition = "new" | "used";

export type TypeProduct = {
  id: string;

  status: boolean;
  name: string;
  description: string;
  type: TypeProductType;
  category: TypeProductCategory;
  variants: TypeProductVariants[];

  specificAuthor?: string | null;
  specificPublisher?: string | null;
  specificLicense?: TypeProductLicense | null;
  specificFormat?: string | null;
  specificSize?: string | null;
  specificUrl?: string | null;
  specificMethod?: TypeProductMethod | null;
  specificAccess?: TypeProductAccess | null;
  specificVersion?: string | null;

  propertyBrand?: string | null;
  propertyModel?: string | null;
  propertyYear?: number | null;
  propertyColor?: string | null;
  propertySeries?: string | null;
  propertyOrigin?: string | null;
  propertyWarranty?: number | null;
  propertyMaterial?: string | null;
  propertyCondition?: TypeProductCondition | null;

  attributeWeight?: number | null;
  attributeHeight?: number | null;
  attributeLength?: number | null;
  attributeDepth?: number | null;
  attributeCapacity?: number | null;
  attributeVolume?: number | null;

  tags: string[];

  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
