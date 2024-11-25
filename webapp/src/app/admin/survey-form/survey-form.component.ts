import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.css'],
})
export class SurveyFormComponent implements OnInit {
  surveyForm!: FormGroup;
  isEditMode = false;
  surveyId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.surveyId;

    this.surveyForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      fields: this.fb.array([]),
    });

    if (this.isEditMode) {
      this.loadSurvey();
    }
  }

  get fields(): FormArray {
    return this.surveyForm.get('fields') as FormArray;
  }

  asFormArray(control: any): FormArray {
    return control as FormArray;
  }

  addField(): void {
    this.fields.push(
      this.fb.group({
        name: ['', Validators.required],
        typeId: 1, 
        isRequired: [false],
        options: this.fb.array([]),
      })
    );
  }


  removeField(index: number): void {
    this.fields.removeAt(index);
  }

  addOption(fieldIndex: number): void {
    const options = this.fields.at(fieldIndex).get('options') as FormArray;
    options.push(this.fb.control('', Validators.required));
  }

  removeOption(fieldIndex: number, optionIndex: number): void {
    const options = this.fields.at(fieldIndex).get('options') as FormArray;
    options.removeAt(optionIndex);
  }

  onSubmit(): void {
    if (this.surveyForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    
    const formValue = {
      ...this.surveyForm.value,
      fields: this.surveyForm.value.fields.map((field: any) => ({
        ...field,
        typeId: Number(field.typeId), 
      })),
    };

    if (this.isEditMode) {
      this.adminService.updateSurvey(this.surveyId!, formValue).subscribe(
        () => {
          alert('Survey updated successfully!');
          this.router.navigate(['/admin']);
        },
        (error) => console.error('Error updating survey:', error)
      );
    } else {
      this.adminService.createSurvey(formValue).subscribe(
        () => {
          alert('Survey created successfully!');
          this.router.navigate(['/admin']);
        },
        (error) => console.error('Error creating survey:', error)
      );
    }
  }


  private loadSurvey(): void {
    this.adminService.getSurveyById(this.surveyId!).subscribe((data) => {
      this.surveyForm.patchValue({
        name: data.name,
        description: data.description,
      });

      data.fields.forEach((field: any) => {
        const fieldGroup = this.fb.group({
          name: [field.name, Validators.required],
          typeId: [field.typeId, Validators.required],
          isRequired: [field.isRequired],
          options: this.fb.array([]),
        });

        field.options?.forEach((option: any) => {
          (fieldGroup.get('options') as FormArray).push(
            this.fb.control(option.value, Validators.required)
          );
        });

        this.fields.push(fieldGroup);
      });
    });
  }

  onTypeChange(event: Event, index: number): void {
    const typeId = Number((event.target as HTMLSelectElement).value);
    this.fields.at(index).patchValue({ typeId });
  }

  back(): void {
    this.router.navigate(['/admin']);
  }
}