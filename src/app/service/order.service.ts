import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { IProd } from '../shared/interfaces/prod.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  basket: Subject<Array<IProd>> = new Subject<Array<IProd>>();
  id = 'fjmtN05ajGE6BaJcPA9A';
  order;
  private dbPath1 = '/orders';
  private dbPath2 = '/users';
  private dbPath3 = '/orderId';
  // ordersRef: AngularFirestoreCollection<IOrder> = null;
  // usersRef: AngularFirestoreCollection<IUser> = null;
  // orderIdRef: AngularFirestoreCollection<any> = null;
  constructor(private db: AngularFirestore) {
    // this.ordersRef = this.db.collection(this.dbPath1);
    // this.usersRef = this.db.collection(this.dbPath2);
    // this.orderIdRef = this.db.collection(this.dbPath3);
  }
  addBasket(prod: IProd): void {
    let localProd: Array<IProd> = [];    
    if (localStorage.getItem('basket')) {
      localProd = JSON.parse(localStorage.getItem('basket'))
      if (localProd.some(product => product.id === prod.id)) {
        const i = localProd.findIndex(product => product.id === prod.id)
        localProd[i].count += prod.count;
      }
      else {
        localProd.push(prod)
      }
    }
    else {
      localProd.push(prod)
    }
    localStorage.setItem('basket', JSON.stringify(localProd));
    this.basket.next(localProd)
  }
}
