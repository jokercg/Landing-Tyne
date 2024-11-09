import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../helpers/token.service';
import { Token } from '../interfaces/token';
import { UserTypeRole } from '../../infrastructure/enums/user-type.enum';


@Injectable({
    providedIn: 'root',
})
export class AdminstratorGuard implements CanActivate {
    public constructor(private tokenService: TokenService, private router: Router) { }
    public canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const token: Token = this.tokenService.getDecodedJwtToken();
        if (token) {
            return token.type == UserTypeRole.Admin;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}
