import { Injectable } from '@angular/core';
import { HousingLocation } from '../model/housinglocation';
@Injectable({
  providedIn: 'root',
})

export class HousingService {
  url = 'http://localhost:3000/locations';

  async getAllHousingLocations(): Promise<HousingLocation[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }

  async getHousingLocationById(id: number): Promise<HousingLocation | undefined> {
    const data = await fetch(`${this.url}/${id}`);
    return (await data.json()) ?? {};
  }

  submitApplication(firstName: string, lastName: string, email: string) {
    // tslint:disable-next-line
    console.log(firstName, lastName, email);
  }

  getAllHousingLocati(): HousingLocation[] {
    return this.housingList;
  }
  
  // -----------Formulario

  private housingList: HousingLocation[] = [];

  async addHousingLocation(location: HousingLocation): Promise<void> {
    await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });
  }

  updateHousingLocation(id: number, data: Partial<HousingLocation>): void {
  const locations = JSON.parse(localStorage.getItem('housingLocations') || '[]');
  const index = locations.findIndex((loc: HousingLocation) => loc.id === id);

  if (index !== -1) {
    locations[index] = { ...locations[index], ...data };
    localStorage.setItem('housingLocations', JSON.stringify(locations));
  }
}


}