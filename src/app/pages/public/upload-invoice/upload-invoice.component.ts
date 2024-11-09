import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  FormControl,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { emailRegex } from '../../../shared/inmutable/regex';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BusinessService } from '../../../infrastructure/rest/business.service';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { InvoiceService } from '../../../infrastructure/rest/invoices.service';
import { UploadInvoiceDto } from '../../private/invoices/dto/upload-invoice.dto';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { TyneRoutes } from '../../../infrastructure/enums/tyne-routes.enum';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-upload-invoice',
  standalone: true,
  templateUrl: './upload-invoice.component.html',
  styleUrls: ['./upload-invoice.component.scss'],
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule,
    CommonModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatProgressSpinnerModule,
  ],
})
export class UploadInvoiceComponent implements OnInit {
  selectedFile: File | null = null;
  btnSubmitDisabled = false;
  public form: UntypedFormGroup;
  public business: any[] = [];
  public filteredBusiness: Observable<any[]>;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private businessService: BusinessService,
    private invoiceService: InvoiceService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loadLoginForm();
    this.getAllBusiness();
  }

  public upload() {
    if (this.form.errors) return;
    this.btnSubmitDisabled = true;

    const invoice: UploadInvoiceDto = {
      name: this.form.value.name,
      email: this.form.value.email,
      amount: Number(this.form.value.amount),
      invoiceNumber: this.form.value.invoiceNumber,
      businessId: this.form.value.business.id,
      file: {
        contentType: this.form.value.contentType,
        base64Data: this.form.value.base64Data,
      },
    };

    this.invoiceService.uploadInvoice(invoice).subscribe({
      next: (response) => {
        this.btnSubmitDisabled = false;
        this.dialogService
          .openDialog({
            title: 'Boleta subida correctamente',
            subtitle:
              'Recibirá un correo confirmando la recepción de su boleta',
            isSuccessful: true,
            messageButton: 'Aceptar',
          } as any)
          .afterClosed()
          .subscribe((res) => {
            this.router.navigate(['#inicio']).then(() => {
              window.scrollTo(0, 0);
            });
          });
      },
      error: (error) => {
        this.btnSubmitDisabled = false;
        this.dialogService.openDialog({
          title: 'Ha ocurrido un error',
          subtitle:
            'Por favor contactar a contacto@tyne.cl si el problema persiste',
          isSuccessful: false,
          messageButton: 'Aceptar',
        } as any);
      },
    });
  }
  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();

      const contentType = file.type;

      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];
        this.form.value.contentType = contentType;
        this.form.value.base64Data = base64Data;
      };

      reader.readAsDataURL(file);
    }
  }

  public businessError(): string {
    const control = this.form.get('business');

    const error = control.hasError('required')
      ? 'Debe seleccionar un comercio'
      : '';

    return error;
  }

  public nameError(): string {
    const control = this.form.get('name');

    const error = control.hasError('required')
      ? 'Debe ingresar un nombre.'
      : control.hasError('minlength')
      ? 'El nombre debe tener al menos 3 caracteres.'
      : control.hasError('maxlength')
      ? 'El nombre no puede tener más de 30 caracteres.'
      : '';

    return error;
  }

  public emailError(): string {
    const control = this.form.get('email');

    const error = control.hasError('required')
      ? 'Debe ingresar un correo.'
      : control.hasError('minlength')
      ? 'El correo debe tener al menos 3 caracteres.'
      : control.hasError('maxlength')
      ? 'El correo no puede tener más de 50 caracteres.'
      : control.hasError('notMatch')
      ? 'El correo no coincide.'
      : control.hasError('email') || control.hasError('pattern')
      ? 'Debe ingresar un correo válido'
      : '';

    return error;
  }

  public invoiceNumberError(): string {
    const control = this.form.get('invoiceNumber');

    const error = control.hasError('required')
      ? 'Debe ingresar un número de boleta.'
      : control.hasError('minlength')
      ? 'El número de boleta debe tener al menos 3 caracteres.'
      : control.hasError('maxlength')
      ? 'El número de boleta no puede tener más de 30 caracteres.'
      : '';

    return error;
  }

  public amountError(): string {
    const control = this.form.get('amount');

    const error = control.hasError('required')
      ? 'Debe ingresar el monto de la compra.'
      : control.hasError('minlength')
      ? 'El monto debe tener al menos 3 caracteres.'
      : control.hasError('maxlength')
      ? 'El monto no puede tener más de 7 caracteres.'
      : '';

    return error;
  }

  public validateNumberInput(event: KeyboardEvent) {
    const key = event.key;
    if (!/^[0-9]+$/.test(key) && key !== 'Backspace' && key !== 'Tab') {
      event.preventDefault();
    }
  }

  public displayBusinessName(business: any): string {
    return business ? business.name : '';
  }

  private loadLoginForm(): void {
    this.form = this.formBuilder.group({
      business: ['', [Validators.required]],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(emailRegex),
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      invoiceNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      amount: [
        0,
        [Validators.required, Validators.minLength(3), Validators.maxLength(7)],
      ],
      file: ['', [Validators.required]],
    });
  }

  private getAllBusiness() {
    this.businessService.getAll().subscribe((x) => {
      this.business = x;
      this.setupAutocompleteFilter();
    });
  }

  private setupAutocompleteFilter() {
    const businessControl = this.form.get('business') as FormControl;
    this.filteredBusiness = businessControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value?.name)),
      map((name) => (name ? this._filterBusiness(name) : this.business.slice()))
    );
  }

  private _filterBusiness(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.business.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
}
