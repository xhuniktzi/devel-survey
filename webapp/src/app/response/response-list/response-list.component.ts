import { Component, OnInit } from '@angular/core';
import { ResponseService } from '../response.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-response-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './response-list.component.html',
  styleUrls: ['./response-list.component.css']
})
export class ResponseListComponent implements OnInit {
  responses: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  constructor(private responseService: ResponseService, private router: Router) { }

  ngOnInit(): void {
    this.loadResponses();
  }

  loadResponses(): void {
    this.responseService.getResponses(this.currentPage, this.pageSize).subscribe((data) => {
      this.responses = data.responses;
      this.totalPages = data.pages;
    });
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadResponses();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadResponses();
    }
  }

  backToList(): void {
    this.router.navigate(['/admin']); 
  }
}
