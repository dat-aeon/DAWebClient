import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../cores/helper/data.service';

@Pipe({ name: 'city' })

export class CityPipe implements PipeTransform {

city: any;
dataLists:any=[];
constructor (
  private dataService: DataService,

) { 
  this.dataService.getCityTownshipCodeList().subscribe((dataLists: any) => {
    this.dataLists=dataLists.data;
  });
 
}
  transform(cityValue: number): any {

    if ( cityValue!==null ) {

        this.dataLists.find( (key: any) => {
          if (Number(cityValue) === key.cityId) {

            this.city=key.name;
        }});

}
     else 
     {
      this.city='-';
     }
     return this.city;
  }

}
    