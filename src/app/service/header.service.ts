import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
position: Subject<any> = new Subject<any>();
  constructor() { }

  changePos(active: any): any{
    return active;
  }
}
