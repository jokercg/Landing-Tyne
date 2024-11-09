import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from '../../../infrastructure/rest/invoices.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { InvoiceDto } from './dto/invoice.dto';
import { DialogModel } from '../../../shared/dialog/dialog-model';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { MatIconModule } from '@angular/material/icon';
import { InvoiceStatusEnum } from '../../../infrastructure/enums/invoice-status.enum';
import { ApproveRejectInvoiceDto } from './dto/approve-reject-invoice.dto';
import * as XLSX from 'xlsx';

@Component({
  standalone: true,
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSortModule, MatIconModule],
})
export class InvoicesComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  public displayedColumns: string[] = ['userName', 'userEmail', 'businessName', 'amount', 'invoiceNumber', 'invoiceStatus', 'createdAt', 'showInvoice', 'check'];
  public dataSource = new MatTableDataSource<InvoiceDto>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;
  public selectionInvoices: ApproveRejectInvoiceDto[] = [];
  public invoiceStatusEnum = InvoiceStatusEnum;

  constructor(private dialogService: DialogService) { }

  public ngOnInit() {
    this.getInvoices();
  }

  private getInvoices() {
    this.selectionInvoices = [];
    this.invoiceService.getAll().subscribe((x) => {
      const result: any = x;
      result.map((z: any) => {
        z.createdAt = this.dateToString(z.createdAt);
        z.amount = parseInt(z.amount);
      });
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.filterPredicate = (data: InvoiceDto, filter: string) => {
        return data.user.name.toLowerCase().includes(filter) ||
          data.user.email.toLowerCase().includes(filter) ||
          data.business.name.toLowerCase().includes(filter) ||
          data.amount.toString().toLowerCase().includes(filter) ||
          data.invoiceNumber.toLowerCase().includes(filter) ||
          data.invoiceStatus.name.toLowerCase().includes(filter) ||
          data.createdAt.toString().toLowerCase().includes(filter);
      };
      this.dataSource.sortingDataAccessor = (item: InvoiceDto, property: keyof InvoiceDto | string) => {
        switch (property) {
          case 'userName':
            return item.user.name; // string
          case 'userEmail':
            return item.user.email; // string
          case 'businessName':
            return item.business.name; // string
          case 'amount':
            return item.amount; // number
          case 'invoiceNumber':
            return item.invoiceNumber; // string
          case 'invoiceStatus':
            return item.invoiceStatus.name; // string
          case 'createdAt':
            return new Date(item.createdAt).getTime(); // number (timestamp)
          default:
            // Manejo por defecto para asegurar que se devuelve un valor válido
            return item[property as keyof InvoiceDto] as string | number;
        }
      };

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private dateToString(date: Date): string {
    const dateString = new Date(date).toLocaleString('es-ES', { timeZone: 'America/Santiago' });
    const a = dateString.split(',');
    return a[0];
  }

  public showInvoice(urlInvoice: string) {
    window.open(urlInvoice, "_blank");
  }

  public changeCheckBox(invoice: InvoiceDto) {
    const index = this.selectionInvoices.findIndex(x => x.invoiceId === invoice.id);
    if (index > -1) {
      this.selectionInvoices.splice(index, 1); // Elimina la factura si ya está seleccionada
    } else {
      if (invoice.invoiceStatus.id === this.invoiceStatusEnum.Pending) {
        this.selectionInvoices.push({ invoiceId: invoice.id, invoiceStatus: null }); // Agrega solo si está habilitada
      }
    }
  }

  public selectAll(checked: boolean) {
    if (checked) {
      this.selectionInvoices = this.dataSource.data
        .filter(invoice => invoice.invoiceStatus.id === this.invoiceStatusEnum.Pending)
        .map(invoice => ({ invoiceId: invoice.id, invoiceStatus: null }));
    } else {
      this.selectionInvoices = [];
    }
  }

  public isAllSelected(): boolean {
    return this.selectionInvoices.length === this.dataSource.data.filter(invoice => invoice.invoiceStatus.id === this.invoiceStatusEnum.Pending).length;
  }


  public isElementSelected(invoice: InvoiceDto): boolean {
    return this.selectionInvoices.some(x => x.invoiceId === invoice.id);
  }


  public approveInvoice() {
    if (this.selectionInvoices.length == 0) {
      const dialog: DialogModel = {
        isSuccessful: false,
        title: 'Alerta.',
        subtitle: 'Debe seleccionar al menos una boleta.',
        messageButton: 'Aceptar',
      };
      this.dialogService.openDialog(dialog);
      return;
    }
    let subtitle = 'Seleccione que acción desea realizar con la boleta seleccionada.'
    if (this.selectionInvoices.length > 1) {
      subtitle = 'Seleccione que acción desea realizar con las boletas seleccionadas.'
    }

    let dialog: DialogModel = {
      isSuccessful: true,
      title: 'Aprobar/Rechazar',
      subtitle: subtitle,
      messageButton: 'Aprobar',
      messageButton2: 'Rechazar',
      disableClose: false
    };
    this.dialogService.openDialog(dialog).afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      let status = null;
      let statusName = null;
      if (result.success) {
        status = InvoiceStatusEnum.Approved;
        statusName = 'aprobado'
      }

      if (!result.success) {
        status = InvoiceStatusEnum.Rejected;
        statusName = 'rechazado'
      }

      this.selectionInvoices.map((x: any) => {
        x.invoiceStatus = status;
      });

      let subtitle = 'Se ha ' + statusName + ' la boleta correctamente.'
      if (this.selectionInvoices.length > 1) {
        subtitle = 'Se han ' + statusName + ' la boletas correctamente.'
      }
      this.invoiceService.approveRejectInvoice(this.selectionInvoices).subscribe({
        next: () => {
          let dialog: DialogModel = {
            isSuccessful: true,
            title: 'Proceso correcto',
            subtitle: subtitle,
            messageButton: 'Aceptar',
            redirectTo: null,
            action: null
          };
          this.dialogService.openDialog(dialog).afterClosed().subscribe(x => {
            this.getInvoices();
          });
        },
        error: () => {
          let dialog: DialogModel = {
            isSuccessful: false,
            title: 'Alerta',
            subtitle: 'Ha ocurrido un problema, vuelve a intertarlo.',
            messageButton: 'Aceptar',
            redirectTo: null,
            action: null
          };
          this.dialogService.openDialog(dialog);
        }
      });
    });
  }

  public download(): void {
    let dialog: DialogModel = {
      isSuccessful: true,
      title: 'Reporte excel',
      subtitle: 'Seleccione que tipo de reporte desea',
      messageButton: 'Normal',
      messageButton2: 'Agrupado',
      disableClose: false
    };
    this.dialogService.openDialog(dialog).afterClosed().subscribe(result => {
      const filteredData = this.dataSource.filteredData;
      let headersMap: { [key: string]: string };
      let nameBook;
      const data: any[] = [];
      if (result.success) {
        filteredData.forEach(item => {
          data.push({ userName: item.user.name, email: item.user.email, businessName: item.business.name, amount: item.amount, invoiceNumber: item.invoiceNumber, invoiceStatus: item.invoiceStatus.name, createdAt: item.createdAt });
        });
        headersMap = {
          userName: 'Nombre',
          email: 'Correo',
          businessName: 'Local',
          amount: 'Monto',
          invoiceNumber: 'Boleta',
          invoiceStatus: 'Estado',
          createdAt: 'Fecha'
        };
        nameBook = 'Reporte_';
      }
      if (!result.success) {
        filteredData.forEach(item => {
          if (item.invoiceStatus.id == InvoiceStatusEnum.Approved) {
            const existing = data.find(x => x.userName === item.user.name);
            if (existing) {
              existing.amount += item.amount; // Sumar el monto
            } else {
              data.push({ userName: item.user.name, email: item.user.email, businessName: item.business.name, amount: item.amount });
            }
          }
        });
        headersMap = {
          userName: 'Nombre',
          email: 'Correo',
          businessName: 'Local',
          amount: 'Total Monto',
        };
        nameBook = 'Reporte_agrupado_';
      }

      if (data.length > 0) {
        this.exportExcel(data, headersMap, nameBook);
      } else {
        const dialog: DialogModel = {
          isSuccessful: false,
          title: 'Alerta.',
          subtitle: 'No hay datos para exportar.',
          messageButton: 'Aceptar',
        };
        this.dialogService.openDialog(dialog);
        return;
      }

    });
  }

  private exportExcel(data: any[], headersMap: { [key: string]: string }, nameBook: string) {
    const dataWithCustomHeaders = data.map(item => {
      return Object.fromEntries(
        Object.entries(item).map(([key, value]) => [headersMap[key] || key, value])
      );
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithCustomHeaders);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    const date = new Date().toLocaleString('es-ES', { timeZone: 'America/Santiago' });
    XLSX.utils.book_append_sheet(workbook, worksheet, nameBook);
    XLSX.writeFile(workbook, nameBook + date + '.xlsx');
  }






}