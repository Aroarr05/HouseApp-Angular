import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-loging',
  imports:[CommonModule,ReactiveFormsModule],
  templateUrl: './loging.component.html',
  styleUrl: './loging.component.css'
})

export class LogingComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.loginForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { firstName, lastName } = this.loginForm.value;
      const fullName = `${firstName} ${lastName}`;
      this.userService.setUserName(fullName);
      console.log("Formulario enviado:", this.loginForm.value);
    } else {
      console.log("El formulario no es válido");
    }
  }
}
