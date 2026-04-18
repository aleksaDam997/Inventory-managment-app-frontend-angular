import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiResponse } from '../../../../models/response.models';
import { OrgUnitsManagmentService } from '../../../../services/org_units.managment.service';
import { Company, OrgUnit } from '../../../../models/models';
import { UpsertOrgUnitForm } from '../../../../models/form.models';
import { CreateOrgUnit } from '../../../../models/request.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../../../services/notification.service';

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

  submitted = false;

  constructor(private orgUnitsManagmentService: OrgUnitsManagmentService, private bsModalRef: BsModalRef, 
    private notifyService: NotificationService) {}  
    
  close() {
    this.bsModalRef.hide();
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
          this.close();
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
      this.orgUnitsManagmentService.updateOrgUnit(orgUnitData).subscribe({
        next: (response) => {
          this.close();
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