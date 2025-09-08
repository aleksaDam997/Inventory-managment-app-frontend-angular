import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { Company, OrderStatus, OrgUnit, Product } from '../../../models/models';
import { CreateApiResponse, OrderResponse } from '../../../models/response.models';
import { OrgUnitsManagmentService } from '../../../services/org_units.managment.service';
import saveAs from 'file-saver';
import { Subject, takeUntil } from 'rxjs';
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

@Component({
  selector: 'app-order-user',
  imports: [CommonModule, ReactiveFormsModule, ModalModule, BsDatepickerModule],
  templateUrl: './order-user.html',
  styleUrl: './order-user.css'
})
export class OrderUser {

  
  modalRef?: BsModalRef<OrderUserModal>;

  @ViewChild('ordersTable', { static: false }) ordersTable!: ElementRef;

  isCreateUserModal = false;

  orgUnits: OrgUnit[] = [];
  products: Product[] = [];
  companies: Company[] = [];
  

  orderFilterForm: FormGroup;
  orderForm: FormGroup;

  orders: OrderResponse[] = [];

  role: UserRole;
  bsConfig: any;

  OrderStatus = OrderStatus;

  orderStatuses: OrderStatus[] = [];

  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private orgUnitsService: OrgUnitsManagmentService,
    private productManagmentService: ProductService, private orderService: OrderService,  private companyManagmentService: CompanyManagmentService,
    private modalService: BsModalService, private fb: FormBuilder) {

    this.role = this.authService.getUserRole() as UserRole;

    this.bsConfig = InitConfig.initDatePickerConfig();
    this.orderFilterForm = InitForms.initializeOrderFilterForm();

    this.orderForm = new FormGroup({
      orgUnitId: new FormControl(0),
      productId: new FormControl(0),
      quantity: new FormControl(1),
    });

    this.orgUnits = [];

    this.orderStatuses = this.orderService.getOrderStatuses();
  }

  ngOnInit() {

    this.orgUnitsService.getAllOrgUnits()
    .pipe(takeUntil(this.destroy$))
    .subscribe(orgUnits => {
      this.orgUnits = orgUnits;
    });

    this.companyManagmentService.getAllCompanies()
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (companies) => {
          this.companies = companies;
        },
        error: (error) => {
          console.error('Error fetching companies:', error);
        }
    });

    this.productManagmentService.getAllProducts().pipe(takeUntil(this.destroy$)).subscribe(products => {
      this.products = products;
    });



    this.orderService.getOrdersByCriteria(this.orderFilterForm).subscribe(orders => {
      this.orders = orders;
      console.log(orders)
    });
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
        orgUnits: this.orgUnits,
        products: this.products,
        orderForm: this.orderForm,
        role: this.role
      },
      ignoreBackdropClick: true, // 🚫 ne zatvara se klikom na pozadinu
      keyboard: false            // 🚫 ne zatvara se na Escape
    });
  }

  openUpdateOrderModal(order: OrderResponse) {

    // this.orderForm.patchValue(order);

    //   this.modalRef = this.modalService.show(ImUpsertModal, {
    //     class: 'modal-dialog modal-xl modal-fullscreen-md-down modal-dialog-centered',
    //     initialState: {
    //       isCreate: true,
    //       orgUnits: this.orgUnits,
    //       products: this.products,
    //       orderForm: this.orderForm,
    //       role: this.role
    //     },
    //     ignoreBackdropClick: true, // 🚫 ne zatvara se klikom na pozadinu
    //     keyboard: false            // 🚫 ne zatvara se na Escape
    // });
  } 

  deleteOrder(orderId: number) {
    // this.orderService.deleteOrder(orderId).subscribe(() => {
    //   this.orders = this.orders.filter(order => order.orderId !== orderId);
    // });
  }

  statusTranslate(status: OrderStatus): string {
    switch (status) {
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
    const orderFilterReq: OrderFilterRequest = {
      startDate: this.orderFilterForm.get('startDate')?.value,
      endDate: this.orderFilterForm.get('endDate')?.value,
      status: this.orderFilterForm.get('status')?.value,
      companyId: this.orderFilterForm.get('companyId')?.value,
      orgUnitId: this.orderFilterForm.get('orgUnitId')?.value
    }

    this.orderService.getOrdersByCriteria(this.orderFilterForm).subscribe(orders => {
      this.orders = orders;
    });
  }

   getCompanyName(companyId: number): string {
    const company = this.companies.find(c => c.companyId === companyId);
    return company ? company.name : 'Nema firme';
  }

  getOrgUnitName(companyId: number, orgUnitId: number): string {
    const company = this.companies.find(c => c.companyId === companyId);
    const orgUnit = company?.orgUnits.find(ou => ou.orgUnitId === orgUnitId);
    return orgUnit ? orgUnit.name : 'Nema filijale';
  }

  getOrgUnitsByCompanyId(companyId: number) {

    const company = this.companies.find(c => +c.companyId === +companyId);
    return company ? company.orgUnits : [];
  }

}
