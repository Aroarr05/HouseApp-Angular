import { Component, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
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
  styleUrls: ['./details.component.css']
})

export class DetailsComponent implements OnInit, AfterViewInit {
  housingLocation: HousingLocation | undefined;
  private mapa: any;
  private L: any;

  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private housingService: HousingService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId).then((data) => {
      this.housingLocation = data;
    });
  }

  submitApplication(): void {
    if (this.applyForm.valid) {
      const newApplication = this.applyForm.value;
      const savedApplications = localStorage.getItem('userApplications');
      let applicationsArray = savedApplications ? JSON.parse(savedApplications) : [];
      applicationsArray.push(newApplication);
      localStorage.setItem('userApplications', JSON.stringify(applicationsArray));

      alert('Aplicación guardada correctamente en localStorage.');
      this.housingService.submitApplication(
        newApplication.firstName ?? '',
        newApplication.lastName ?? '',
        newApplication.email ?? ''
      );
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }

  private inicializarMapa(): void {
    if (!this.mapa) {
      this.mapa = this.L.map('map').setView([0, 0], 2);
      
      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.mapa);

      this.L.circle([0, 0], {
        color: 'purple',
        fillColor: 'purple',
        fillOpacity: 0.6,
        radius: 50000
      }).addTo(this.mapa)
        .bindPopup('<b>Ubicación inicial</b>')
        .openPopup();
    }

    if (this.housingLocation?.coordinates) {
      this.verMapa(this.housingLocation.coordinates);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet').then((L: typeof import('leaflet')) => {
        this.L = L;
        this.inicializarMapa();
      });
    }
  }

  verMapa(coordenadas: Coordinates): void {
    if (isPlatformBrowser(this.platformId) && this.mapa) {
      this.mapa.setView([coordenadas.latitude, coordenadas.longitude], 13);
      this.L.circle([coordenadas.latitude, coordenadas.longitude], {
        color: 'purple',
        fillColor: 'purple',
        fillOpacity: 0.6,
        radius: 500
      }).addTo(this.mapa)
        .bindPopup(`<b>${coordenadas.latitude}, ${coordenadas.longitude}</b>`)
        .openPopup();
    }
  }
}
