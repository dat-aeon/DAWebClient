import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root'})

export class ApplicationFormService {

 applicationFormObject: any = new BehaviorSubject<any>(null);
 applicantCompanyInfoDto: any = new BehaviorSubject<any>(null);
 emergencyContactInfoDto: any = new BehaviorSubject<any>(null);
 guarantorInfoDto: any = new BehaviorSubject<any>(null);
 finalData: any = new BehaviorSubject<any>(null);

  constructor() { }
}
