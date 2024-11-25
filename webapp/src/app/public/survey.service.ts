import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private readonly API_URL = environment.api +'/public';

  constructor(private http: HttpClient) {}

  getSurveyById(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  submitResponse(surveyId: number, answers: any[]): Observable<any> {
    return this.http.post(this.API_URL, { surveyId, answers });
  }
}
