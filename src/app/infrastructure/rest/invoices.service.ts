import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApproveRejectInvoiceDto } from '../../pages/private/invoices/dto/approve-reject-invoice.dto';
import { UploadInvoiceDto } from '../../pages/private/invoices/dto/upload-invoice.dto';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private url = environment.tyneUrl;

  constructor(private http: HttpClient) {}

  public getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/invoices?status=0`);
  }

  public approveRejectInvoice(
    approveRejectInvoiceDto: ApproveRejectInvoiceDto[]
  ): Observable<any[]> {
    return this.http.post<any>(
      `${this.url}/invoices/approve-reject`,
      approveRejectInvoiceDto
    );
  }

  public uploadInvoice(invoice: UploadInvoiceDto): Observable<any[]> {
    return this.http.post<any>(`${this.url}/invoices/upload`, invoice);
  }
}
