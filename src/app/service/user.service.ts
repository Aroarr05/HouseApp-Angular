import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userNameSource = new BehaviorSubject<string | null>(null);
  userName$ = this.userNameSource.asObservable();

  setUserName(name: string) {
    this.userNameSource.next(name);
  }

  clearUserName() {
    this.userNameSource.next(null);
  }
}
