import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { IDiscount } from '../shared/interfaces/discounts.interface';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private dbPath = '/discounts';
  updProd: Subject<any> = new Subject<any>();
  discountsRef: AngularFirestoreCollection<IDiscount> = null;
  constructor( private db: AngularFirestore) {
    this.discountsRef = this.db.collection(this.dbPath);
  }

  getAllDisc():AngularFirestoreCollection<IDiscount>{
    return this.discountsRef;
    
    
  }
  create(disc: IDiscount):any{
   this.discountsRef.add( {...disc} ).then(
     data =>{
      this.updProd.next(data.id);
       
     }
   );
  }
  update(id:string, data: any):Promise<void>{
    return this.discountsRef.doc(id).update( {...data} );
  }
  delete(id:string):Promise<void>{
    return this.discountsRef.doc(id).delete();
  }
}
