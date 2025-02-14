import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-loging',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './loging.component.html',
  styleUrl: './loging.component.css'
})
export class LogingComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
      // Guardar los datos del formulario en el localStorage
      localStorage.setItem('loginData', JSON.stringify(this.loginForm.value));

      alert('Form data has been saved!');
    } else {
      console.log('Form is invalid');
    }
  }

  ngOnInit() {
    // Recuperar datos del localStorage si están disponibles
    const savedData = localStorage.getItem('loginData');
    if (savedData) {
      this.loginForm.patchValue(JSON.parse(savedData));  // Rellenar los campos con los datos guardados
    }
  }

}
