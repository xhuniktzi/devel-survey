import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SurveyDto } from './survey.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = environment.api  + '/admin';

  constructor(private http: HttpClient) {}

  getSurveys(): Observable<SurveyDto[]> {
    return this.http.get<SurveyDto[]>(`${this.API_URL}/surveys`);
  }
  

  getSurveyById(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/surveys/${id}`);
  }

  createSurvey(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/surveys`, data);
  }

  updateSurvey(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API_URL}/surveys/${id}`, data);
  }

  deleteSurvey(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/surveys/${id}`);
  }
}