import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { OrgUnit, Product } from '../../../../models/models';
import { UserRole } from '../../../../models/user.model';
import { OrderService } from '../../../../services/order.service';
import { CreateOrderRequest } from '../../../../models/request.model';
import { NotificationService } from '../../../../services/notification.service';
import { ApiResponse } from '../../../../models/response.models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-im-upsert-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './im-upsert-modal.html',
  styleUrl: './im-upsert-modal.css'
})
export class ImUpsertModal {


  @Input() orderForm!: FormGroup;
  @Input() products: Product[] = [];

  @Input()
  isCreate: boolean = true;

  @Input()
  title: string = "Dodaj porudžbinu";

  @Input() role!: UserRole;

  submitted = false;

  constructor(public bsModalRef: BsModalRef, private orderService: OrderService, private notifyService: NotificationService) {}

  close() {
    this.bsModalRef.hide();
  }

  onSubmit() {

    if (this.isCreate) {
      this.orderService.makeOrder(this.orderForm).subscribe({
        next: (response) => {
          this.close()
        },
        error: (err: HttpErrorResponse) => {
          
          const res = err.error as ApiResponse<null>;
          const error = res?.error;

          if (error) {
            this.notifyService.error(error.details);
          }
        }
      });
    } else {
      this.orderService.updateOrder(this.orderForm).subscribe({
        next: (response) => {
          this.close()
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
  
    this.orderForm.reset();
  }

  getProductById(productId: number): Product {
    return this.products.find((pro: Product) => +pro.productId === +productId)!;
  }

  get orderProducts(): FormArray {
    const control = this.orderForm.get('orderProducts');
    if (control instanceof FormArray) {
      return control;
    } else {
      throw new Error("orderProducts kontrola nije FormArray!");
    }
  }


  createOrderProduct(): FormGroup {

    return new FormGroup({
      productId: new FormControl(this.orderForm.get('productId')?.value ?? 0),
      quantity: new FormControl(this.orderForm.get('quantity')?.value ?? 1),
      currentPrice: new  FormControl(this.products.find((product: Product) => +product.productId === +this.orderForm.get('productId')?.value!)?.price)
    });
  }


  addProduct() {

    const productId = +this.orderForm.get('productId')?.value!;
    if (!productId || productId === 0) {
      return;
    }

    const p = this.orderProducts.controls.find((control): control is FormGroup =>
      control instanceof FormGroup && +control.get('productId')!.value === productId
    );

    if (p) {
      p.patchValue({
        quantity: +p.get('quantity')!.value + +this.orderForm.get('quantity')!.value!
      });
    } else {
      this.orderProducts.push(this.createOrderProduct());
    }
  }


  removeProduct(index: number) {
    this.orderProducts.removeAt(index);
  }

}
