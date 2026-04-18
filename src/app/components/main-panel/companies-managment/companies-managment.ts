import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Company } from '../../../models/models';
import { CommonModule } from '@angular/common';
import { CompanyManagmentService } from '../../../services/company.managment.service';
import { UpsertCompaniesModal } from './upsert-companies-modal/upsert-companies-modal';
import { ApiError, ApiResponse } from '../../../models/response.models';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../../services/notification.service';
import { Subject, take, takeUntil } from 'rxjs';
import { ConfirmDialogBox } from '../../pop-up/confirm-dialog-box/confirm-dialog-box';
import { InitForms } from '../../../init/init.forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-companies-managment',
  templateUrl: './companies-managment.html',
  styleUrls: ['./companies-managment.css'], // ispravljeno
  standalone: true, // dodaj ako želiš da koristiš imports
  imports: [CommonModule, ReactiveFormsModule, ModalModule] // samo za standalone komponentu
})
export class CompaniesManagment implements OnInit{

  modalRef?: BsModalRef<UpsertCompaniesModal>;
  modalRefConfirm?: BsModalRef<ConfirmDialogBox>;

  companyForm: FormGroup;

  modalTitle: string = 'Dodaj firmu';

  companies: Company[] = [];

  constructor(private companyManagmentService: CompanyManagmentService, private modalService: BsModalService, 
    private notifyService: NotificationService) {
    this.companyForm = InitForms.initCompanyForm();
  }

  ngOnInit(): void {
    this.onFilterSubmit();
  }

  onFilterSubmit() {
        this.companyManagmentService.getAllCompanies().subscribe({
      next: (companies) => {
         this.companies = companies;
      },
      error: (err: HttpErrorResponse) => {
          const res = err.error as ApiResponse<null>;

          const error = res?.error;

          if (error) {
            this.notifyService.error(error.details);
          }
      }
    });
  }

  openCreateCompanyModal() {
    this.companyForm.reset();
    this.modalTitle = 'Dodaj firmu';
    this.callModal(true, true);
  }

  openUpdateCompanyModal(company: Company) {
    this.companyForm.patchValue(company);
    this.companyForm.addControl('companyId', new FormControl(company.companyId));
    this.modalTitle = "Azuriraj podatke firme";
    this.callModal(true, false);

  }

  deleteCompany(companyId: number) {
    
    const modalRefConfirm: BsModalRef = this.modalService.show(ConfirmDialogBox, {
          initialState: {
            title: 'Izbriši firmu',
            message: 'Da li ste sigurni da želite izbrisati ovu firmu?',
            onConfirm: () => {
              this.companyManagmentService.deleteCompany(companyId).subscribe({
                next: (response) => {
                  this.companies = this.companies.filter(company => company.companyId !== companyId);
                },
                error: (err: HttpErrorResponse) => {
                    const res = err.error as ApiResponse<null>;

                    const error = res?.error;

                    if (error) {
                      this.notifyService.error(error.details);
                    }
                }
              });
            },
            onCancel: () => {
              this.notifyService.info('Brisanje firme otkazano');
            } 
          },
            ignoreBackdropClick: true,
            keyboard: false 
        });
  }

  callModal(show: boolean, isCreate: boolean) {
      
    this.modalRef = this.modalService.show(UpsertCompaniesModal, {
      class: 'modal-dialog modal-xl modal-fullscreen-md-down modal-dialog-centered',
      initialState: {
        show: show,
        isCreateCompanyModal: isCreate,
        companyForm: this.companyForm,
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
