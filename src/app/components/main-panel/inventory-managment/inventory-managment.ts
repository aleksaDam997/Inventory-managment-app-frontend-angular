import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  OrderStatus, OrgUnit, Product } from '../../../models/models';
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
import { OrderResponse } from '../../../models/response.models';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-inventory-managment',
  imports: [CommonModule, ReactiveFormsModule, BsDatepickerModule, ModalModule],
  templateUrl: './inventory-managment.html',
  styleUrl: './inventory-managment.css'
})
export class InventoryManagment implements OnInit {

  modalRef?: BsModalRef;

  @ViewChild('ordersTable', { static: false }) ordersTable!: ElementRef;

  isCreateUserModal = false;

  orgUnits: OrgUnit[] = [];
  products: Product[] = [];
  

  orderFilterForm: FormGroup;
  orderForm: FormGroup;

  orders: OrderResponse[] = [];

  role: UserRole;
  bsConfig: any;

  OrderStatus = OrderStatus;

  constructor(private authService: AuthService, private orgUnitsService: OrgUnitsManagmentService,
    private productManagmentService: ProductService, private orderService: OrderService, 
    private modalService: BsModalService, private fb: FormBuilder) {

    this.role = this.authService.getUserRole() as UserRole;

    this.bsConfig = {
      containerClass: 'theme-blue', // default je 'theme-green'
      dateInputFormat: 'DD.MM.YYYY',
      // minDate: new Date(2025, 0, 1), 
      // maxDate: new Date(2025, 11, 31),
      // showWeekNumbers: true, 
      // isAnimated: true,
      // adaptivePosition: true, 
      // showTodayButton: true,  
      // showClearButton: true,
      // customClasses: [
      //   { date: new Date(2025, 7, 15), classes: ['bg-danger', 'text-white'] }
      // ],
      // isDisabled: false,
      // selectWeek: false
    };

    const startDate: Date = new Date();
    startDate.setDate(1)
    startDate.setSeconds(0)
    startDate.setMinutes(0)
    startDate.setHours(0)

     this.orderFilterForm = this.fb.group({
      startDate: [startDate],
      endDate: [new Date()],
      status: [''],
      companyId: [0],
      orgUnitId: [0]
    });

    this.orderForm = new FormGroup({
      orgUnitId: new FormControl(0),
      productId: new FormControl(0),
      quantity: new FormControl(1),

    });

    this.orgUnits = [];
  }

  ngOnInit() {
    this.orgUnitsService.getAllOrgUnits().subscribe(orgUnits => {
      this.orgUnits = orgUnits;
    });

    this.productManagmentService.getAllProducts().subscribe(products => {
      this.products = products;
    });

    const orderFilterReq: OrderFilterRequest = {
      startDate: this.orderFilterForm.get('startDate')?.value,
      endDate: this.orderFilterForm.get('endDate')?.value,
      status: this.orderFilterForm.get('status')?.value,
      companyId: this.orderFilterForm.get('companyId')?.value,
      orgUnitId: this.orderFilterForm.get('orgUnitId')?.value
    }

    this.orderService.getOrdersByCriteria(orderFilterReq).subscribe(orders => {
      this.orders = orders;
      console.log(orders)
    });
  }


  openCreateOrderModal() {

    this.modalRef = this.modalService.show(ImUpsertModal, {
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
    // Logic to open the update order modal
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

    this.orderService.getOrdersByCriteria(orderFilterReq).subscribe(orders => {
      this.orders = orders;
    });
  }

  downloadExcel() {
    
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.ordersTable.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'moja-tabela.xlsx');
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
}

