import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UpsertOrgUnitForm } from '../../../../models/form.models';
import { Company, OrgUnit } from '../../../../models/models';
import { CreateApiResponse } from '../../../../models/response.models';
import { OrgUnitsManagmentService } from '../../../../services/org_units.managment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upsert-price-list-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upsert-price-list-modal.html',
  styleUrl: './upsert-price-list-modal.css'
})
export class UpsertPriceListModal {
  
  @Input() show: boolean = false;
  @Input() isCreateCompanyModal: boolean = false;

  @Input() title: string = 'Dodaj proizvod';

  @Input() productForm!: FormGroup;

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
    if (this.productForm.valid) {
    }
  }
}
