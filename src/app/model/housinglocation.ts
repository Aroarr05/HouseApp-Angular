export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface HousingLocation {
  id: number;
  name: string;
  city: string;
  state: string;
  photo: string;
  availableUnits: number;
  wifi: boolean;
  laundry: boolean;
  coordinates: Coordinates;
}
