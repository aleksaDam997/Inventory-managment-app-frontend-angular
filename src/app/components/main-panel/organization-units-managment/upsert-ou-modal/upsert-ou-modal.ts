import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateApiResponse } from '../../../../models/response.models';
import { OrgUnitsManagmentService } from '../../../../services/org_units.managment.service';
import { Company, OrgUnit } from '../../../../models/models';
import { UpsertOrgUnitForm } from '../../../../models/form.models';

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
    this.closed.emit();
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
    if (this.orgUnitForm.valid) {
    }
  }
}