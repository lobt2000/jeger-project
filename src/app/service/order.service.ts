import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDiscount } from '../shared/interfaces/discounts.interface';
import { IProd } from '../shared/interfaces/prod.interface';
import { DiscountService } from './discount.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  basket: Subject<Array<IProd>> = new Subject<Array<IProd>>();
  discounts: Array<IDiscount> = [];
  discount: number = 0;
  checkDisc: Subject<boolean> = new Subject<boolean>();

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
  constructor(private db: AngularFirestore, private discService: DiscountService,  private toastr: ToastrService) {
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
    this.toastr.success('Product add to basket!', 'Success');
    this.basket.next(localProd)
  }

  getAllCity(): AngularFirestoreCollection<any> {
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

  getDisc() {
    this.discount = 0;
    // this.totalPrice = this.discount;
    this.discService.getAllDisc().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.discounts = data;
      this.checkDisc.next(true);
    });
  }

  calcDisc(): number {
    let localProd = JSON.parse(localStorage.getItem('basket'))
    if (localProd != null) {
      this.discount = 0;
      if (localStorage.getItem('user')) {
        this.discount = 0;
        for (let i = 0; i < this.discounts.length; i++) {
          for (let j = 0; j < localProd.length; j++) {
            if (this.discounts[i].product == localProd[j].mainTitle) {
              localProd[j].disc = localProd[j].price * localProd[j].count - localProd[j].price * localProd[j].count * (this.discounts[i].discount / 100 + this.discounts[0].discount / 100);
              this.discount += localProd[j].price * localProd[j].count - localProd[j].price * localProd[j].count * (this.discounts[i].discount / 100 + this.discounts[0].discount / 100);
              break
            }
            else if (this.discounts[i].product == 'All') {
              if (localProd[j].discount.hasOwnProperty('discount')) {
              }
              else {
                this.discount += localProd[j].price * localProd[j].count - localProd[j].price * localProd[j].count * (this.discounts[0].discount / 100);
                localProd[j].disc = localProd[j].price * localProd[j].count - localProd[j].price * localProd[j].count * (this.discounts[0].discount / 100);
              }
            }

          }


        }
        this.basket.next(localProd);
        localStorage.setItem('basket', JSON.stringify(localProd))
      }
      else {
        this.discount = 0;
        for (let i = 0; i < this.discounts.length; i++) {
          for (let j = 0; j < localProd.length; j++) {
            if (this.discounts[i].product == localProd[j].mainTitle) {
              localProd[j].disc = localProd[j].price * localProd[j].count - localProd[j].price * localProd[j].count * (this.discounts[i].discount / 100)
              this.discount += localProd[j].price * localProd[j].count - localProd[j].price * localProd[j].count * (this.discounts[i].discount / 100);;
              break;
            }
            else if (!localProd[j].discount.hasOwnProperty('discount')) {
              localProd[j].disc = 0
            }
          }

        }
        localProd.forEach(element => {
          if (element.disc > 1) {
          }
          else {
            element.disc = 0
            this.discount += element.price * element.count
          }
        });
        this.basket.next(localProd);
        localStorage.setItem('basket', JSON.stringify(localProd))
      }
    }
    return this.discount;

  }


}
