import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-new-house',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-house.component.html',
  styleUrl: './new-house.component.css'
})
export class NewHouseComponent {

  houseForm: FormGroup;

  constructor(private fp : FormBuilder){
    this.houseForm = this.fp.group({
      name: ['', Validators.required],
      city:  ['', Validators.required],
      state:  ['', Validators.required],
      photo:  ['', Validators.required],
      availableUnits:  ['', Validators.required],
      wifi:  ['', Validators.required],
      laundry:  ['', Validators.required],
      seguridad:  ['', Validators.required],
      tipoSeguridad:  ['', Validators.required],
      coordinates:  ['', Validators.required]
    })
  }

  onSubmit(){
    if (this.houseForm.valid){
      console.log ("Form submitted:" , this.houseForm.value);
    }else{
      console.log("Form is invalid");
    }
  }

}
