import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../survey.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fill-survey',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './fill-survey.component.html',
  styleUrls: ['./fill-survey.component.css']
})
export class FillSurveyComponent implements OnInit {
  survey: any = null;
  surveyForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyService,
    private fb: FormBuilder
  ) {
    this.surveyForm = this.fb.group({});
  }

  ngOnInit(): void {
    const surveyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSurvey(surveyId);
  }

  loadSurvey(id: number): void {
    this.surveyService.getSurveyById(id).subscribe(
      (data) => {
        this.survey = data;
        this.createFormFields();
      },
      (error) => {
        console.error('Error fetching survey:', error);
        this.survey = null;
      }
    );
  }

  createFormFields(): void {
    if (!this.survey || !Array.isArray(this.survey.fields)) {
      console.error('Invalid survey fields:', this.survey.fields);
      return;
    }

    this.surveyForm = this.fb.group({});

    this.survey.fields.forEach((field: any) => {
      const validators = field.isRequired ? [Validators.required] : [];
      const control = field.typeId === 4 ? this.fb.control([], validators) : this.fb.control(null, validators);
      this.surveyForm.addControl(field.id.toString(), control);
    });
  }

  onSubmit(): void {
    if (this.surveyForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    const answers = Object.keys(this.surveyForm.value).map((key) => {
      const field = this.survey.fields.find((f: any) => f.id.toString() === key);

      return {
        fieldId: Number(key),
        value:
          field?.typeId === 4
            ? (this.surveyForm.value[key] || []).join(',')
            : this.surveyForm.value[key] || '',
      };
    });

    this.surveyService.submitResponse(this.survey.id, answers).subscribe(
      () => {
        alert('Response submitted successfully!');
        this.resetFormAndSurvey();
      },
      (error) => {
        console.error('Error submitting response:', error);
      }
    );
  }

  resetFormAndSurvey(): void {
    this.loadSurvey(this.survey.surveyIdentifier);
  }

  onCheckboxChange(event: any, fieldId: number): void {
    const formControl = this.surveyForm.get(fieldId.toString());
    if (!formControl) return;

    const value = event.target.value;
    const selectedOptions = formControl.value || [];

    if (event.target.checked) {
      formControl.setValue([...selectedOptions, value]);
    } else {
      formControl.setValue(selectedOptions.filter((option: string) => option !== value));
    }

    formControl.updateValueAndValidity();
  }

  getFieldType(typeId: number): string {
    switch (typeId) {
      case 1:
        return 'number';
      case 2:
        return 'text';
      case 3:
        return 'date';
      default:
        return 'text';
    }
  }
}
