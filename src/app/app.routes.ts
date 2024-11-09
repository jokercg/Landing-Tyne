import { Routes } from '@angular/router';
import { IndexComponent } from './pages/public/index/index.component';
import { LoginComponent } from './pages/public/login/login.component';
import { UploadInvoiceComponent } from './pages/public/upload-invoice/upload-invoice.component';
import { InvoicesComponent } from './pages/private/invoices/invoices.component';
import { TyneRoutes } from './infrastructure/enums/tyne-routes.enum';
import { AdminstratorGuard } from './shared/guards/administrator.guard';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: TyneRoutes.Login, component: LoginComponent },
  { path: TyneRoutes.UploadInvoice, component: UploadInvoiceComponent },
  { path: TyneRoutes.Invoice, component: InvoicesComponent, canActivate: [AdminstratorGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
