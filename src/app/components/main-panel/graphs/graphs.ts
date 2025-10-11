import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from '../../../services/auth.service';
import { ReportsService } from '../../../services/reports.service';
import { CreateApiResponse, Report, SpendByMonth } from '../../../models/response.models';
import { NotificationService } from '../../../services/notification.service';
import { Subject, takeUntil } from 'rxjs';
import { UserRole } from '../../../models/user.model';
import { CompanyManagmentService } from '../../../services/company.managment.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InitForms } from '../../../init/init.forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/models';

@Component({
  selector: 'app-graphs',
  imports: [BaseChartDirective, CommonModule, ReactiveFormsModule],
  templateUrl: './graphs.html',
  styleUrl: './graphs.css'
})
export class Graphs implements OnInit {

  role: UserRole;
  companies: any[] = [];
  products: Product[] = [];

  private destroy$ = new Subject<void>();

  reportFilterForm: FormGroup;

  last12m: SpendByMonth[] = [];
  
  last12mOrderSum: SpendByMonth[] = []

  spendMonth: SpendByMonth[] = [];

  topCenters: SpendByMonth[] = [];

  top5ProductsLastMonth: SpendByMonth[] = [];

  top5ProductsPreviousMonth: SpendByMonth[] = [];

  topProductsNow: SpendByMonth[] = [];

  last12mProductQuantity: SpendByMonth[] = [];

  last12mProductSum: SpendByMonth[] = [];

  constructor(private authService: AuthService, private companyManagmentService: CompanyManagmentService,
     private reportsService: ReportsService, private productsService: ProductService, private notify: NotificationService) { 
    this.role = this.authService.getUserRole() as UserRole;

    this.reportFilterForm = InitForms.initializeReportsFilterForm(this.role, this.authService.getCompanyId()!);  
  }

  ngOnInit(): void {

    this.companyManagmentService.getAllCompanies()
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (companies) => {
          this.companies = companies;
        },
        error: (error) => {
          console.error('Error fetching companies:', error);
        }
    });

    this.productsService.getAllProducts()
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (products) => { 
          this.products = products;
        },
        error: (error) => {
          this.notify.error(error);
        }
    });
    
    this.onSubmit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.reportsService.takeCurrentLastMonthReport(this.reportFilterForm).subscribe({
      next: (res: CreateApiResponse<Report>) => {
        const report = res.data;

        this.spendMonth = report ? report.spendByMonth : [];
        this.spendMonthChart = {
          labels: this.spendMonth.map(d => d.label),
          datasets: [{ data: this.spendMonth.map(d => d.value), label: 'Iznos (KM)' }]
        };

        this.last12m = report ? report.last12mOrderSum : [];

        this.last12mChart = {
          labels: this.last12m.map(d => d.label),
          datasets: [{ data: this.last12m.map(d => d.value), label: 'Iznos (KM)' }]
        };

        this.last12mProductSum = report ? report.last12mProductSum : [];

        this.last12mProductSumChart = {
          labels: this.last12mProductSum.map(d => d.label),
          datasets: [{ data: this.last12mProductSum.map(d => d.value), label: 'Iznos (KM)' }]
        };

        this.last12mProductQuantity = report ? report.last12mProductQuantity : [];

        this.last12mProductQuantityChart = {
          labels: this.last12mProductQuantity.map(d => d.label),
          datasets: [{ data: this.last12mProductQuantity.map(d => d.value), label: 'Količina' }]
        };

        this.topCenters = report ? report.top5OrgUnits : [];
        this.topCentersChart = {
          labels: this.topCenters.map(d => d.label),
          datasets: [{ data: this.topCenters.map(d => d.value), label: 'Iznos (KM)' }]
        };

        this.top5ProductsLastMonth = report ? report.top5ProductsLastMonth : [];

        this.top5ProductsLastMonthChart = {
          labels: this.top5ProductsLastMonth.map(d => d.label),
          datasets: [{ data: this.top5ProductsLastMonth.map(d => d.value), label: 'Iznos (KM)' }]
        };

        this.top5ProductsPreviousMonth = report ? report.top5ProductsPreviousMonth : [];

        this.top5ProductsPreviousMonthChart = {
          labels: this.top5ProductsPreviousMonth.map(d => d.label),
          datasets: [{ data: this.top5ProductsPreviousMonth.map(d => d.value), label: 'Iznos (KM)' }]
        };


        this.notify.success(res.message);
      },
      error: (err) => {
        

      if (err.error && err.error.error) {
        this.notify.error(err.error.error);
      } 
      else if (typeof err.error === 'string') {
        this.notify.error(err.error);
      } 
      else {
        this.notify.error(err);
      }
      }
    });
  }

  // --- Chart.js configs ---
  spendMonthChart: ChartConfiguration<'bar'>['data'] = {
    labels: this.spendMonth.map(d => d.label),
    datasets: [{ data: this.spendMonth.map(d => d.value), label: 'Iznos (KM)' }]
  };

  last12mChart: ChartConfiguration<'line'>['data'] = {
    labels: this.last12m.map(d => d.label),
    datasets: [{ data: this.last12m.map(d => d.value), label: 'Iznos (KM)' }]
  };

  last12mProductSumChart: ChartConfiguration<'line'>['data'] = {
    labels: this.last12mProductSum.map(d => d.label),
    datasets: [{ data: this.last12mProductSum.map(d => d.value), label: 'Iznos (KM)' }]
  };

  last12mProductQuantityChart: ChartConfiguration<'line'>['data'] = {
    labels: this.last12mProductQuantity.map(d => d.label),
    datasets: [{ data: this.last12mProductQuantity.map(d => d.value), label: 'Iznos (KM)' }]
  };

  topCentersChart: ChartConfiguration<'bar'>['data'] = {
    labels: this.topCenters.map(d => d.label),
    datasets: [{ data: this.topCenters.map(d => d.value), label: 'Iznos (KM)' }]
  };

  top5ProductsLastMonthChart: ChartConfiguration<'bar'>['data'] = {
    labels: this.top5ProductsLastMonth.map(d => d.label),
    datasets: [{ data: this.top5ProductsLastMonth.map(d => d.value), label: 'Iznos (KM)' }]
  };

  top5ProductsPreviousMonthChart: ChartConfiguration<'bar'>['data'] = {
    labels: this.top5ProductsPreviousMonth.map(d => d.label),
    datasets: [{ data: this.top5ProductsPreviousMonth.map(d => d.value), label: 'Iznos (KM)' }]
  };

  topProductsNowChart: ChartConfiguration<'bar'>['data'] = {
    labels: this.topProductsNow.map(d => d.label),
    datasets: [{ data: this.topProductsNow.map(d => d.value), label: 'Iznos (KM)' }]
  };

    getCompanyName(companyId: number): string {
    const company = this.companies.find(c => c.companyId === companyId);
    return company ? company.name : 'Nema firme';
  }

  getOrgUnitName(companyId: number, orgUnitId: number): string {
    const company = this.companies.find(c => c.companyId === companyId);
    const orgUnit = company?.orgUnits.find((ou: any) => ou.orgUnitId === orgUnitId);
    return orgUnit ? orgUnit.name : 'Nema filijale';
  }

  getOrgUnitsByCompanyId(companyId: number) {

    const company = this.companies.find(c => +c.companyId === +companyId);
    return company ? company.orgUnits : [];
  }
}
