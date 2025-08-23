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

@Component({
  selector: 'app-organization-units-managment',
  imports: [CommonModule, UpsertOuModal, ReactiveFormsModule],
  templateUrl: './organization-units-managment.html',
  styleUrl: './organization-units-managment.css'
})
export class OrganizationUnitsManagment implements OnInit{

  orgUnitForm!: FormGroup;
  filterForm: FormGroup;

  showModal = false;
  isCreateCompanyModal = false;
  modalTitle = '';

  companies: Company[] = [];
  orgUnits: OrgUnit[] = [];

  role: UserRole;

  constructor(private orgUnitsManagmentService: OrgUnitsManagmentService, private companyManagmentService: CompanyManagmentService,
    private authService: AuthService
  ) {

    this.role = this.authService.getUserRole() as UserRole;

    this.orgUnitForm = new FormGroup({

      orgUnitId: new FormControl(null),
      name: new FormControl(''),
      code: new FormControl(''),
      companyId: new FormControl(null)
      
    });

    this.filterForm = new FormGroup({
      companyId: new FormControl(0)
    });

  }

  ngOnInit(): void {

    this.orgUnitsManagmentService.getAllOrgUnits().subscribe({
      next: (orgUnits) => {
        this.orgUnits = orgUnits;
      },
      error: (error) => {
        console.error('Error fetching organizational units:', error);
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

  openCreateOUModal() {

    this.orgUnitForm.patchValue({
      orgUnitId: null,
      name: '',
      code: '',
      companyId: null
    });

    this.modalTitle = 'Dodaj novu organizacionu jedinicu';
    this.isCreateCompanyModal = true;
    this.showModal = true;

  }

  closeModal() {
      this.showModal = false;
    }
  
  confirmModal(apiResponse: CreateApiResponse<any>) {
    this.showModal = false;

    this.orgUnitsManagmentService.getAllOrgUnits().subscribe({

      next: (orgUnits) => {
        this.orgUnits = orgUnits;
      },
      error: (error) => {
        console.error('Error fetching organizational units:', error);
      }
    });
  }

  deleteOrgUnit(orgUnitId: number) {
    this.orgUnitsManagmentService.deleteOrgUnit(orgUnitId).subscribe({
      next: () => {
        this.orgUnits = this.orgUnits.filter(u => u.orgUnitId !== orgUnitId);
      },
      error: (error) => {
        console.error('Error deleting organizational unit:', error);
      }
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
    this.isCreateCompanyModal = false;
    this.showModal = true;


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
            console.error('Error fetching organizational units:', error);
          }
      });
    }
    }else {
      this.orgUnitsManagmentService.getAllOrgUnits().subscribe({

        next: (orgUnits) => {
          this.orgUnits = orgUnits;
        },
        error: (error) => {
          console.error('Error fetching organizational units:', error);
        }
      });
    }
  }
}