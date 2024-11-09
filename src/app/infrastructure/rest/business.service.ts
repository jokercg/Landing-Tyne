import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  private url = environment.tyneUrl;
  private http = inject(HttpClient);

  public getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/business');
  }
}
