export interface Company {
  companyId: number;
  name: string;
  pib: string;
  upin: string;
  address: string;
  city: string;
  postalCode: number;
  country: string;
  email: string;
  website: string;
  createdAt: Date;
  updatedAt: Date;

  orgUnits: OrgUnit[];
}

export interface OrgUnit {
  orgUnitId: number;
  name: string;
  code: string;
  companyId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  productId: number;
  name: string;
  price: string;
  description: string;
  companyId: number | null;
  createdAt: Date;
  updatedAt: Date;
}