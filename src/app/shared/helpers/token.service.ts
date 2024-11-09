import { Injectable } from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from "./local-storage.service";
import { UserService } from "../../infrastructure/rest/user.service";
import { Token } from "../interfaces/token";

@Injectable({
    providedIn: 'root',
  })

  export class TokenService {
    public constructor(private localStorageService: LocalStorageService, private userService: UserService) {}
  
    public getTokenFromLocalStorage(): string {
      return this.localStorageService.getValue('access_token');
    }
  
    public setTokenInLocalStorage(token: string): void {
      this.localStorageService.setValue('access_token', token);
    }
  
    public getDecodedJwtToken(): Token {
      let decodedToken: Token = null;
      const token: string = this.getTokenFromLocalStorage();
      if (token) {
        try {
          const JwtHelper = new JwtHelperService();
          decodedToken = JwtHelper.decodeToken<Token>(token);
          if (this.isTokenExpired()) return null;
          return decodedToken;
        } catch (e) {
          this.userService.logout();
          return null;
        }
      } else {
        this.userService.logout();
        return null;
      }
    }
  
    public isTokenExpired(): boolean {
      const token: string = this.getTokenFromLocalStorage();
      const JwtHelper = new JwtHelperService();
      return JwtHelper.isTokenExpired(token);
    }
  
    public isTokenValid(): boolean {
      const token = this.getDecodedJwtToken();
      return !!token;
    }
  }