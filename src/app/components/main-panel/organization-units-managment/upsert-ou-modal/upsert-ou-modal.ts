import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateApiResponse } from '../../../../models/response.models';
import { OrgUnitsManagmentService } from '../../../../services/org_units.managment.service';
import { Company, OrgUnit } from '../../../../models/models';
import { UpsertOrgUnitForm } from '../../../../models/form.models';
import { CreateOrgUnit } from '../../../../models/request.model';

@Component({
  selector: 'app-upsert-ou-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upsert-ou-modal.html',
  styleUrl: './upsert-ou-modal.css'
})
export class UpsertOuModal {

  @Input() show: boolean = false;
  @Input() isCreateCompanyModal: boolean = false;

  @Input() title: string = 'Dodaj organizacionu jedinicu';

  @Input() orgUnitForm!: FormGroup<UpsertOrgUnitForm>;

  @Input() companies: Company[] = [];

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<CreateApiResponse<any>>();

  submitted = false;

  constructor(private orgUnitsManagmentService: OrgUnitsManagmentService) {}  
    
close() {
  // Dodaj fade-out pre stvarnog uklanjanja sa DOM-a
  const modal = document.querySelector('.modal-wrapper') as HTMLElement;
  const backdrop = document.querySelector('.backdrop') as HTMLElement;

  if (modal && backdrop) {
    modal.style.animation = 'fadeOut 0.2s forwards';
    backdrop.style.animation = 'fadeOut 0.2s forwards';
    setTimeout(() => {
      this.show = false;
      this.closed.emit();
    }, 200);
  } else {
    this.show = false;
    this.closed.emit();
  }
}


  confirm(data: CreateApiResponse<OrgUnit>) {
    this.confirmed.emit(data);
  }

  onBackdropClick() {
    this.close();
  }

  onDialogClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onSubmit() {

    const orgUnitData: CreateOrgUnit = {
      orgUnitId: this.orgUnitForm.get('orgUnitId')?.value,
      name: this.orgUnitForm.get('name')?.value,
      code: this.orgUnitForm.get('code')?.value,
      companyId: Number(this.orgUnitForm.get('companyId')?.value)
    };

    if (this.isCreateCompanyModal) {

      this.orgUnitsManagmentService.createNewOrgUnit(orgUnitData).subscribe({
        next: (response) => {
          this.confirm(response);
        },
        error: (error) => {
          console.error('Error creating organizational unit:', error);
        }
      });
    }else {
      this.orgUnitsManagmentService.updateOrgUnit(orgUnitData).subscribe({
        next: (response) => {
          this.confirm(response);
        },
        error: (error) => {
          console.error('Error updating organizational unit:', error);
        }
      });
    }
  }
}