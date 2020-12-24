import { Pipe, PipeTransform } from '@angular/core';
import { ICity } from '../interfaces/city.interface';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: Array<ICity>, field: string): Array<ICity> {
    console.log(value, field);
    
    if(!value){
      return value
    }
    if(!field){
      return value
    }
    return value.filter(prod => prod.city.toLowerCase().includes(field) );
    }
  }


