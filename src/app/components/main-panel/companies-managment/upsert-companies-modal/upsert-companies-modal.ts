import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company } from '../../../../models/models';
import { CompanyManagmentService } from '../../../../services/company.managment.service';
import { CreateApiResponse } from '../../../../models/response.models';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UpsertCompanyForm } from '../../../../models/form.models';
import { CompanyRequest } from '../../../../models/request.model';

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
  @Output() confirmed = new EventEmitter<CreateApiResponse<Company>>();

  submitted = false;

  constructor(private companyManagmentService: CompanyManagmentService) {}

  close() {
    this.closed.emit();
  }

  confirm(data: CreateApiResponse<Company>) {
    this.confirmed.emit(data);
  }

  onBackdropClick() {
    this.close();
  }

  onDialogClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onSubmit() {
  
    if (this.companyForm.invalid) {
      return;
    }


    const company: CompanyRequest = this.companyForm.value;

    if(this.isCreateCompanyModal) {
          this.companyManagmentService.createNewCompany(company).subscribe({
      next: (companyResponse: CreateApiResponse<Company>) => {

        this.confirm(companyResponse);

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
        console.error('Error creating user:', error);
      }
    });
    }else {
    
    this.companyManagmentService.updateCompany(company).subscribe({
      next: (companyResponse: CreateApiResponse<Company>) => {

        this.confirm(companyResponse);

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
        console.error('Error creating user:', error);
      }
    });
    }
  }

}


