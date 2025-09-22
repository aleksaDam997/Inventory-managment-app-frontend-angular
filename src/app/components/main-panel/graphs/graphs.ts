import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-graphs',
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './graphs.html',
  styleUrl: './graphs.css'
})
export class Graphs {

    last12m = [
    { m: "Oct", v: 41000 },
    { m: "Nov", v: 38000 },
    { m: "Dec", v: 52000 },
    { m: "Jan", v: 45000 },
    { m: "Feb", v: 47000 },
    { m: "Mar", v: 49000 },
    { m: "Apr", v: 43000 },
    { m: "May", v: 51000 },
    { m: "Jun", v: 54000 },
    { m: "Jul", v: 56000 },
    { m: "Aug", v: 48000 },
    { m: "Sep", v: 60000 },
  ];

  spendMonth = [
    { label: "Prošli mjesec", value: 54890 },
    { label: "Tekući (MTD)", value: 42230 },
  ];

  topCenters = [
    { name: "Prodaja", km: 18500 },
    { name: "IT", km: 16200 },
    { name: "Marketing", km: 14100 },
    { name: "Operacije", km: 11900 },
    { name: "Logistika", km: 10100 },
  ];

  topProductsLast = [
    { name: "Papir A4", km: 5200 },
    { name: "Toner HP 205A", km: 4100 },
    { name: "HDD 1TB", km: 3800 },
    { name: "Koverte C4", km: 2900 },
    { name: "USB 32GB", km: 2500 },
  ];

  topProductsNow = [
    { name: "Papir A4", km: 3100 },
    { name: "Toner HP 205A", km: 2900 },
    { name: "Miš Logitech", km: 2400 },
    { name: "USB 64GB", km: 2100 },
    { name: "Marker set", km: 1800 },
  ];

  // --- Chart.js configs ---
  spendMonthChart: ChartConfiguration<'bar'>['data'] = {
    labels: this.spendMonth.map(d => d.label),
    datasets: [{ data: this.spendMonth.map(d => d.value), label: 'Iznos (KM)' }]
  };

  last12mChart: ChartConfiguration<'line'>['data'] = {
    labels: this.last12m.map(d => d.m),
    datasets: [{ data: this.last12m.map(d => d.v), label: 'Iznos (KM)' }]
  };

  topCentersChart: ChartConfiguration<'bar'>['data'] = {
    labels: this.topCenters.map(d => d.name),
    datasets: [{ data: this.topCenters.map(d => d.km), label: 'Iznos (KM)' }]
  };

  topProductsLastChart: ChartConfiguration<'bar'>['data'] = {
    labels: this.topProductsLast.map(d => d.name),
    datasets: [{ data: this.topProductsLast.map(d => d.km), label: 'Iznos (KM)' }]
  };

  topProductsNowChart: ChartConfiguration<'bar'>['data'] = {
    labels: this.topProductsNow.map(d => d.name),
    datasets: [{ data: this.topProductsNow.map(d => d.km), label: 'Iznos (KM)' }]
  };
}
