import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { IProd } from '../shared/interfaces/prod.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private dbPath = '/products';
  prod: Subject<any> = new Subject<any>();
  updProd: Subject<any> = new Subject<any>();
  productsRef: AngularFirestoreCollection<IProd> = null;
  constructor( private db: AngularFirestore) {
    this.productsRef = this.db.collection(this.dbPath);
  }

  getAllProds():AngularFirestoreCollection<IProd>{
    return this.productsRef;
    
    
  }
  create(prod: IProd):any{
   this.productsRef.add( {...prod} ).then(
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
  getOne(id):any{
    return this.productsRef.ref.where('urlName', '==', id);
  
  }
}
