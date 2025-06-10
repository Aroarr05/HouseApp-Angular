import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HousingService } from '../../service/housing.service';
import { HousingLocation } from '../../model/housinglocation';

@Component({
  selector: 'app-new-house',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-house.component.html',
  styleUrls: ['./new-house.component.css']
})

export class NewHouseComponent implements OnInit {
  houseForm: FormGroup;
  isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private housingService: HousingService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.houseForm = this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      photo: [''],
      availableUnits: [0, Validators.required],
      wifi: ['', Validators.required],
      laundry: ['', Validators.required],
      seguridad: ['', Validators.required],
      tipoSeguridad: this.fb.array([]),
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      type:[''],
      bedrooms:[0, Validators.required],
      hasGarage: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.houseForm.valid) {
      const formValue = this.houseForm.value;

      const existingLocations = this.housingService.getAllHousingLocations();
      const maxId = (await existingLocations).reduce((max, loc) => Math.max(max, loc.id), 0);
      const newId = maxId + 1;

      const photoUrl = formValue.photo && formValue.photo.trim() !== '' ? formValue.photo : 'assets/sinImagen.jpg'

      const newLocation: HousingLocation = {
        id: newId,
        name: formValue.name,
        city: formValue.city,
        state: formValue.state,
        photo: photoUrl,
        availableUnits: formValue.availableUnits,
        wifi: formValue.wifi === 'si',
        laundry: formValue.laundry === 'si',
        seguridad: formValue.seguridad,
        tipoSeguridad: formValue.tipoSeguridad,
        status: 'desponible',
        coordinates: {
          latitude: formValue.latitude,
          longitude: formValue.longitude,
        },
        type: formValue.type,
        bedrooms: formValue.bedrooms,
        hasGarage: formValue.hasGarage ==="si"

      };

      if (this.isBrowser) {
        localStorage.removeItem('eventFormData');
      }

      this.houseForm.reset();

      try {
        await this.housingService.addHousingLocation(newLocation);
        console.log('Ubicación añadida:', newLocation);
        this.houseForm.reset();
      } catch (error) {
        console.error('Error al guardar la ubicación:', error);
      }
    }
  }

  private saveFormToLocalStorage() {
    if (this.isBrowser) {
      localStorage.setItem('eventFormData', JSON.stringify(this.houseForm.value));
    }
  }

  private loadFormFromLocalStorage() {
    if (this.isBrowser) {
      const savedForm = localStorage.getItem('eventFormData');
      if (savedForm) {
        this.houseForm.patchValue(JSON.parse(savedForm));
      }
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.loadFormFromLocalStorage();
    }
    this.houseForm.valueChanges.subscribe(() => {
      this.saveFormToLocalStorage();
    });
    this.houseForm.get('seguridad')?.valueChanges.subscribe(value => {
      const tipoSeguridadControl = this.houseForm.get('tipoSeguridad') as FormArray;

      if (value === 'si') {
        tipoSeguridadControl.setValidators([Validators.required, Validators.minLength(1)]);
      } else {
        tipoSeguridadControl.clearValidators();
        tipoSeguridadControl.clear();
      }
      tipoSeguridadControl.updateValueAndValidity();
    });
  }

  //Extra en el formulario Seguridad

  tiposSeguridad = ['Alarmas', 'Cámaras', 'Puertas reforzadas', 'Detector de humo', 'Otro'];

  get tipoSeguridadFormArray() {
    return this.houseForm.get('tipoSeguridad') as FormArray;
  }

  //  Compruebo que los checked esten selccionados 
  isChecked(value: string): boolean {
    return this.tipoSeguridadFormArray.value.includes(value);
  }

  // Manejo de checkbox
  onCheckboxChange(event: any) {
    const value = event.target.value;
    const formArray = this.tipoSeguridadFormArray;
    if (event.target.checked) {
      if (!formArray.value.includes(value)) {
        formArray.push(this.fb.control(value));
      }
    } else {
      const index = formArray.controls.findIndex(ctrl => ctrl.value === value);
      if (index >= 0) {
        formArray.removeAt(index);
      }
    }
  }

  //Seleccionar todo
  toggleAllCheckboxes(event: any) {
    const formArray = this.tipoSeguridadFormArray;
    formArray.clear();
    if (event.target.checked) {
      this.tiposSeguridad.forEach(tipo => formArray.push(this.fb.control(tipo)));
    }
  }

}
