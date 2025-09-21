import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  Company, OrderStatus, OrgUnit, Product } from '../../../models/models';
import { CommonModule, JsonPipe } from '@angular/common';
import { UserRole } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OrgUnitsManagmentService } from '../../../services/org_units.managment.service';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ImUpsertModal } from './im-upsert-modal/im-upsert-modal';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { OrderFilterRequest } from '../../../models/request.model';
import { CreateApiResponse, OrderResponse } from '../../../models/response.models';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CompanyManagmentService } from '../../../services/company.managment.service';
import { Subject, take, takeUntil } from 'rxjs';
import { InitConfig } from '../../../init/init.config';
import { InitForms } from '../../../init/init.forms';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-inventory-managment',
  imports: [CommonModule, ReactiveFormsModule, BsDatepickerModule, ModalModule],
  templateUrl: './inventory-managment.html',
  styleUrl: './inventory-managment.css'
})
export class InventoryManagment implements OnInit, OnDestroy {

  modalRef?: BsModalRef<ImUpsertModal>;

  @ViewChild('ordersTable', { static: false }) ordersTable!: ElementRef;

  isCreateUserModal = false;

  orgUnits: OrgUnit[] = [];
  products: Product[] = [];
  companies: Company[] = [];
  

  orderFilterForm: FormGroup;
  orderForm: FormGroup;

  orders: OrderResponse[] = [];

  role: UserRole;
  bsConfig: Partial<BsDatepickerModule>;

  OrderStatus = OrderStatus;

  orderStatuses: OrderStatus[] = [];

  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private orgUnitsService: OrgUnitsManagmentService,
    private productManagmentService: ProductService, private orderService: OrderService,  private companyManagmentService: CompanyManagmentService,
    private modalService: BsModalService, private notifyService: NotificationService) {

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



    this.orderService.getOrdersByCriteria(this.orderFilterForm).subscribe({
        next: (orders) => {
          this.orders = orders.data!;

          console.log(this.orders)
          this.notifyService.success("Sve cool :)")
        },
        error: (error) => {
          console.log(error.message)
          this.notifyService.error(error);
        }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  openCreateOrderModal() {

    this.modalRef = this.modalService.show(ImUpsertModal, {
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
  }

  openUpdateOrderModal(order: OrderResponse) {

    this.setOrder(order)

    this.modalRef = this.modalService.show(ImUpsertModal, {
      class: 'modal-dialog modal-xl modal-fullscreen-md-down modal-dialog-centered',
      initialState: {
        isCreate: false,
        products: this.products,
        orderForm: this.orderForm,
        role: this.role
      },
      ignoreBackdropClick: true,
      keyboard: false
    });

    this.modalRef.onHidden!.pipe(take(1)).subscribe(() => {
      this.onFilterSubmit();
    });
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
      this.orders = orders.data!;
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

  downloadExcel() {
    
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.ordersTable.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const fileName = 'moja-tabela.xlsx';
    saveAs(blob, fileName);
    
    const excelLink = `ms-excel:ofe|u|file:///C:/Users/Korisnik/Downloads/${fileName}`;
    window.location.href = excelLink;
  }

  printTable() {
    const printContents = this.ordersTable.nativeElement.outerHTML;

    const popupWin = window.open('', '_blank', 'width=800,height=600');

    popupWin?.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
          </style>
        </head>
        <body onload="window.print(); window.close()">
          ${printContents}
        </body>
      </html>
    `);

    popupWin?.document.close();
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
}

