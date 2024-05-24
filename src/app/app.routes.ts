import { Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DealComponent } from './deal/deal.component';
import { EditDealComponent } from './deal/edit-deal/edit-deal.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    { path: 'auth/login', component: LoginComponent },
    { path: 'deal/new', component: EditDealComponent, canActivate: [AuthGuard] },
    { path: 'deal/:id', component: EditDealComponent, canActivate: [AuthGuard] },
    { path: 'deal', component: DealComponent, canActivate: [AuthGuard] },
    { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
];
