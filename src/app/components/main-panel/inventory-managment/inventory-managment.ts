import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  Company, Order, OrderProduct, OrderStatus, OrgUnit, Product } from '../../../models/models';
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
import * as ExcelJS from 'exceljs';

import { saveAs } from 'file-saver';
import { CompanyManagmentService } from '../../../services/company.managment.service';
import { Subject, take, takeUntil } from 'rxjs';
import { InitConfig } from '../../../init/init.config';
import { InitForms } from '../../../init/init.forms';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmDialogBox } from '../../pop-up/confirm-dialog-box/confirm-dialog-box';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inventory-managment',
  imports: [CommonModule, ReactiveFormsModule, BsDatepickerModule, ModalModule],
  templateUrl: './inventory-managment.html',
  styleUrl: './inventory-managment.css'
})
export class InventoryManagment implements OnInit, OnDestroy {

  modalRef?: BsModalRef<ImUpsertModal>;
  modalRefConfirm?: BsModalRef<ConfirmDialogBox>;

  @ViewChild('ordersTable', { static: false }) ordersTable!: ElementRef;

  isCreateUserModal = false;
  highlightedRowId: number | null = null;

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
    private modalService: BsModalService, private notifyService: NotificationService, private route: ActivatedRoute) {

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

    this.productManagmentService.getAllProducts().pipe(takeUntil(this.destroy$)).subscribe(products => {
      this.products = products;
    });

    this.route.queryParams.subscribe(params => {
      const highlightId = params['highlight'] ? +params['highlight'] : null;

      if (highlightId) {
        setTimeout(() => {
          const element = document.getElementById(`row-${highlightId}`);
          if (element) {

            if (element.classList.contains('highlight-green') || element.classList.contains('highlight-warning')) {

            } else {
              const order = this.orders.find(o => o.orderId === highlightId);
              if (!order) return;

              if (order.status === OrderStatus.APPROVED) {
                element.classList.add('highlight-green');
              } else {
                element.classList.add('highlight-warning');
              }

              element.scrollIntoView({ behavior: 'smooth', block: 'center' });

              setTimeout(() => {
                element.classList.remove('highlight-green', 'highlight-warning');
              }, 3000);
            }
          }
        }, 50);
      }
    });


    this.orderService.getOrdersByCriteria(this.orderFilterForm).subscribe({
        next: (orders) => {
          this.orders = orders.data!;

        
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

  forwardStatus(orderId: number): void {


    const modalRefConfirm: BsModalRef = this.modalService.show(ConfirmDialogBox, {
      initialState: {
        title: 'Promjena statusa',
        message: 'Da li ste sigurni da želite promijeniti status?',
        onConfirm: () => {
          this.orderService.forwardEditorOrderStatus(orderId).pipe(take(1)).subscribe({
            next: (response) => {
              this.notifyService.success(response.message);
              this.onFilterSubmit();
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
          this.notifyService.info('Promjena statusa otkazana');
        } 
      },
        ignoreBackdropClick: true,
        keyboard: false 
    });


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



async downloadExcel() {
  
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sheet1');

  sheet.mergeCells('A1:I1');
  const title = sheet.getCell('A1');
  title.value = 'Narudžbe';
  title.font = { bold: true, size: 16 };
  title.alignment = { horizontal: 'center', vertical: 'middle' };

  // 2) Header red (red 2) - porudžbine
  const headerRow = sheet.addRow([
    'ID', 'Ime i prezime', 'Cijena', 'Status', 'Datum kreiranja', 'Datum izmjene'
  ]);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.mergeCells('A3:B3');
  sheet.mergeCells('C3:D3');
  sheet.mergeCells('E3:F3');

  sheet.getCell('A3').value = 'Proizvod';
  sheet.getCell('C3').value = 'Cijena';
  sheet.getCell('E3').value = 'Količina';

  ['A3','C3','E3'].forEach(key => {
    sheet.getCell(key).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(key).font = { bold: true };
  });

  this.orders.forEach((order: OrderResponse) => {
  sheet.addRow([order.orderId, order.user?.label, order.totalPrice, order.status, order.createdAt, order.updatedAt]);

  order.products
    .forEach((prod: OrderProduct) => {
      const row = sheet.addRow([`${prod.name}`, '', prod.quantity, '', prod.currentPrice, '']);

      const rowNumber = row.number;

      sheet.mergeCells(`A${rowNumber}:B${rowNumber}`);
      sheet.mergeCells(`C${rowNumber}:D${rowNumber}`);
      sheet.mergeCells(`E${rowNumber}:F${rowNumber}`);

      sheet.getCell(`A${rowNumber}`).value = prod.name;
      sheet.getCell(`C${rowNumber}`).value = prod.currentPrice;
      sheet.getCell(`E${rowNumber}`).value = prod.quantity;

      ['A','C','E'].forEach(col => {
        sheet.getCell(`${col}${rowNumber}`).alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });
});


  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
  });

  const totalColumns = sheet.getRow(2).cellCount; // sada = 6
  for (let i = 1; i <= totalColumns; i++) {
    const column = sheet.getColumn(i);
    let maxLength = 10;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const value = cell.value ? cell.value.toString() : '';
      maxLength = Math.max(maxLength, value.length);
    });
    column.width = maxLength + 2;
  }

  const buf = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buf]), 'moja-tabela.xlsx');
}





  printTable() {
  const orders = this.orders || [];

  const popupWin = window.open('', '_blank', 'width=1000,height=800');
  if (!popupWin) return;

  // HTML redovi
  let tableRows = '';
  for (const order of orders) {
    const totalPrice = Number(order.totalPrice ?? 0).toFixed(2);

    // Red porudžbine
    tableRows += `
      <tr style="background-color: #e9f5ff;">
        <th>${order.orderId}</th>
        <td>${order.user?.label ?? ''}</td>
        <td>${totalPrice}</td>
        <td>
          <span class="badge ${
            order.status === 'PENDING' ? 'bg-warning' :
            order.status === 'CHANGED' ? 'bg-primary' :
            order.status === 'APPROVED' ? 'bg-info' : 'bg-success'
          }">
            ${this.statusTranslate(order.status)}
          </span>
        </td>
        <td>${order.createdAt}</td>
        <td>${order.updatedAt}</td>
      </tr>
    `;

    // Redovi proizvoda
    for (const prod of order.products || []) {
      const price = Number(prod.currentPrice ?? 0).toFixed(2);
      const quantity = Number(prod.quantity ?? 0);
      tableRows += `
        <tr class="product-row" style="background-color: #f7fbff;">
          <td colspan="2" style="padding-left: 30px; font-style: italic;">${prod.name}</td>
          <td>${price}</td>
          <td colspan="3">${quantity}</td>
        </tr>
      `;
    }
  }

  // Popup HTML
  popupWin.document.write(`
    <html>
      <head>
        <title>Lista Porudžbina</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #333; }
          h1 { text-align: center; font-weight: bold; margin-bottom: 20px; font-size: 24px; color: #0d6efd; }
          table { border-collapse: collapse; width: 100%; font-size: 14px; }
          th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; vertical-align: middle; }
          th { background-color: #dbeafe; font-weight: bold; text-transform: uppercase; }
          tr:nth-child(even) { background-color: #f1f5f9; }
          .product-row td { padding-left: 30px; font-style: italic; background-color: #f7fbff; }
          .badge { font-size: 0.85em; }
          th:last-child, td:last-child { display: none !important; }
        </style>
      </head>
      <body onload="window.print(); window.close()">
        <h1>Lista Porudžbina</h1>
        <table class="table table-borderless text-center">
          <thead>
            <tr>
              <th>Id</th>
              <th>Korisnik</th>
              <th>Cijena</th>
              <th>Status</th>
              <th>Datum kreiranja</th>
              <th>Datum promjene</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `);

  popupWin.document.close();
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

