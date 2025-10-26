import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { Company, Order, OrderStatus, OrgUnit, Product } from '../../../models/models';
import { Subject, take, takeUntil } from 'rxjs';
import { InitConfig } from '../../../init/init.config';
import { InitForms } from '../../../init/init.forms';
import { OrderFilterRequest } from '../../../models/request.model';
import { UserRole } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { CompanyManagmentService } from '../../../services/company.managment.service';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OrderUserModal } from './order-user-modal/order-user-modal';
import { CreateApiResponse, OrderResponse } from '../../../models/response.models';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmDialogBox } from '../../pop-up/confirm-dialog-box/confirm-dialog-box';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-user',
  imports: [CommonModule, ReactiveFormsModule, ModalModule, BsDatepickerModule],
  templateUrl: './order-user.html',
  styleUrl: './order-user.css'
})
export class OrderUser {
  
  modalRef?: BsModalRef<OrderUserModal>;
  modalRefConfirm?: BsModalRef<ConfirmDialogBox>;

  @ViewChild('ordersTable', { static: false }) ordersTable!: ElementRef;

  isCreateUserModal = false;

  products: Product[] = [];

  orderFilterForm: FormGroup;

  orderForm: FormGroup;

  orders: OrderResponse[] = [];

  role: UserRole;
  bsConfig: any;

  highlightedRowId: number | null = null;

  OrderStatus = OrderStatus;

  orderStatuses: OrderStatus[] = [];

  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private productManagmentService: ProductService, 
    private orderService: OrderService,  private companyManagmentService: CompanyManagmentService,
    private modalService: BsModalService, private notificationService: NotificationService, private route: ActivatedRoute) {

    this.role = this.authService.getUserRole() as UserRole;

    this.bsConfig = InitConfig.initDatePickerConfig();
    this.orderFilterForm = InitForms.initializeOrderFilterForm();

    this.orderForm = new FormGroup({
      orderId: new FormControl(Number(0)),
      status: new FormControl(''),
      productId: new FormControl(Number(0)),
      quantity: new FormControl(Number(1)),
      orderProducts: new FormArray([])
    });


    this.orderStatuses = this.orderService.getOrderStatuses();
  }

  ngOnInit() {

    this.productManagmentService.getAllProducts().pipe(takeUntil(this.destroy$)).subscribe(products => {
      this.products = products;
    });

        this.route.queryParams.subscribe(params => {
      const highlightId = params['highlight'] ? +params['highlight'] : null;

      if (highlightId) {
        setTimeout(() => {
          const element = document.getElementById(`row-${highlightId}`);
          if (element) {

            if (element.classList.contains('highlight-success') || element.classList.contains('highlight-primary')) {

            } else {
              const order = this.orders.find(o => o.orderId === highlightId);
              if (!order) return;

              if (order.status === OrderStatus.APPROVED) {
                element.classList.add('highlight-primary');
              } else {
                element.classList.add('highlight-success');
              }

              element.scrollIntoView({ behavior: 'smooth', block: 'center' });

              setTimeout(() => {
                element.classList.remove('highlight-primary', 'highlight-success');
              }, 3000);
            }
          }
        }, 50);
      }
    });


    this.onFilterSubmit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  openCreateOrderModal() {

    this.modalRef = this.modalService.show(OrderUserModal, {
      class: 'modal-dialog modal-xl modal-fullscreen-md-down modal-dialog-centered',
      initialState: {
        isCreate: true,
        products: this.products,
        orderForm: this.orderForm,
        role: this.role
      },
      ignoreBackdropClick: true, // 🚫 ne zatvara se klikom na pozadinu
      keyboard: false            // 🚫 ne zatvara se na Escape
    });

    this.modalRef.onHidden!.pipe(take(1)).subscribe(() => {
      this.onFilterSubmit();
    });
  }

  openUpdateOrderModal(order: OrderResponse) {

    this.setOrder(order)

    this.modalRef = this.modalService.show(OrderUserModal, {
      class: 'modal-dialog modal-xl modal-fullscreen-md-down modal-dialog-centered',
      initialState: {
        isCreate: false,
        products: this.products,
        orderForm: this.orderForm,
        role: this.role
      },
      ignoreBackdropClick: true, // 🚫 ne zatvara se klikom na pozadinu
      keyboard: false            // 🚫 ne zatvara se na Escape
    });

    this.modalRef.onHidden!.pipe(take(1)).subscribe(() => {
      this.onFilterSubmit();
    });
  } 

  forwardStatus(orderId: number): void {


    const modalRefConfirm: BsModalRef = this.modalService.show(ConfirmDialogBox, {
      initialState: {
        title: 'Promjena statusa',
        message: 'Da li ste sigurni da želite promijeniti status?',
        onConfirm: () => {
          this.orderService.forwardUserOrderStatus(orderId).pipe(take(1)).subscribe({
            next: (response) => {
              this.notificationService.success(response.message);
              this.onFilterSubmit();
            },
            error: (error) => {
              if (error.error && error.error.error) {
                this.notificationService.error(error.error.error);
              } 
              else if (typeof error.error === 'string') {
                this.notificationService.error(error.error);
              } 
              else {
                this.notificationService.error(error);
              }
            }
          });
        },
        onCancel: () => {
          this.notificationService.info('Promjena statusa otkazana');
        } 
      },
        ignoreBackdropClick: true,
        keyboard: false 
    });


  }

  createOrderProductForm(product: any): FormGroup {
    return new FormGroup({
      orderProductId: new FormControl(product.orderProductId ?? 0),
      productId: new FormControl(product.productId),
      quantity: new FormControl(product.quantity),
      currentPrice: new FormControl(product.currentPrice)
    });
  }

  setOrder(order: any) {

    this.orderForm.patchValue({
      orderId: +order.orderId,
      status: order.status,
      productId: 0,
      quantity: 1
    });
    

    (this.orderForm.get('orderProducts') as FormArray).clear();

    order.products.forEach((prod: any) => {
      (this.orderForm.get('orderProducts') as FormArray).push(
        this.createOrderProductForm(prod)
      );
    });
  }



  deleteOrder(orderId: number) {
    
    this.orderService.deleteOrder(orderId).subscribe({
        next: (response: CreateApiResponse<Order>) => {

          this.onFilterSubmit();
        },
        error: (error) => {
          if (error.error && error.error.error) {
            this.notificationService.error(error.error.error);
          } 
          else if (typeof error.error === 'string') {
            this.notificationService.error(error.error);
          } 
          else {
            this.notificationService.error(error);
          }
        }
      });
  }

  statusTranslate(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.IN_PROGRESS:
        return "U izradi";
      case OrderStatus.PENDING:
        return 'Na čekanju';
      case OrderStatus.CHANGED:
        return 'IZMJENJEN';
      case OrderStatus.APPROVED:
        return 'ODOBRENO';
      case OrderStatus.COMPLETED:
        return 'ZAVRŠENO';
      default:
        return 'NEPOZNATA';
    }
  }


  onFilterSubmit() {
    this.orderService.getUserOrders(this.orderFilterForm.value).pipe(takeUntil(this.destroy$)).subscribe({
    next: (orders) => {
      this.orders = orders.data!;
    },
    error: (error) => {
      if (error.error && error.error.error) {
        this.notificationService.error(error.error.error);
      } 
      else if (typeof error.error === 'string') {
        this.notificationService.error(error.error);
      } 
      else {
        this.notificationService.error(error);
      }
    }
    });
  }
}
