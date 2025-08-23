import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserRole, Users } from '../../../models/user.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserManagmentService } from '../../../services/user.managment.service';
import {  UpsertUserModal } from './upsert-user-modal/upsert-user-modal';
import { CompanyManagmentService } from '../../../services/company.managment.service';
import { Company } from '../../../models/models';
import { CreateApiResponse } from '../../../models/response.models';
import { UserFilterRequest } from '../../../models/request.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-managment',
  imports: [CommonModule, ReactiveFormsModule, UpsertUserModal],
  templateUrl: './user-managment.html',
  styleUrl: './user-managment.css'
})
export class UserManagment implements OnInit {

  users: Users[] = [];
  companies: Company[] = [];
  userFilterForm: FormGroup;
  userForm: FormGroup;

  showModal: boolean = false;
  isCreateUserModal: boolean = false;

  role: UserRole | null;

  constructor(private formBuilder: FormBuilder, private userManagmentService: UserManagmentService,
    private companyManagmentService: CompanyManagmentService, private authService: AuthService
  ) {
    
    this.role = this.authService.getUserRole() as UserRole;

    this.userFilterForm = this.formBuilder.group({
      inputText: new FormControl(''),
      role: new FormControl(''),
      companyId: this.role === 'ADMIN'
      ? new FormControl('0')
      : new FormControl(this.authService.getCompanyId()),
      orgUnitId: new FormControl('0'),
      isActive: new FormControl(true)
    });

    this.userForm = this.formBuilder.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      username: new FormControl(''),
      password: new FormControl(''),
      passwordRepeat: new FormControl(''),
      role: new FormControl(''),
      address: new FormControl(''),
      phone: new FormControl(''),
      companyId: new FormControl(''),
      isActive: new FormControl(true)
    });
  }

  ngOnInit() {

    this.userManagmentService.getUsersByFilterCriteria(this.userFilterForm.value).subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });

    this.companyManagmentService.getAllCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (error) => {
        console.error('Error fetching companies:', error);
      }
    });
  }

  getCompanyName(companyId: number): string {
    const company = this.companies.find(c => c.companyId === companyId);
    return company ? company.name : 'Nema firme';
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

  onFilterSubmit() {

    
    const ufReq: UserFilterRequest = {
      inputText: this.userFilterForm.value.inputText,
      role: this.userFilterForm.value.role,
      companyId: +this.userFilterForm.value.companyId,
      orgUnitId: +this.userFilterForm.value.orgUnitId,
      isActive: this.userFilterForm.value.isActive
    }

      this.userManagmentService.getUsersByFilterCriteria(ufReq).subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        }
      });
  }

  openCreateUserModal() {
    this.userForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      passwordRepeat: '',
      address: '',
      phone: '',
      companyId: '',
      isActive: true
    });

    this.showModal = true;
    this.isCreateUserModal = false;
  }

  closeModal() {
    this.showModal = false;
  }

  confirmModal(apiResponse: CreateApiResponse<Users>) {

    this.userManagmentService
      .getUsersByFilterCriteria(this.userFilterForm.value)
      .subscribe({
        next: (users) => {
          this.users = users;

          alert(apiResponse.message);
          this.closeModal();
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          // this.showErrorMessage('Greška prilikom učitavanja korisnika.');
        }
      });
    }

    openUpdateUserModal(user: Users) {
      this.userForm.patchValue(user);
      this.showModal = true;
      this.isCreateUserModal = false;
    }

    deleteUser(userId: number) {
      
    }
}

