import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { map } from 'rxjs/operators';
import { DiscountService } from 'src/app/service/discount.service';
import { OrderService } from 'src/app/service/order.service';
import { ICity } from 'src/app/shared/interfaces/city.interface';
import { IDiscount } from 'src/app/shared/interfaces/discounts.interface';
import { IProd } from 'src/app/shared/interfaces/prod.interface';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  myclick = false;
  overflow: string = 'hidden';
  myclick1 = false;
  myPay = false;
  overflow1: string = 'hidden';
  overflowPay: string = 'hidden';
  display: string = 'none';
  isDisplay = false;
  checked
  isDisplayD = 'none'
  isDisplayH = 'none'
  card: string = 'Card';
  cash: string = 'Cash';
  payway: string = 'Choose pay way';
  visibleComment: string = 'Click here to write a comment';
  isComment = false;
  displayC = 'none';
  totalPrice = 0;
  basket: Array<any> = [];
  discounts: Array<IDiscount> = [];
  discount: number = 0;
  checkDisc: boolean;
  isdisabled = false;
  notDiscTotal: number;
  count = 0;
  searchName: string;
  cities: Array<ICity> = [];
  userCity: string = 'Choose your city';
  userRegion: string = 'Choose your region';
  fuser: string = '';
  suser: string = '';
  phoneUser: string = '';
  emailUser: string = '';
  addressBranch: string = '';
  house: string = '';
  street: string = '';
  flOf: string = '';
  comment: string = '';
  id;
  userOrder;
  user;
  constructor(private orderService: OrderService,
    private discService: DiscountService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getLocalProducts();
    this.getDisc();
    this.getCity();
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });
  }
  getCity(): void {
    this.orderService.getAllCity().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.cities = data;
    });
  }

  selectClick(city?: string): void {
    this.myclick = !this.myclick;
    if (this.myclick) {

      this.overflow = 'visible';


    }
    else {
      this.overflow = 'hidden';
      this.userCity = city;
      console.log(this.userCity);
    }
  }
  selectClick1(region?: string): void {
    this.myclick1 = !this.myclick1;
    if (this.myclick1) {

      this.overflow1 = 'visible';

    }
    else {
      this.overflow1 = 'hidden';
      this.userRegion = region;
      console.log(this.userCity);
    }
  }
  chooseCity(city: string): void {
    this.userCity = city
    console.log(city);

    this.cities.forEach(
      elem => {
        console.log(elem.city.toLocaleLowerCase());

        if (elem.city == city) {
          // console.log(());

          this.userRegion = elem.region;
        }
      }
    )
  }
  clickDisplay(): void {
    this.isDisplay = !this.isDisplay
    if (this.isDisplay) {
      this.display = 'flex'
    }
    else {
      this.display = 'none'
    }
  }
  mycheck(status: boolean) {
    console.log(this.checked);
    if (status) {
      this.isDisplayD = 'flex';
      this.isDisplayH = 'none';
      this.checked = status
    }
    else {
      this.isDisplayD = 'none';
      this.isDisplayH = 'flex';
      this.checked = status
    }

  }
  pay(pay: string): void {
    this.payway = pay;
    console.log(this.payway);

    this.selectPay();
  }

  selectPay(): void {
    this.myPay = !this.myPay;
    if (this.myPay) {

      this.overflowPay = 'visible';

    }
    else {
      this.overflowPay = 'hidden';
    }
  }
  commentClick(): void {
    this.isComment = !this.isComment
    if (this.isComment) {
      this.displayC = 'block';

    }
    else {
      this.displayC = 'none'
    }
  }


  // myDisc():void{
  //   if(this.count == 0){
  //     this.getDisc();
  //     console.log('loh');

  //   }
  //   else{
  // console.log('loh');

  //   }
  // }






  private getLocalProducts(): void {
    if (localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket'));
      // this.totalPrice = this.getTotal(this.basket);
      // this.id = JSON.parse(localStorage.getItem('orderId'));
      console.log(this.basket);
      this.id = JSON.parse(localStorage.getItem('orderId'));

    }

  }
  private getTotal(products: Array<IProd>): number {
    return products.reduce((total, prod) => total + (prod.price * prod.count), 0)
  }

  productCount(prod: any, status: boolean): void {
    // this.orderService.getId()
    if (status) {
      this.count = 0;
      prod.count++;
    }
    else {
      if (prod.count > 1) {
        this.count = 0;
        prod.count--;

        this.isdisabled = false;

      }
      this.count = 0;
    }
    this.orderService.basket.next(this.basket);
    localStorage.setItem('basket', JSON.stringify(this.basket))
    // this.totalPrice = this.getTotal(this.basket);
    this.getDisc();

  }
  removeProd(prod: any) {
    if (confirm('Are you sure?')) {
      const index = this.basket.findIndex(product => product.id === prod.id);
      this.basket.splice(index, 1)
      this.totalPrice = this.getTotal(this.basket);
      this.orderService.basket.next(this.basket);
      localStorage.setItem('basket', JSON.stringify(this.basket))
    }


  }


  getDisc() {
    this.basket = JSON.parse(localStorage.getItem('basket'));
    this.discount = 0;
    this.totalPrice = this.discount;
    this.discService.getAllDisc().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.discounts = data;
      this.calcDisc();


    });
  }
  calcDisc(): void {
    if (this.count == 0) {
      this.count++;
      if (this.basket != null) {
        if (localStorage.getItem('user')) {
          for (let i = 0; i < this.discounts.length; i++) {
            for (let j = 0; j < this.basket.length; j++) {
              if (this.discounts[i].product == this.basket[j].mainTitle) {
                this.basket[j].disc = this.basket[j].price * this.basket[j].count - this.basket[j].price * this.basket[j].count * (this.discounts[i].discount / 100 + this.discounts[0].discount / 100);
                this.discount += this.basket[j].price * this.basket[j].count - this.basket[j].price * this.basket[j].count * (this.discounts[i].discount / 100 + this.discounts[0].discount / 100);
                this.checkDisc = true;
                break
              }
              else if (this.discounts[i].product == 'All') {
                // this.discount += this.basket[j].price * this.basket[j].count - this.basket[j].price * this.basket[j].count * (this.discounts[0].discount / 100);
                // this.checkDisc = true;
                console.log(this.discount);
                if (this.basket[j].discount) {

                }
                else {
                  this.discount += this.basket[j].price * this.basket[j].count - this.basket[j].price * this.basket[j].count * (this.discounts[0].discount / 100);
                  this.basket[j].disc = this.basket[j].price * this.basket[j].count - this.basket[j].price * this.basket[j].count * (this.discounts[0].discount / 100);
                  this.checkDisc = true;



                }
              }

            }


          }
          this.orderService.basket.next(this.basket);
          localStorage.setItem('basket', JSON.stringify(this.basket))
          this.totalPrice = this.discount;
          this.notDiscTotal = this.notDisc(this.basket);


        }
        else {
          this.discount = 0;
          this.totalPrice = this.discount;
          for (let i = 0; i < this.discounts.length; i++) {
            for (let j = 0; j < this.basket.length; j++) {

              if (this.discounts[i].product == this.basket[j].mainTitle) {
                this.basket[j].disc = this.basket[j].price * this.basket[j].count - this.basket[j].price * this.basket[j].count * (this.discounts[i].discount / 100)

                // this.basket[j].discount = this.basket[j].price * this.basket[j].count - this.basket[j].price * this.basket[j].count * (this.discounts[i].discount / 100);
                this.discount += this.basket[j].price * this.basket[j].count - this.basket[j].price * this.basket[j].count * (this.discounts[i].discount / 100);;
                this.checkDisc = true;

                break;
              }
            }

          }
          this.basket.forEach(element => {
            if (element.disc > 1) {
              this.checkDisc = true;
            }
            else {
              console.log(element);
              element.disc = 0
              this.discount += element.price * element.count
              this.checkDisc = false;
            }
          });
          this.orderService.basket.next(this.basket);
          localStorage.setItem('basket', JSON.stringify(this.basket))
          this.totalPrice = this.discount;
          this.notDiscTotal = this.notDisc(this.basket);
        }
      }
    }
  }
  private notDisc(products: Array<IProd>): number {
    return products.reduce((total, prod) => total + (prod.price * prod.count), 0)
  }

  addOrder(): void {
    this.id += 1;
    if (this.basket.length > 0) {
      if (!this.checked) {
        this.userOrder =
        {
          product: this.basket,
          id: `${this.id}`,
          fname: this.fuser,
          sname: this.suser,
          phone: this.phoneUser,
          email: this.emailUser,
          city: this.userCity,
          region: this.userRegion,
          branch: this.addressBranch,
          payWay: this.payway,
          price: this.totalPrice,
          data: new Date,
          comments: this.comment,
        };
      }
      else {
        this.userOrder =
        {
          product: this.basket,
          id: `${this.id}`,
          fname: this.fuser,
          sname: this.suser,
          phone: this.phoneUser,
          email: this.emailUser,
          city: this.userCity,
          region: this.userRegion,
          stret: this.street,
          house: this.house,
          flatOffice: this.flOf,
          payWay: this.payway,
          price: this.totalPrice,
          data: new Date,
          comments: this.comment,
        };
      }


      console.log(this.id);


      if (localStorage.getItem('user')) {
        this.user = JSON.parse(localStorage.getItem('user'));
        if (typeof this.user.orders != 'undefined') {
          this.user.orders.push({ ...this.userOrder })
        }
        else {
          this.user.orders = [];
          this.user.orders.push(this.userOrder)
        }
        this.orderService.update(this.user.id, this.user).then(
          () => {
            this.basket = [];
            this.resetForm();

            localStorage.removeItem('basket');
            this.orderService.basket.next(this.basket);
            this.totalPrice = 0;

            // this.toastr.success('Thanks for your orders!', 'Success');
            this.updateLocal();
          }
        )
        this.orderService.updateID(this.id).then(
          () => {
            console.log('dsadas');

          }
        )
        this.orderService.create(this.userOrder).then()

      }
      else {
        this.orderService.updateID(this.id).then(
          () => {
            console.log('dsadas');

          }
        )
        this.orderService.create(this.userOrder).then(
          () => {
            this.basket = [];
            this.resetForm();
            localStorage.removeItem('basket');
            this.orderService.basket.next(this.basket);
            // this.toastr.success('Thanks for your orders!', 'Success');
            this.totalPrice = 0;

          });
      }

    }
    else {
      // this.toastr.error('Please buy something!', 'Denied');
    }

  }

  private updateLocal(): void {
    const update = {
      ...this.user
    }

    localStorage.setItem('user', JSON.stringify(update))
  }

  resetForm(): void {
    this.basket = [];
    this.fuser = '';
    this.suser = '';
    this.phoneUser = '';
    this.emailUser = '';
    this.userCity = '';
    this.userRegion = '';
    this.street = '';
    this.house = '';
    this.flOf = '';
    this.payway = '';
    this.totalPrice = 0;
    this.discount = 0;
    this.comment = '';
  }


}


