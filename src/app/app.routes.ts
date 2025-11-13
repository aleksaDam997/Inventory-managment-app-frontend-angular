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
        { path: 'companies-managment', component: CompaniesManagment, canActivate: [RoleGuard], data: { roles: ['ADMIN'], animation: 'CompaniesManagment', icon: 'bi bi-buildings', title: 'Pravna lica' } },
        { path: 'organization-units-managment', component: OrganizationUnitsManagment, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'EDITOR'], animation: 'OrganizationUnitsManagment', icon: 'bi bi-diagram-3', title: 'Organizacione jedinice' } },
        { path: 'user-managment', component: UserManagment, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'EDITOR'], animation: 'UserManagment', icon: 'bi bi-person-gear', title: 'Korisnici' } },
        { path: 'price-list', component: PriceList, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'EDITOR', 'USER'], animation: 'PriceList', icon: 'bi bi-tag', title: 'Katalog artikala' } },
        { path: 'order-managment', component: OrderUser, canActivate: [RoleGuard], data: { roles: ['USER'], animation: 'OrderManagment', icon: 'bi bi-box-seam', title: 'Narudžbe' } },
        { path: 'inventory-managment', component: InventoryManagment, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'EDITOR'], animation: 'InventoryManagment', icon: 'bi bi-box-seam', title: 'Narudžbe' } },
        { path: 'graphs', component: Graphs, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'EDITOR', 'USER'], animation: 'Graphs', icon: 'bi bi-bar-chart-line', title: 'Izvještaji' } },
        { path: '', redirectTo: 'user-managment', pathMatch: 'full' }
    ]}



];
