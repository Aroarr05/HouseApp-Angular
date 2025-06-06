import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { UserService } from './service/user.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, HomeComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'home-app';
  userName: string | null = null;

  private router = inject(Router);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.userName$.subscribe(name => {
      this.userName = name;
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
