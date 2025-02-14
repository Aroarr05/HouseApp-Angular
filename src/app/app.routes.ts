import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {DetailsComponent} from './components/details/details.component';
import { LogingComponent } from './components/loging/loging.component';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    title: 'Home details',
  },{
    path: 'login', 
    component: LogingComponent,
    title: 'Login page',
  },
];
export default routeConfig;
