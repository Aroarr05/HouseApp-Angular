import { Component } from '@angular/core';
import {HomeComponent} from './home/home.component';
import {RouterModule} from '@angular/router';

@Component({
  standalone:true,
  selector: 'app-root',
  imports: [HomeComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'home-app';
}
