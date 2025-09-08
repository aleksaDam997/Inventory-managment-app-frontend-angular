import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { OrgUnit, Product } from '../../../../models/models';
import { CreateOrderRequest } from '../../../../models/request.model';
import { UserRole } from '../../../../models/user.model';
import { OrderService } from '../../../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-user-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-user-modal.html',
  styleUrl: './order-user-modal.css'
})
export class OrderUserModal {

  @Input() orderForm!: FormGroup<{
  productId: FormControl<number>;
  quantity: FormControl<number>;
  }>;

  @Input() orgUnits: OrgUnit[] = [];

  @Input() products: Product[] = [];

  @Input()
  isCreate: boolean = true;

  @Input()
  title: string = "Dodaj porudžbinu";

  @Input() role!: UserRole;

  submitted = false;

  constructor(public bsModalRef: BsModalRef, private orderService: OrderService) {}

  close() {
    this.bsModalRef.hide();
  }

  onSubmit() {

    const orderData: CreateOrderRequest = {
      orderId: undefined,
      productId: +this.orderForm.get('productId')!.value,
      quantity: +this.orderForm.get('quantity')!.value,
      status: undefined
    };


    if (this.isCreate) {
      this.orderService.makeOrder(orderData).subscribe({
        next: (response) => {
          this.close();
        },
        error: (error) => {
          console.error('Error creating order:', error);
        }
      });
    } else {
      this.orderService.updateOrder(orderData).subscribe({
        next: (response) => {
          this.close();
        },
        error: (error) => {
          console.error('Error updating order:', error);
        }
      });
    }
  
    this.orderForm.reset();
  }
}
