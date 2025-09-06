import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateUserForm } from '../../../../models/form.models';
import { Company } from '../../../../models/models';
import { UserManagmentService } from '../../../../services/user.managment.service';
import { CreateUserRequest, UpdateUserRequest } from '../../../../models/request.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CreateApiResponse } from '../../../../models/response.models';
import { Users } from '../../../../models/user.model';

@Component({
  selector: 'app-upsert-user-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upsert-user-modal.html',
  styleUrl: './upsert-user-modal.css'
})
export class UpsertUserModal {
  
  @Input() show: boolean = false;
  @Input() isCreateUserModal: boolean = true;
  @Input() title = 'Dodaj korisnika';

  @Input() userForm!: FormGroup<CreateUserForm>;

  @Input() userRole: string | null = '';

  @Output() confirm: EventEmitter<CreateApiResponse<Users>> = new EventEmitter();

  roles = ["ADMIN", "EDITOR", "USER"]

  @Input()
  companies: Company[] = [];


  submitted = false;

  constructor(public bsModalRef: BsModalRef, private userManagmentService: UserManagmentService) {

    if(this.userRole !== 'ADMIN') {
      this.roles = this.roles.filter(role => role !== 'ADMIN');
    }
  }

 close() {
    this.bsModalRef.hide();
  }

  getOrgUnitName(companyId: number, orgUnitId: number): string {
    const company = this.companies.find(c => c.companyId === companyId);
    const orgUnit = company?.orgUnits.find(ou => ou.orgUnitId === orgUnitId);
    return orgUnit ? orgUnit.name : 'Nema filijale';
  }

  getOrgUnitsByCompanyId(companyId: number) {
    const company = this.companies.find(c => +c.companyId === +companyId);
    return company ? company.orgUnits : [];
  }

  onSubmit() {

    if(this.userForm.value.password !== this.userForm.value.passwordRepeat) {

      return;
    }

    const user: CreateUserRequest = {
      firstName: this.userForm.value.firstName!,
      lastName: this.userForm.value.lastName!,
      email: this.userForm.value.email!,
      username: this.userForm.value.username!,
      password: this.userForm.value.password!,
      role: this.userForm.value.role!,
      address: this.userForm.value.address!,
      phone: this.userForm.value.phone!,
      companyId: +this.userForm.value.companyId!,
      orgUnitId: +this.userForm.value.orgUnitId!,
      isActive: this.userForm.value.isActive!

    };


    if(this.isCreateUserModal) {

      this.submitted = true;

      if (this.userForm.invalid) {
        this.userForm.markAllAsTouched();
        return;
      }

      this.userManagmentService.createNewUser(user).subscribe({
        next: (user) => {

          this.confirm.emit({
            data: user,
            message: 'User created successfully!',
            status: 'success'
          });
          
          this.userForm.reset({
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            password: '',
            passwordRepeat: '',
            address: '',
            phone: '',
            isActive: true
          });

          this.close();
        },
        error: (error) => {
          console.error('Error creating user:', error);
        }
      });
    } else {

      this.submitted = false;

      const updatedUser: UpdateUserRequest = {
        userId: this.userForm.value.userId!,
        firstName: this.userForm.value.firstName!,
        lastName: this.userForm.value.lastName!,
        email: this.userForm.value.email!,
        username: this.userForm.value.username!,
        password: this.userForm.value.password!,
        address: this.userForm.value.address!,
        phone: this.userForm.value.phone!,
        orgUnitId: this.userForm.value.orgUnitId!,
        role: this.userForm.value.role!,
        isActive: this.userForm.value.isActive!
      };

      this.userManagmentService.updateAnotherUser(updatedUser).subscribe({
        next: (apiResponse) => {
          this.confirm.emit(apiResponse);

          this.userForm.reset({
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            password: '',
            passwordRepeat: '',
            address: '',
            phone: '',
            isActive: true
          });

          this.close();
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    }
  }
}
