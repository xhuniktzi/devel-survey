import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyFormComponent } from './survey-form/survey-form.component';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: '', component: SurveyListComponent, canActivate: [authGuard] },
  { path: 'create', component: SurveyFormComponent, canActivate: [authGuard] },
  { path: 'edit/:id', component: SurveyFormComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
