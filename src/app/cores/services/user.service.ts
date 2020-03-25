import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

  public resetUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public registrationUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

}
