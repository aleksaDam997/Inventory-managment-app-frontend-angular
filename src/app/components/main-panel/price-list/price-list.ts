import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Company, OrgUnit, Product } from '../../../models/models';
import { CreateApiResponse } from '../../../models/response.models';
import { UserRole } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { CompanyManagmentService } from '../../../services/company.managment.service';
import { CommonModule } from '@angular/common';
import { UpsertPriceListModal } from './upsert-price-list-modal/upsert-price-list-modal';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-price-list',
  imports: [CommonModule, ReactiveFormsModule, UpsertPriceListModal],
  templateUrl: './price-list.html',
  styleUrl: './price-list.css'
})
export class PriceList {
  productForm!: FormGroup;
  filterForm: FormGroup;

  showModal = false;
  isCreateCompanyModal = false;
  modalTitle = '';

  companies: Company[] = [];
  products: Product[] = [];

  role: UserRole;

  constructor(private productManagemntService: ProductService, private companyManagmentService: CompanyManagmentService,
    private authService: AuthService
  ) {

    this.role = this.authService.getUserRole() as UserRole;

    this.productForm = new FormGroup({

      productId: new FormControl(null),
      name: new FormControl(''),
      price: new FormControl(''),
      description: new FormControl(''),
      companyId: new FormControl(null)
      
    });

    this.filterForm = new FormGroup({
      companyId: new FormControl(0)
    });

  }

  ngOnInit(): void {

    this.productManagemntService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        console.log('Products fetched:', this.products);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
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

    this.productForm.patchValue({
      productId: null,
      name: '',
      price: '',
      description: '',
      companyId: null
    });

    this.modalTitle = 'Dodaj novi proizvod';
    this.isCreateCompanyModal = true;
    this.showModal = true;

  }

  closeModal() {
      this.showModal = false;
    }
  
  confirmModal(apiResponse: CreateApiResponse<any>) {
    this.showModal = false;

    this.productManagemntService.getAllProducts().subscribe({

      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  deleteProduct(productId: number) {
    this.productManagemntService.deleteProduct(productId).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.productId !== productId);
      },
      error: (error) => {
        console.error('Error deleting product:', error);
      }
    });
  }

  openUpdateOUModal(product: Product) {

    this.productForm.patchValue({
      productId: product.productId,
      name: product.name,
      price: product.price,
      description: product.description,
      companyId: product.companyId
    });

    this.modalTitle = 'Azuriraj proizvod';
    this.isCreateCompanyModal = false;
    this.showModal = true;


  }

  onFilterSubmit() {

    const companyId = this.filterForm.value.companyId;

    if(+companyId !== 0) {
      if (companyId) {
        this.productManagemntService.getProductsByCompanyId(companyId).subscribe({
          next: (products) => {
            this.products = products;
          },
          error: (error) => {
            console.error('Error fetching products:', error);
          }
      });
    }
    }else {
      this.productManagemntService.getAllProducts().subscribe({

        next: (products) => {
          this.products = products;
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        }
      });
    }
  }
}
