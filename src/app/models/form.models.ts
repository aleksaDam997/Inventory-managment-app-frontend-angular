import { FormControl } from "@angular/forms";
import { UserRole } from "./user.model";

export interface CreateUserForm {
  userId: FormControl<number>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  username: FormControl<string>;
  oldPassword: FormControl<string>;
  password: FormControl<string>;
  passwordRepeat: FormControl<string>;
  role: FormControl<UserRole>;
  address: FormControl<string>;
  phone: FormControl<string>;
  companyId: FormControl<number>;
  orgUnitId: FormControl<number>;
  isActive: FormControl<boolean>;
}

export interface UpsertCompanyForm {
  name: FormControl<string>;
  pib: FormControl<string>;
  upin: FormControl<string>;
  address: FormControl<string>;
  city: FormControl<string>;
  postalCode: FormControl<number>;
  country: FormControl<string>;
  email: FormControl<string>;
  website: FormControl<string>;
}

export interface UpsertOrgUnitForm {

  orgUnitId: FormControl<number | null>;
  name: FormControl<string>;
  code: FormControl<string>;
  companyId: FormControl<number | null>;
}