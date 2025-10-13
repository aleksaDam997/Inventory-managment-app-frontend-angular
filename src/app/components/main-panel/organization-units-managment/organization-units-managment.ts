import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UpsertOuModal } from './upsert-ou-modal/upsert-ou-modal';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateApiResponse } from '../../../models/response.models';
import { Company, OrgUnit } from '../../../models/models';
import { OrgUnitsManagmentService } from '../../../services/org_units.managment.service';
import { CompanyManagmentService } from '../../../services/company.managment.service';
import { UpsertOrgUnitForm } from '../../../models/form.models';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';
import { take } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmDialogBox } from '../../pop-up/confirm-dialog-box/confirm-dialog-box';
import { InitForms } from '../../../init/init.forms';

@Component({
  selector: 'app-organization-units-managment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organization-units-managment.html',
  styleUrl: './organization-units-managment.css'
})
export class OrganizationUnitsManagment implements OnInit{

  modalRef?: BsModalRef<UpsertOuModal>;
  modalRefConfirm?: BsModalRef<ConfirmDialogBox>;

  orgUnitForm!: FormGroup;
  filterForm: FormGroup;

  modalTitle = 'Dodaj organizacionu jedinicu';

  companies: Company[] = [];
  orgUnits: OrgUnit[] = [];

  role: UserRole;

  constructor(private orgUnitsManagmentService: OrgUnitsManagmentService, private companyManagmentService: CompanyManagmentService,
    private authService: AuthService, private modalService: BsModalService, private notifyService: NotificationService
  ) {

    this.role = this.authService.getUserRole() as UserRole;

    this.orgUnitForm = InitForms.initOrgUnitForm();

    this.filterForm = new FormGroup({
      companyId: new FormControl(0)
    });

  }

  ngOnInit(): void {

    this.orgUnitsManagmentService.getAllOrgUnits().subscribe({
      next: (orgUnits) => {
        this.orgUnits = orgUnits;
            console.log(this.orgUnits)

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

    this.companyManagmentService.getAllCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
            console.log(this.companies)

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

  getCompanyName(companyId: number): string {
    return this.companies.find((company: Company) => company.companyId === companyId)?.name!;
  }


  openCreateOUModal() {
    this.orgUnitForm.patchValue({
      orgUnitId: null,
      name: '',
      code: '',
      companyId: 0
    });

    this.modalTitle = 'Dodaj novu organizacionu jedinicu';
    this.callModal(true, true);

  }
  

  deleteOrgUnit(orgUnitId: number) {

    const modalRefConfirm: BsModalRef = this.modalService.show(ConfirmDialogBox, {
      initialState: {
        title: 'Izbriši organizacionu jedinicu',
        message: 'Da li ste sigurni da želite izbrisati ovu organizacionu jedinicu?',
        onConfirm: () => {
          this.orgUnitsManagmentService.deleteOrgUnit(orgUnitId).subscribe({
            next: () => {
              this.orgUnits = this.orgUnits.filter(u => u.orgUnitId !== orgUnitId);
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
          this.notifyService.info('Brisanje organizacione jedinice otkazano');
        } 
      },
        ignoreBackdropClick: true,
        keyboard: false 
    });
  }

  openUpdateOUModal(orgUnit: OrgUnit) {

    this.orgUnitForm.patchValue({
      orgUnitId: orgUnit.orgUnitId,
      name: orgUnit.name,
      code: orgUnit.code,
      companyId: orgUnit.companyId
    });

    this.modalTitle = 'Azuriraj organizacionu jedinicu';
    this.callModal(true, false);

  }

  onFilterSubmit() {

    const companyId = this.filterForm.value.companyId;

    if(+companyId !== 0) {
      if (companyId) {
        this.orgUnitsManagmentService.getOrgUnitsByCompanyId(companyId).subscribe({
          next: (orgUnits) => {
            this.orgUnits = orgUnits;
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
    }else {
      this.orgUnitsManagmentService.getAllOrgUnits().subscribe({

        next: (orgUnits) => {
          this.orgUnits = orgUnits;
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
  }

    callModal(show: boolean, isCreate: boolean) {
        
      this.modalRef = this.modalService.show(UpsertOuModal, {
        class: 'modal-dialog modal-xl modal-fullscreen-md-down modal-dialog-centered',
        initialState: {
          show: show,
          isCreateCompanyModal: isCreate,
          orgUnitForm: this.orgUnitForm,
          companies: this.companies,
          title: this.modalTitle
        },
        ignoreBackdropClick: true,
        keyboard: false 
      });
  
      this.modalRef.onHidden!.pipe(take(1)).subscribe(() => {
        this.onFilterSubmit();
      });
    }
}