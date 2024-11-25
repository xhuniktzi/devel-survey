import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FillSurveyComponent } from './fill-survey/fill-survey.component';

const routes: Routes = [
  {path: ':id', component: FillSurveyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
