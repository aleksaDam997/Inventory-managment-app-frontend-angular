import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company } from '../../../../models/models';
import { CompanyManagmentService } from '../../../../services/company.managment.service';
import { CreateApiResponse } from '../../../../models/response.models';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UpsertCompanyForm } from '../../../../models/form.models';
import { CompanyRequest } from '../../../../models/request.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-upsert-companies-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upsert-companies-modal.html',
  styleUrl: './upsert-companies-modal.css'
})
export class UpsertCompaniesModal {

  
  @Input() show: boolean = false;
  @Input() isCreateCompanyModal: boolean = true;
  @Input() title = 'Dodaj firmu';

  @Input() companyForm!: FormGroup<UpsertCompanyForm>;


  @Output() closed = new EventEmitter<void>();

  submitted = false;

  constructor(public bsModalRef: BsModalRef, private companyManagmentService: CompanyManagmentService, private notifyService: NotificationService) {}

   close() {
    this.bsModalRef.hide();
  }

  onSubmit() {
  
    if (this.companyForm.invalid) {
      return;
    }

    const company: CompanyRequest = this.companyForm.value;

    if(this.isCreateCompanyModal) {
          this.companyManagmentService.createNewCompany(company).subscribe({
      next: (companyResponse: CreateApiResponse<Company>) => {

        this.close();

        this.companyForm.reset({
          name: '',
          pib: '',
          upin: '',
          address: '',
          city: '',
          postalCode: 0,
          country: '',
          email: ''
        });
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
    }else {
    
    this.companyManagmentService.updateCompany(company).subscribe({
      next: (companyResponse: CreateApiResponse<Company>) => {

        this.close();

        this.companyForm.reset({
          name: '',
          pib: '',
          upin: '',
          address: '',
          city: '',
          postalCode: 0,
          country: '',
          email: ''
        });
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

}


