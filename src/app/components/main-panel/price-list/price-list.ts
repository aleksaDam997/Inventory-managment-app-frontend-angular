import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Company, OrgUnit, Product } from '../../../models/models';
import { ApiResponse, ApiError } from '../../../models/response.models';
import { UserRole } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { CompanyManagmentService } from '../../../services/company.managment.service';
import { CommonModule } from '@angular/common';
import { UpsertPriceListModal } from './upsert-price-list-modal/upsert-price-list-modal';
import { ProductService } from '../../../services/product.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmDialogBox } from '../../pop-up/confirm-dialog-box/confirm-dialog-box';
import { take } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-price-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './price-list.html',
  styleUrl: './price-list.css'
})
export class PriceList {

  modalRef?: BsModalRef<UpsertPriceListModal>;
  modalRefConfirm?: BsModalRef<ConfirmDialogBox>;

  productForm!: FormGroup;
  filterForm: FormGroup;
  modalTitle = '';

  companies: Company[] = [];
  products: Product[] = [];

  role: UserRole;

  constructor(private productManagemntService: ProductService, private companyManagmentService: CompanyManagmentService,
    private authService: AuthService, private modalService: BsModalService, private notifyService: NotificationService
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
      },
      error: (err: HttpErrorResponse) => {

        const res = err.error as ApiResponse<null>;

        const error = res?.error;

        if (error && err.status !== 403) {
          this.notifyService.error(error.details);
        }
      }
    });

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

  openCreateOUModal() {

    this.productForm.patchValue({
      productId: null,
      name: '',
      price: '',
      description: '',
      companyId: null
    });

    this.modalTitle = 'Dodaj novi proizvod';

    this.callModal(true, true)

  }

  
  confirmModal(apiResponse: ApiResponse<any>) {

    this.productManagemntService.getAllProducts().subscribe({

      next: (products) => {
        this.products = products;
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

  deleteProduct(productId: number) {

    const modalRefConfirm: BsModalRef = this.modalService.show(ConfirmDialogBox, {
      initialState: {
        title: 'Promjena statusa',
        message: 'Da li ste sigurni da želite izbrisati ovaj proizvod?',
        onConfirm: () => {
          this.productManagemntService.deleteProduct(productId).subscribe({
            next: () => {
              this.products = this.products.filter(p => p.productId !== productId);
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
          this.notifyService.info('Brisanje proizvoda otkazano');
        } 
      },
        ignoreBackdropClick: true,
        keyboard: false 
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

    this.callModal(true, false);
  }

  onFilterSubmit() {

    const companyId = this.filterForm.value.companyId;

    if(+companyId !== 0) {
      if (companyId) {
        this.productManagemntService.getProductsByCompanyId(companyId).subscribe({
          next: (products) => {
            this.products = products;
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
    }else {
      this.productManagemntService.getAllProducts().subscribe({

        next: (products) => {
          this.products = products;
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
  }


  callModal(show: boolean, isCreate: boolean) {
      
    this.modalRef = this.modalService.show(UpsertPriceListModal, {
      class: 'modal-dialog modal-xl modal-fullscreen-md-down modal-dialog-centered',
      initialState: {
        show: show,
        isCreateCompanyModal: isCreate,
        productForm: this.productForm,
        companies: this.companies,
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
