import { Routes } from '@angular/router';
import { InventoryManagment } from './components/main-panel/inventory-managment/inventory-managment';
import { Graphs } from './components/main-panel/graphs/graphs';
import { MainPanel } from './components/main-panel/main-panel';
import { LoginPage } from './components/login-page/login-page';
import { RoleGuard } from './middlwares/role.guard.middlware';
import { UserManagment } from './components/main-panel/user-managment/user-managment';
import { CompaniesManagment } from './components/main-panel/companies-managment/companies-managment';
import { OrganizationUnitsManagment } from './components/main-panel/organization-units-managment/organization-units-managment';
import { PriceList } from './components/main-panel/price-list/price-list';
import { OrderUser } from './components/main-panel/order-user/order-user';
import { animation } from '@angular/animations';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    // { path: 'news', loadComponent: () => import("./components/news/news.component").then((news) => news.NewsComponent) },
    { path: 'login',  component: LoginPage},
    { path: 'app', component: MainPanel, children: [
        { path: 'user-managment', component: UserManagment, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'EDITOR'], animation: 'UserManagment' } },
        { path: 'companies-managment', component: CompaniesManagment, canActivate: [RoleGuard], data: { roles: ['ADMIN'], animation: 'CompaniesManagment' } },
        { path: 'organization-units-managment', component: OrganizationUnitsManagment, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'EDITOR'], animation: 'OrganizationUnitsManagment' } },
        { path: 'price-list', component: PriceList, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'EDITOR'], animation: 'PriceList' } },
        { path: 'order-managment', component: OrderUser, canActivate: [RoleGuard], data: { roles: ['USER'], animation: 'OrderManagment' } },
        { path: 'inventory-managment', component: InventoryManagment, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'EDITOR'], animation: 'InventoryManagment' } },
        { path: 'graphs', component: Graphs, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'EDITOR', 'USER'], animation: 'Graphs' } },
        { path: '', redirectTo: 'user-managment', pathMatch: 'full' }
    ]}



];
