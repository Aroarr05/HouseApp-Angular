import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { HousingLocation } from '../../model/housinglocation';
import { HousingService } from '../../service/housing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HousingLocationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  housingLocationList: HousingLocation[] = [];
  housingService: HousingService = inject(HousingService);
  filteredLocationList: HousingLocation[] = [];
  private router = inject(Router);

  private currentCityFilter = '';
  private currentBedroomsFilter: number | null = null;
  private currentGarageFilter: boolean | null = null;

  constructor() {
    this.housingService.getAllHousingLocations().then((housingLocationList: HousingLocation[]) => {
      this.housingLocationList = housingLocationList;
      this.filteredLocationList = housingLocationList;
    });
  }

  navigateToFrom() {
    this.router.navigate(['/from']);
  }

  filterResults(text: string) {
    this.currentCityFilter = text.toLowerCase();
    this.applyAllFilters();
  }

  filterDormitorios(bedrooms: string) {  
    const numBedrooms = parseInt(bedrooms, 10);
    this.currentBedroomsFilter = isNaN(numBedrooms) ? null : numBedrooms;
    this.applyAllFilters();
  }

  filterGaraje(hasGarage: boolean) {
    this.currentGarageFilter = hasGarage;
    this.applyAllFilters();
  }

  clearGarageFilter() {
    this.currentGarageFilter = null;
    this.applyAllFilters();
  }

  private applyAllFilters() {
    this.filteredLocationList = this.housingLocationList.filter(location => {
      const cityMatch = !this.currentCityFilter || 
        location.city.toLowerCase().includes(this.currentCityFilter);
    
      const bedroomsMatch = !this.currentBedroomsFilter || 
        location.bedrooms === this.currentBedroomsFilter;
    
      const garageMatch = this.currentGarageFilter === null || 
        location.hasGarage === this.currentGarageFilter;
      
      return cityMatch && bedroomsMatch && garageMatch;
    });
  }
}