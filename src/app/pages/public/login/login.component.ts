import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { emailRegex } from '../../../shared/inmutable/regex';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenService } from '../../../shared/helpers/token.service';
import { UserService } from '../../../infrastructure/rest/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { DialogModel } from '../../../shared/dialog/dialog-model';
import { UserTypeRole } from '../../../infrastructure/enums/user-type.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class LoginComponent implements OnInit {
  public loginForm: UntypedFormGroup;
  public msgErrorEmail: string;
  public msgErrorPassword: string;
  public disabledButton = false;

  //#region form validation
  public get emailControl(): AbstractControl {
    return this.loginForm.get('email') as FormControl;
  }

  public get passwordControl(): AbstractControl {
    return this.loginForm.get('password') as FormControl;
  }

  public get passwordError(): string {
    const error = this.passwordControl.hasError('required')
      ? 'Debe ingresar una contraseña'
      : this.passwordControl.hasError('pattern')
      ? 'Debe tener como mínimo 8 dígitos, 1 mayúscula y 1 número'
      : '';

    this.msgErrorPassword = error;
    return error;
  }

  public get emailError(): string {
    const error = this.emailControl.hasError('required')
      ? 'Debe ingresar un correo.'
      : this.emailControl.hasError('notMatch')
      ? 'El correo no coincide.'
      : this.emailControl.hasError('email') ||
        this.emailControl.hasError('pattern')
      ? 'Debe ingresar un correo válido'
      : '';

    this.msgErrorEmail = error;
    return error;
  }
  //#endregion

  constructor(
    private formBuilder: UntypedFormBuilder,
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router,
    private dialogService: DialogService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loadLoginForm();
  }

  public loadLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      password: ['', [Validators.required]],
    });
  }

  public login() {
    if (!this.loginForm.invalid) {
      this.disabledButton = true;
      this.userService
        .login(this.emailControl.value, this.passwordControl.value)
        .subscribe({
          next: (token) => {
            this.disabledButton = false;
            this.tokenService.setTokenInLocalStorage(token.accessToken);
            this.redirectRouter();
          },
          error: (error: HttpErrorResponse) => {
            let message;
            switch (error.status) {
              case 400:
                message = 'Credenciales incorrectas.';
                break;
              case 401:
                message = 'Usuario no autorizado.';
                break;
              default:
                message = 'Ha ocurrido un problema, vuelva a intentarlo.';
                break;
            }

            let dialog: DialogModel = {
              isSuccessful: false,
              title: 'Problemas para iniciar sesión.',
              subtitle: message,
              messageButton: 'Aceptar',
            };
            this.dialogService
              .openDialog(dialog)
              .afterClosed()
              .subscribe(() => {
                this.disabledButton = false;
              });
          },
        });
    }
  }

  public redirectRouter(): void {
    const token = this.tokenService.getDecodedJwtToken();
    if (token.type == UserTypeRole.Admin) {
      this.router.navigate(['']);
    } else {
      this.router.navigate(['']);
    }
  }
}
