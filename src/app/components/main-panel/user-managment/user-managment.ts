import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserRole, Users } from '../../../models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserManagmentService } from '../../../services/user.managment.service';
import {  UpsertUserModal } from './upsert-user-modal/upsert-user-modal';
import { CompanyManagmentService } from '../../../services/company.managment.service';
import { Company } from '../../../models/models';
import { CreateApiResponse } from '../../../models/response.models';
import { InitForms } from '../../../init/init.forms';
import { AuthService } from '../../../services/auth.service';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { Subject, take, takeUntil } from 'rxjs';
import { ConfirmDialogBox } from '../../pop-up/confirm-dialog-box/confirm-dialog-box';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-user-managment',
  imports: [CommonModule, ReactiveFormsModule, ModalModule],
  templateUrl: './user-managment.html',
  styleUrl: './user-managment.css'
})
export class UserManagment implements OnInit, OnDestroy {

  modalRefConfirm?: BsModalRef<ConfirmDialogBox>;
  modalRef?: BsModalRef<UpsertUserModal>;

  userFilterForm: FormGroup;
  userForm: FormGroup;

  users: Users[] = [];
  companies: Company[] = [];


  showModal: boolean = false;
  isCreateUserModal: boolean = false;

  role: UserRole;

  private destroy$ = new Subject<void>();


  constructor(private formBuilder: FormBuilder, private userManagmentService: UserManagmentService, private notifyService: NotificationService,
    private companyManagmentService: CompanyManagmentService, private authService: AuthService, private modalService: BsModalService
  ) {
    
    this.role = this.authService.getUserRole() as UserRole;

    this.userFilterForm = InitForms.initializeUserFilterForm(this.role, this.authService.getCompanyId()!);  
    this.userForm = InitForms.initializeUserForm(this.role, +this.authService.getCompanyId()!);
  }

  ngOnInit() {

    this.userManagmentService.getUsersByFilterCriteria(this.userFilterForm)
    .pipe(takeUntil(this.destroy$)).subscribe({
      next: (users) => {
        this.users = users;
        console.log(this.users);
      },
      error: (error) => {
        if (error.error && error.error.error) {
          this.notifyService.error(error.error.error);
        } 
        else if (typeof error.error === 'string') {
          this.notifyService.error(error.error);
        } 
        else {
          this.notifyService.error(error);
        }
      }
    });

    this.companyManagmentService.getAllCompanies()
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (companies) => {
          this.companies = companies;
        },
        error: (error) => {
          if (error.error && error.error.error) {
            this.notifyService.error(error.error.error);
          } 
          else if (typeof error.error === 'string') {
            this.notifyService.error(error.error);
          } 
          else {
            this.notifyService.error(error);
          }
        }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

      this.userManagmentService.getUsersByFilterCriteria(this.userFilterForm)
      .pipe(take(1))
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error) => {
          if (error.error && error.error.error) {
            this.notifyService.error(error.error.error);
          } 
          else if (typeof error.error === 'string') {
            this.notifyService.error(error.error);
          } 
          else {
            this.notifyService.error(error);
          }
        }
      });
  }

  openCreateUserModal() {

    this.userForm.reset();
    this.userForm.patchValue({
      companyId: this.role === 'ADMIN' ? 0 : +this.authService.getCompanyId()!,
      orgUnitId: 0,
      isActive: true
    })

    this.callModal(true, true);
  }


  closeModal() {
    this.showModal = false;
  }

  confirmModal(apiResponse: CreateApiResponse<Users>) {

    this.userManagmentService
      .getUsersByFilterCriteria(this.userFilterForm)
      .subscribe({
        next: (users) => {
          this.users = users;

        },
        error: (error) => {
          if (error.error && error.error.error) {
            this.notifyService.error(error.error.error);
          } 
          else if (typeof error.error === 'string') {
            this.notifyService.error(error.error);
          } 
          else {
            this.notifyService.error(error);
          }
        }
      });
    }

    openUpdateUserModal(user: Users) {

      this.userForm.patchValue(user);
      this.callModal(true, false);
    }

    deleteUser(userId: number) {


      const modalRefConfirm: BsModalRef = this.modalService.show(ConfirmDialogBox, {
        initialState: {
          title: 'Promjena statusa',
          message: 'Da li ste sigurni da želite promijeniti status?',
          onConfirm: () => {
            this.userManagmentService.deleteUser(userId).subscribe({
              next: () => {
                this.onFilterSubmit();
                this.notifyService.success("Korisnik uspješno izbrisan.")
              },
              error: (error) => {
                if (error.error && error.error.error) {
                  this.notifyService.error(error.error.error);
                } 
                else if (typeof error.error === 'string') {
                  this.notifyService.error(error.error);
                } 
                else {
                  this.notifyService.error(error);
                }
              }
            });
          },
          onCancel: () => {
            this.notifyService.info('Brisanje korisnika otkazano.');
          } 
        },
          ignoreBackdropClick: true,
          keyboard: false 
      });
    }

    callModal(show: boolean, isCreate: boolean) {
    
      this.modalRef = this.modalService.show(UpsertUserModal, {
        class: 'modal-dialog modal-xl modal-fullscreen-md-down modal-dialog-centered',
        initialState: {
          show: show,
          isCreateUserModal: isCreate,
          companies: this.companies,
          userForm:  this.userForm,
          userRole: this.role
        },
        ignoreBackdropClick: true,
        keyboard: false 
      });

      this.modalRef.content?.confirm
      .pipe(take(1))
      .subscribe((response: CreateApiResponse<Users>) => {
        this.confirmModal(response);
      });
    }
}

