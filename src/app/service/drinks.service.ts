import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { IDrinks } from '../shared/interfaces/drinks.interface';

@Injectable({
  providedIn: 'root'
})
export class DrinksService {
  private url: string;
  private dbPath = '/drinks';
  prod: Subject<any> = new Subject<any>();
  updProd: Subject<any> = new Subject<any>();
  drinksRef: AngularFirestoreCollection<IDrinks> = null;
  constructor( private db: AngularFirestore) {
    this.drinksRef = this.db.collection(this.dbPath);
  }

  getAllDrinks():AngularFirestoreCollection<IDrinks>{
    return this.drinksRef;
    
    
  }
  create(drink: IDrinks):any{
   this.drinksRef.add( {...drink} ).then(
     data =>{
      this.updProd.next(data.id);
       
     }
   );
  }
  update(id:string, data: any):Promise<void>{
    return this.drinksRef.doc(id).update( {...data} );
  }
  delete(id:string):Promise<void>{
    return this.drinksRef.doc(id).delete();
  }
  getOne(id):any{
    return this.drinksRef.ref.where('urlName', '==', id);
  
  }
}
