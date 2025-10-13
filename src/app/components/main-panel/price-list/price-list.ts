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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmDialogBox } from '../../pop-up/confirm-dialog-box/confirm-dialog-box';
import { take } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';

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
        console.log('Products fetched:', this.products);
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

    this.companyManagmentService.getAllCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
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

  
  confirmModal(apiResponse: CreateApiResponse<any>) {

    this.productManagemntService.getAllProducts().subscribe({

      next: (products) => {
        this.products = products;
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
    }else {
      this.productManagemntService.getAllProducts().subscribe({

        next: (products) => {
          this.products = products;
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
