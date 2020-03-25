import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../cores/helper/data.service';
import { AuthService } from '../cores/services/auth.service';

@Pipe({ name: 'loanType'})

export class LoanTypePipe implements PipeTransform {

loadType: any = []; 
currentUser: any;

  constructor (
    private dataService: DataService,
    private authService: AuthService
  ) { 

    this.authService.currentUser.subscribe( (res: any) => { this.currentUser = res.data; });
  }

  transform(value: number): any {
    this.dataService.getLoanTypeList(this.currentUser.access_token).subscribe( (res: any) => {
      res.data.filter( (x: any) => {
        if(x.loanTypeId === value) {
          return x.name;
        }
      });
    });


  }

}
