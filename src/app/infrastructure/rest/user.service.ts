import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../shared/interfaces/token';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlApi = environment.tyneUrl;

  public constructor(private http: HttpClient) {}

  public login(email: string, password?: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.urlApi}/users/auth`, {
      email,
      password,
    });
  }

  public logout(): void {
    sessionStorage.clear();
    localStorage.clear();
  }
}
