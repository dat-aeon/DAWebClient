import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDetailService {

  public daLoneTypeId: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }
}
