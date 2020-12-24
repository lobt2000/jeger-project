import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { IProd } from '../shared/interfaces/prod.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  basket: Subject<Array<IProd>> = new Subject<Array<IProd>>();
  id = '0k8BLqOfw1r4FBO5IEoY';
  order;
  private dbPath1 = '/orders';
  private dbPath2 = '/users';
  private dbPath3 = '/orderId';
  private dbPath4 = '/city';
  ordersRef: AngularFirestoreCollection<any> = null;
  usersRef: AngularFirestoreCollection<any> = null;
  orderIdRef: AngularFirestoreCollection<any> = null;
  cityRef: AngularFirestoreCollection<any> = null;
  constructor(private db: AngularFirestore) {
    this.ordersRef = this.db.collection(this.dbPath1);
    this.usersRef = this.db.collection(this.dbPath2);
    this.orderIdRef = this.db.collection(this.dbPath3);
    this.cityRef = this.db.collection(this.dbPath4);
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

  getAllCity():AngularFirestoreCollection<any>{
    return this.cityRef;
  }

  getAll(): AngularFirestoreCollection<any> {
    return this.ordersRef;
  }

  create(order: any): Promise<DocumentReference<any>> {
    return this.ordersRef.add({ ...order });
  }



  update(id: string, data: any): Promise<void> {
    return this.usersRef.doc(id).update({ ...data });
  }
  updateID(data: any): Promise<void> {
    console.log(data);
    const ordId = {
      id: data
    }
    localStorage.setItem('orderId', JSON.stringify(data))
    return this.orderIdRef.doc(this.id).update(ordId);
  }

  getUser(id: string): any {
    return this.usersRef.doc(id).get()
  }
  getId(): any {

    this.orderIdRef.doc(this.id).get().subscribe(
      data => {
        this.order = data.data()

        localStorage.setItem('orderId', JSON.stringify(this.order.id))

      }
    )

  }

}
