import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';
import { SurveyDto } from '../survey.dto';
import { AuthService } from '../../auth/auth.service';
import { ClipboardComponent } from "../../shared/clipboard/clipboard.component";


@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [CommonModule, ClipboardComponent],
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css'],
})
export class SurveyListComponent implements OnInit {
  surveys: SurveyDto[] = []; 

  constructor(private adminService: AdminService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.adminService.getSurveys().subscribe((data: SurveyDto[]) => {
      this.surveys = data.map((survey: SurveyDto) => ({
        ...survey,
        createdAt: new Date(survey.createdAt).toLocaleString(),
        updatedAt: new Date(survey.updatedAt).toLocaleString(),
      }));
    });
  }

  deleteSurvey(id: number): void {
    if (confirm('Are you sure you want to delete this survey?')) {
      this.adminService.deleteSurvey(id).subscribe(() => {
        this.loadSurveys();
      });
    }
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/edit', id]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/admin/create']);
  }

  navigateToResponses(): void {
    this.router.navigate(['/response']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
