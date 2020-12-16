import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { IDrinks } from '../shared/interfaces/drinks.interface';

@Injectable({
  providedIn: 'root'
})
export class DrinksService {
  private url: string;
  private dbPath = '/drinkss';
  localProd: Array<IDrinks> = []
  prod: Subject<any> = new Subject<any>();
  updProd: Subject<any> = new Subject<any>();
  productsRef: AngularFirestoreCollection<IDrinks> = null;
  constructor( private db: AngularFirestore) {
    this.productsRef = this.db.collection(this.dbPath);
  }

  getAllProd():AngularFirestoreCollection<IDrinks>{
    return this.productsRef;
    
    
  }
  create(category: IDrinks):any{
   this.productsRef.add( {...category} ).then(
     data =>{
      this.updProd.next(data.id);
       
     }
   );
  }
  update(id:string, data: any):Promise<void>{
    return this.productsRef.doc(id).update( {...data} );
  }
  delete(id:string):Promise<void>{
    return this.productsRef.doc(id).delete();
  }
}
