import { Routes } from '@angular/router';
import { IndexComponent } from './pages/public/index/index.component';
import { MyComponentComponent } from './pages/public/my-component/my-component.component';
import { LoginComponent } from './pages/public/login/login.component';
import { UploadInvoiceComponent } from './pages/public/upload-invoice/upload-invoice.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'hello', component: MyComponentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'subir-boleta', component: UploadInvoiceComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
