import { Component, inject, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../../service/housing.service';
import { HousingLocation } from '../../model/housinglocation';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Coordinates } from '../../model/housinglocation';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements AfterViewInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;

  private map: any;
  private L: any;

  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  async ngOnInit() {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingLocation = await this.housingService.getHousingLocationById(housingLocationId);
    // Llamar a `verMapa()` solo si el mapa ya está inicializado
    if (this.housingLocation?.coordinates) {
      this.initializeMap();
    }
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

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet')
        .then((L) => {
          this.L = L;
          this.initializeMap();
        })
        .catch((error) => {
          // No registramos el error en la consola, solo lo manejamos
          console.warn('Error al cargar Leaflet, la librería no se ha cargado.');
        });
    }
  }

  private initializeMap(): void {
    if (!this.L) {
      return;
    }

    setTimeout(() => {
      const mapContainer = document.getElementById('map');
      if (!mapContainer) {
        return;
      }

      if (!this.map) {
        this.map = this.L.map('map').setView([0, 0], 2); // Coordenadas iniciales
        this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
      }

      if (this.housingLocation?.coordinates) {
        this.verMapa(this.housingLocation.coordinates); // Solo mostrar mapa si las coordenadas están disponibles
      }

      setTimeout(() => {
        this.map.invalidateSize(); // Asegurar que el mapa se renderice correctamente
      }, 500);
    }, 500); // Esperamos medio segundo para asegurar que el contenedor del mapa esté disponible
  }

  private verMapa(coordinates: Coordinates): void {
    if (this.map && this.L) {
      this.map.setView([coordinates.latitude, coordinates.longitude], 13);
      this.L.marker([coordinates.latitude, coordinates.longitude]).addTo(this.map)
        .bindPopup(`<b>Ubicación: ${coordinates.latitude}, ${coordinates.longitude}</b>`)
        .openPopup();
    }
  }
}
