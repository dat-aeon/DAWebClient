import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../cores/helper/data.service';

@Pipe({ name: 'township' })

export class TownshipPipe implements PipeTransform {

township: any;
dataLists:any=[];
constructor (
  private dataService: DataService,

) { 
  this.dataService.getCityTownshipCodeList().subscribe((dataLists: any) => {
    this.dataLists=dataLists.data;
  });
 
}
  transform(townshipValue: number,cityValue: number): any {

    if (townshipValue !== null && cityValue!==null ) {

        this.dataLists.find( (key: any) => {
          if (Number(cityValue) === key.cityId) {
           
        key.townshipInfoList.find((key: any) => {

          if(Number(townshipValue) === key.townshipId){

            this.township= key.name;
         
          }
        });

          }

    

   
  });

}
     else 
     {
      this.township='-';
     }
     return this.township;
  }

}
    