import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Company } from '../../../models/models';
import { CommonModule } from '@angular/common';
import { CompanyManagmentService } from '../../../services/company.managment.service';
import { UpsertCompaniesModal } from './upsert-companies-modal/upsert-companies-modal';
import { CreateApiResponse } from '../../../models/response.models';
import { count } from 'rxjs';

@Component({
  selector: 'app-companies-managment',
  templateUrl: './companies-managment.html',
  styleUrls: ['./companies-managment.css'], // ispravljeno
  standalone: true, // dodaj ako želiš da koristiš imports
  imports: [CommonModule, ReactiveFormsModule, UpsertCompaniesModal] // samo za standalone komponentu
})
export class CompaniesManagment implements OnInit{

  companyForm: FormGroup;

  modalTitle: string = 'Dodaj firmu';

  showModal: boolean = false;
  isCreateCompanyModal: boolean = false;

  companies: Company[] = []; // niz kompanija koji šablon može koristiti

  constructor(private companyManagmentService: CompanyManagmentService) {
    this.companyForm = new FormGroup({
      name: new FormControl(''),
      address: new FormControl(''),
      city: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      website: new FormControl(''),
      postalCode: new FormControl(),
      country: new FormControl(''),
      pib: new FormControl(''),
      upin: new FormControl('')
    });
  }

  ngOnInit(): void {

    this.companyManagmentService.getAllCompanies().subscribe({
      next: (companies) => {
         this.companies = companies;
      },
      error: (error) => {
        console.error('Error fetching companies:', error);
      }
    });
  }

  openCreateCompanyModal() {
    this.companyForm.reset();
    this.isCreateCompanyModal = true;
    this.showModal = true;
  }

  openUpdateCompanyModal(company: Company) {
    this.companyForm.patchValue(company);
    this.companyForm.addControl('companyId', new FormControl(company.companyId));
    this.isCreateCompanyModal = false;
    this.showModal = true;  
  }

  deleteCompany(companyId: number) {
    
    this.companyManagmentService.deleteCompany(companyId).subscribe({
      next: (response) => {
        console.log('Company deleted successfully:', response);
        this.companies = this.companies.filter(company => company.companyId !== companyId);
      },
      error: (error) => {
        console.error('Error deleting company:', error);
      }
    });
  }

  closeModal() {
      this.showModal = false;
    }
  
  confirmModal(apiResponse: CreateApiResponse<Company>) {

    this.companyManagmentService.getAllCompanies().subscribe(companies => {
      this.companies = companies;
    });
  }
}
