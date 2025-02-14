import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {HousingService} from '../../service/housing.service';
import {HousingLocation} from '../../model/housinglocation';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;
  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });
  
  constructor() {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId).then((housingLocation) => {
      this.housingLocation = housingLocation;
    });
  }
  
  submitApplication() {
    if (this.applyForm.valid) {
      const newApplication = this.applyForm.value;

      // Obtener aplicaciones previas desde localStorage (si existen)
      const savedApplications = localStorage.getItem('userApplications');
      let applicationsArray = savedApplications ? JSON.parse(savedApplications) : [];

      // Agregar nueva aplicación al array
      applicationsArray.push(newApplication);

      // Guardar array actualizado en localStorage
      localStorage.setItem('userApplications', JSON.stringify(applicationsArray));

      alert('Aplicación guardada correctamente en localStorage.');

      // Opcional: Llamar al servicio para enviar la aplicación
      this.housingService.submitApplication(
        newApplication.firstName ?? '',
        newApplication.lastName ?? '',
        newApplication.email ?? ''
      );
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }
}
