import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {
  private readonly API_URL = environment.api +'/admin/responses';

  constructor(private http: HttpClient) {}

  getResponses(page: number, limit: number): Observable<any> {
    return this.http.get(`${this.API_URL}?page=${page}&limit=${limit}`);
  }
}
