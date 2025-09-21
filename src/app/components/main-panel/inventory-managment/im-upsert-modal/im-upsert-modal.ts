import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { OrgUnit, Product } from '../../../../models/models';
import { UserRole } from '../../../../models/user.model';
import { OrderService } from '../../../../services/order.service';
import { CreateOrderRequest } from '../../../../models/request.model';
import { NotificationService } from '../../../../services/notification.service';

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

  constructor(public bsModalRef: BsModalRef, private orderService: OrderService, private notificationService: NotificationService) {}

  close() {
    this.bsModalRef.hide();
  }

  onSubmit() {

    if (this.isCreate) {
      this.orderService.makeOrder(this.orderForm).subscribe({
        next: (response) => {

          this.notificationService.success(response.message);
          this.close()
        },
        error: (error) => {
          this.notificationService.error(error.error);
        }
      });
    } else {
      this.orderService.updateOrder(this.orderForm).subscribe({
        next: (response) => {

          this.notificationService.success(response.message);
          this.close()
        },
        error: (error) => {
          this.notificationService.error(error.error);
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
