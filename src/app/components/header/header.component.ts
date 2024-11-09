import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TyneRoutes } from '../../infrastructure/enums/tyne-routes.enum'
import { TokenService } from '../../shared/helpers/token.service';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../shared/dialog/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogModel } from '../../shared/dialog/dialog-model';
import { DialogActions } from '../../shared/dialog/dialog-actions.enum';
import { UserTypeRole } from '../../infrastructure/enums/user-type.enum';
import { UserService } from '../../infrastructure/rest/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterModule, CommonModule]
})
export class HeaderComponent implements OnInit {
  public showButton = true;
  public titleButton = 'Iniciar Sesión'
  public disabledButton = false;
  public token: any = null;
  public routes: any[] = [];

  constructor(private router: Router
    , private tokenService: TokenService
    , private dialogService: DialogService
    , public dialog: MatDialog
    , private userService: UserService) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === ('/' + TyneRoutes.Login)) {
          this.showButton = false;
        } else {
          this.token = this.tokenService.getDecodedJwtToken();
          this.showButton = true;
          this.titleButton = 'Iniciar Sesión';
          if (this.token) {
            this.titleButton = 'Cerrar sesión';
          }
        }
        this.loadRoutes();
      }
    });
  }

  loadRoutes() {
    this.routes = [{
      name: 'Subir boleta',
      route: '/' + TyneRoutes.UploadInvoice
    }];
    if (this.token) {
      if (this.token.type === UserTypeRole.Admin) {
        this.routes.push({
          name: 'Boletas',
          route: '/' + TyneRoutes.Invoice
        });
      }
    }
  }

  actionButton() {
    if (!this.token) {
      this.router.navigate([TyneRoutes.Login]);
    } else {
      this.disabledButton = true;
      let dialog: DialogModel = {
        isSuccessful: true,
        title: 'Cerrar Sesión',
        subtitle: '¿Seguro que desea cerrar sesión?',
        messageButton: 'Aceptar',
        messageButton2: 'Cancelar',
        redirectTo: '/' + TyneRoutes.Login,
        action: DialogActions.SignOut
      };
      this.dialogService.openDialog(dialog).afterClosed().subscribe(result => {
        if (result.success) {
          this.signOut();
          this.loadRoutes();
        }
        this.disabledButton = false;
      });
    }
    this.toggleNavbar();
  }

  private signOut(): void {
    this.userService.logout();
    this.token = null;
    this.router.navigate(['']);
    this.titleButton = 'Iniciar Sesión';
  }

  toggleNavbar() {
    const navbar = document.getElementById('navbarSupportedContent');
    if (navbar && navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }
}
