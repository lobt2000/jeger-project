import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { map } from 'rxjs/operators';
import { DiscountService } from 'src/app/service/discount.service';
import { OrderService } from 'src/app/service/order.service';
import { ICity } from 'src/app/shared/interfaces/city.interface';
import { IDiscount } from 'src/app/shared/interfaces/discounts.interface';
import { IProd } from 'src/app/shared/interfaces/prod.interface';

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
  angle: string = '../../../assets/image/angle-down-solid.svg';
  angle1: string = '../../../assets/image/angle-down-solid.svg';
  anglePay: string = '../../../assets/image/angle-down-solid.svg';
  id;
  userOrder;
  user;
  regExpEmail = /^[a-z0-9\-\.]{1,}@gmail\.com|net\.us|org\.ua$/i;
  regExpFname = /^[a-z]{2,}$/i;
  regExpSname = /^[a-z]{2,}$/i;
  regExpPhone = /^[0-9]{1,10}$/i;
  regExpBranch = /^[a-zA-Z0-9\,\ ]{3,}$/;
  constructor(private orderService: OrderService,
    private discService: DiscountService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.getLocalProducts();
    this.getDisc();
    this.getCity();
    this.getProfile();
    window.scrollTo(0, 0);

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
  getProfile(): void {
    if (localStorage.getItem('user')) {

      this.user = JSON.parse(localStorage.getItem('user'));
      this.orderService.getUser(this.user.id).subscribe(
        data => {
          this.user = data.data();
          this.phoneUser = this.user.phone;
          this.emailUser = this.user.email;
          this.fuser = this.user.firstName;
          this.suser = this.user.secondName;
        }
      )

    }
  }

  selectClick(city?: string): void {
    this.myclick = !this.myclick;
    if (this.myclick) {
      this.angle = '../../../assets/image/angle-up-solid.svg';
      this.overflow = 'visible';


    }
    else {
      this.angle = '../../../assets/image/angle-down-solid.svg';
      this.overflow = 'hidden';

    }
  }
  select(city?: string): void {
    this.userCity = city;
    this.selectClick();
  }
  selectClick1(): void {
    this.myclick1 = !this.myclick1;
    if (this.myclick1) {
      this.angle1 = '../../../assets/image/angle-up-solid.svg';
      this.overflow1 = 'visible';

    }
    else {
      this.angle1 = '../../../assets/image/angle-down-solid.svg';
      this.overflow1 = 'hidden';

    }
  }

  select1(region?: string): void {
    this.userRegion = region;
    this.selectClick1();
  }
  chooseCity(city: string): void {
    this.userCity = city
    this.cities.forEach(
      elem => {

        if (elem.city == city) {

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
    this.selectPay();
  }

  selectPay(): void {
    this.myPay = !this.myPay;
    if (this.myPay) {
      this.anglePay = '../../../assets/image/angle-up-solid.svg';
      this.overflowPay = 'visible';

    }
    else {
      this.anglePay = '../../../assets/image/angle-down-solid.svg';

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


  private getLocalProducts(): void {
    if (localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket'));
      this.id = JSON.parse(localStorage.getItem('orderId'));
      this.calcDisc();
    }

  }
  private getTotal(products: Array<IProd>): number {
    return products.reduce((total, prod) => total + (prod.price * prod.count), 0)
  }

  productCount(prod: any, status: boolean): void {
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
    this.calcDisc();

  }
  removeProd(prod: any) {
    if (confirm('Are you sure?')) {
      const index = this.basket.findIndex(product => product.id === prod.id);
      this.basket.splice(index, 1)
      this.totalPrice = this.getTotal(this.basket);
      this.orderService.basket.next(this.basket);
      localStorage.setItem('basket', JSON.stringify(this.basket));
      this.count = 0;
      this.getLocalProducts();
      this.calcDisc();
    }


  }
  regCheckEmail(): boolean {
    return this.regExpEmail.test(this.emailUser);

  }
  regCheckFname(): boolean {
    return this.regExpFname.test(this.fuser);

  }
  regCheckSname(): boolean {
    return this.regExpSname.test(this.suser);

  }
  regCheckPhone(): boolean {
    return this.regExpPhone.test(this.phoneUser);

  }
  regCheckBranch(): boolean {
    return this.regExpBranch.test(this.addressBranch);

  }

  getDisc() {
    this.orderService.getDisc()
   this.orderService.checkDisc.subscribe(
     (data) =>{
      if(data){
        this.calcDisc();
      }
     }
   )
  }
  calcDisc(): void {  
      this.totalPrice = this.orderService.calcDisc();
      this.orderService.basket.subscribe(
        data =>{
          this.basket = data;
          this.notDiscTotal = this.notDisc(this.basket);
          
        }
      )
  }
  private notDisc(products: Array<IProd>): number {
    return products.reduce((total, prod) => total + (prod.price * prod.count), 0)
  }

  addOrder(): void {
    this.id += 1;
    if (this.basket.length > 0) {
      if(this.regExpEmail.test(this.emailUser) && this.regExpFname.test(this.fuser) && this.regExpSname.test(this.suser) &&  this.regExpPhone.test(this.phoneUser) && this.regExpBranch.test(this.addressBranch)){
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
              this.toastr.success('Thanks for your orders!', 'Success');
              this.router.navigateByUrl('home');
  
              this.updateLocal();
            }
          )
          this.orderService.updateID(this.id).then(
            () => {
            }
          )
          this.orderService.create(this.userOrder).then()
          this.resetForm();
  
        }
        else {
          this.orderService.updateID(this.id).then(
            () => {
            }
          )
          this.orderService.create(this.userOrder).then(
            () => {
              this.basket = [];
              this.resetForm();
              localStorage.removeItem('basket');
              this.orderService.basket.next(this.basket);
              this.toastr.success('Thanks for your orders!', 'Success');
              this.router.navigateByUrl('home');
  
              this.totalPrice = 0;
            });
        }
  
      }
      else{
        this.toastr.error('Please buy something!', 'Denied');
        this.resetForm();
      }
     
    }
    else {
      this.toastr.error('Please buy something!', 'Denied');
      this.resetForm();
    }
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });
    this.resetForm();
    this.getLocalProducts();
    this.calcDisc();
    this.getCity();
    this.getProfile();
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


