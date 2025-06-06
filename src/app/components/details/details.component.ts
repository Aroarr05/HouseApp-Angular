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
  private circleLayer: any; // Variable para el círculo morado

  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private housingService: HousingService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  async ngOnInit() {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingLocation = await this.housingService.getHousingLocationById(housingLocationId);

    if (isPlatformBrowser(this.platformId) && this.L && this.housingLocation?.coordinates) {
      this.verMapa(this.housingLocation.coordinates);
    }
  }

  /*submitApplication(): void {
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
  }*/
  submitApplication(): void {
    if (this.applyForm.valid && this.housingLocation) {
      const newApplication = this.applyForm.value;

      // Guardar la aplicación en localStorage
      const savedApplications = localStorage.getItem('userApplications');
      let applicationsArray = savedApplications ? JSON.parse(savedApplications) : [];
      applicationsArray.push(newApplication);
      localStorage.setItem('userApplications', JSON.stringify(applicationsArray));

      // Enviar a servicio (si aplica)
      this.housingService.submitApplication(
        newApplication.firstName ?? '',
        newApplication.lastName ?? '',
        newApplication.email ?? ''
      );

      // Actualizar la casa: reducir unidades y cambiar status
      if (this.housingLocation.availableUnits > 0) {
        this.housingLocation.availableUnits--;

        if (this.housingLocation.availableUnits === 0) {
          this.housingLocation.status = 'reservado';
        }

        // Guardar cambios en el servicio
        this.housingService.updateHousingLocation(this.housingLocation.id, {
          availableUnits: this.housingLocation.availableUnits,
          status: this.housingLocation.status,
        });
      }

      alert('Aplicación guardada correctamente. ¡Gracias por tu interés!');
      this.applyForm.reset();
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }



  private inicializarMapa(): void {
    if (!this.L || this.mapa) return;
    this.mapa = this.L.map('map').setView([0, 0], 2);
    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.mapa);

    if (this.housingLocation?.coordinates) {
      setTimeout(() => this.verMapa(this.housingLocation!.coordinates), 500);
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
      this.mapa.eachLayer((layer: any) => {
        if (layer instanceof this.L.Marker || layer === this.circleLayer) {
          this.mapa.removeLayer(layer);
        }
      });
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
