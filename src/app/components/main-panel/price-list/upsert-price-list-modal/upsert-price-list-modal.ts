import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UpsertOrgUnitForm } from '../../../../models/form.models';
import { Company, OrgUnit, Product } from '../../../../models/models';
import { CreateApiResponse } from '../../../../models/response.models';
import { OrgUnitsManagmentService } from '../../../../services/org_units.managment.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../services/product.service';
import { CreateProduct } from '../../../../models/request.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../../../services/notification.service';

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


  submitted = false;

  constructor(private productService: ProductService, private modalService: BsModalService, private notifyService: NotificationService) {}  
    
  close() {
    this.modalService.hide();
  }

  onSubmit() {

    const product: CreateProduct = {
      productId: this.productForm.get('productId')?.value,
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      companyId: Number(this.productForm.get('companyId')?.value),
      description: ''
    };

    if (this.isCreateCompanyModal) {

      this.productService.createNewProduct(product).subscribe({
        next: (response) => {
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

      this.productService.updateProduct(product).subscribe({
        next: (response) => {
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

    this.close();
  }
}
