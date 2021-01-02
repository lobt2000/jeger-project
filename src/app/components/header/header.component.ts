import { Component, HostListener, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { DiscountService } from 'src/app/service/discount.service';
import { HeaderService } from 'src/app/service/header.service';
import { OrderService } from 'src/app/service/order.service';
import { IDiscount } from 'src/app/shared/interfaces/discounts.interface';
import { IProd } from 'src/app/shared/interfaces/prod.interface';
import * as $ from "jquery";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenu = false;
  backImg = "url('../../../assets/image/bars-solid.svg')"
  transition = 'translate3d(-100%,0,0)';
  isSignIn = false;
  isSignUp = false;
  isSignOut = false
  transformU = 'translate3d(100%,0,0)';
  colorU = 'transparent';
  positionU = 'unset';
  transformI = 'translate3d(100%,0,0)';
  colorI = 'transparent';
  positionI = 'unset';
  userSign = false;
  admin = false;
  userEmail: string = '';
  userPassword: string = '';
  userFname: string = '';
  userSname: string = '';
  inputUser: string = '';
  inputPass: string = '';
  isUser = false;
  isBasket = false;
  transformO = 'translate3d(0,-150%,0)';
  colorO = 'transparent';
  positionO = 'unset';
  transformB = 'translate3d(0,-150%,0)';
  colorB = 'transparent';
  positionB = 'unset';
  totalPrice = 0;
  basket: Array<any> = [];
  discounts: Array<IDiscount> = [];
  discount: number = 0;
  checkDisc: boolean;
  isdisabled = false;
  regExpEmail = /^[a-z0-9\-\.]{1,}@gmail\.com|net\.us|org\.ua$/i;
  regExpPass = /^[a-zA-Z0-9]{6,15}$/;
  regExpFname = /^[a-z]{2,}$/i;
  regExpSname = /^[a-z]{2,}$/i;
  scrollPos: number = 0;
  constructor(private headService: HeaderService,
    private authService: AuthService,
    private orderService: OrderService,
    private discService: DiscountService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getDisc();
    this.checkLocalUser();
    this.getLocalProducts();
    window.scrollTo(0,0);
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    let st = $(window).scrollTop();
    if (st > this.scrollPos) {
      $('.navBar').css('top', '-80px');
      $('.navBar').css('transition', 'top 600ms ease-in-out');
    } else {
      $('.navBar').css('top', '1px');
      $('.navBar').css('transition', 'top 600ms ease-in-out');

    }
    this.scrollPos = st;
  }




  apearMenu(): void {
    this.isMenu = !this.isMenu
    if (window.innerWidth < 990) {
      if (this.isMenu) {
        this.transition = 'translate3d(0%,0,0)';
        this.backImg = "url('../../../assets/image/times-solid.svg')";
      }
      else {
        this.transition = 'translate3d(-100%,0,0)';
        this.backImg = "url('../../../assets/image/bars-solid.svg')";
      }
    }
    else {
      this.transition = 'translate3d(0,0,0)';
      this.backImg = "url('../../../assets/image/bars-solid.svg')";
    }

  }
  modalSignIn(): void {
    this.isSignIn = !this.isSignIn;

    if (this.isSignIn) {
      this.transformI = 'translate3d(0%,0,0)';
      this.colorI = "rgba(0, 0, 0, .7)";
      this.positionI = 'fixed';
    }
    else {
      this.transformI = 'translate3d(100%,0,0)';
      this.colorI = "transparent";
      this.positionI = 'fixed';
      setTimeout(() => {
        this.positionI = 'unset';
      }, 600);

    }
  }
  modalSignUp(): void {
    this.isSignUp = !this.isSignUp;
    if (this.isSignUp) {
      this.transformU = 'translate3d(0%,0%,0)';
      this.colorU = "rgba(0, 0, 0, .7)";
      this.positionU = 'fixed';
    }
    else {
      this.transformU = 'translate3d(100%,0,0)';
      this.colorU = "transparent";
      this.positionU = 'fixed';
      if (window.innerWidth < 696) {
        setTimeout(() => {
          this.positionU = 'unset';
        }, 1000);
      }
      else {
        setTimeout(() => {
          this.positionU = 'unset';
        }, 600);
      }


    }
  }

  modalSignOut(): void {
    this.isSignOut = !this.isSignOut;
    if (this.isSignOut) {
      this.transformO = 'translate3d(0,50%,0)';
      this.colorO = "rgba(0, 0, 0, .7)";
      this.positionO = 'fixed';
    }
    else {
      this.transformO = 'translate3d(0,-150%,0)';
      this.colorO = "transparent";
      this.positionO = 'fixed';
      if (window.innerWidth < 696) {
        setTimeout(() => {
          this.positionO = 'unset';
        }, 1000);
      }
      else {
        setTimeout(() => {
          this.positionO = 'unset';
        }, 600);
      }


    }
  }
  modalBasket(): void {
    this.isBasket = !this.isBasket;
    if (this.isBasket) {
      this.transformB = 'translate3d(0, 0%,0)';
      this.colorB = "rgba(0, 0, 0, .7)";
      this.positionB = 'fixed';
      this.calcDisc();
    }
    else {
      this.transformB = 'translate3d(0,-150%,0)';
      this.colorB = "transparent";
      this.positionB = 'fixed';
      if (window.innerWidth < 696) {
        setTimeout(() => {
          this.positionB = 'unset';
        }, 1000);
      }
      else {
        setTimeout(() => {
          this.positionB = 'unset';
        }, 600);
      }


    }
  }

  private checkLocalUser(): void {

    if (localStorage.getItem('user')) {

      if (JSON.parse(localStorage.getItem('user')).role == 'user') {
        this.admin = false;
        this.userSign = true;
        this.isUser = true;
      }
      else {
        this.admin = true;
        this.userSign = true;
        this.isUser = true;

      }

    }
    else {
      this.admin = false;
      this.userSign = false;
      this.isUser = false;
    }
  }


  signUP(): void {


    if (this.userEmail && this.userPassword && this.userSname && this.userFname) {
      if (this.regExpEmail.test(this.userEmail) && this.regExpPass.test(this.userPassword) && this.regExpSname.test(this.userSname) && this.regExpFname.test(this.userFname)) {
        this.authService.signUp(this.userEmail, this.userPassword, this.userFname, this.userSname)
        this.checkLocalUser();
        this.authService.checkSign.subscribe((data) => {
          if (data == 'user') {
            this.admin = false;
            this.userSign = true;
            this.isUser = true;
            this.toastr.success('You log success!', 'Success');
            this.calcDisc();

          }
          else {
            this.userSign = data
            this.admin = data
            this.isUser = data;
            this.calcDisc();

            this.toastr.error('You write invalid data!', 'Denied');

          }
        })
      
        this.resetForm();

      }
      else {
        this.toastr.error('You write invalid data!', 'Denied');
        this.resetForm();

      }



      this.resetForm();
    }
    else {
      this.userSign = false;
      this.isUser = false;
      this.calcDisc();
      this.resetForm();
      this.toastr.error('You write invalid data!', 'Denied');
    }
  }
  signIN(): void {
    if (this.inputUser && this.inputPass) {
      if (this.regExpEmail.test(this.inputUser)) {
        if (this.regExpPass.test(this.inputPass)) {
          this.authService.signIn(this.inputUser, this.inputPass)
          this.authService.checkSign.subscribe(
            data => {
              if (localStorage.getItem('user')) {
                if (JSON.parse(localStorage.getItem('user')).role == 'admin') {
                  this.admin = true
                  this.userSign = true;
                  this.isUser = true;
                  this.calcDisc();
                  this.resetForm()
                  this.toastr.success('You log as admin!', 'Hello admin');
                }
                else {
                  this.admin = false;
                  this.userSign = true;
                  this.isUser = true;
                  this.calcDisc();

                  this.resetForm();
                  this.toastr.success('You log as user!', 'Hello user');
                }
              }
              else {
                this.admin = false;
                this.userSign = false;
                this.isUser = false;
                this.calcDisc();

                this.resetForm();
                this.toastr.error('You write invalid data!', 'Denied');

              }
            }
          )
        }
        else {
          this.resetForm();
          this.toastr.error('You write invalid password!', 'Denied');
        }

      }
      else {
        this.toastr.error('You write invalid user email!', 'Denied');
        this.resetForm();
      }



    }
    else {
      this.toastr.error('You write invalid data!', 'Denied');
      this.resetForm();
    }
    this.checkLocalUser();
  }
  signOUT(): void {
    this.authService.signOut()
    this.userSign = false;
    this.admin = false;
    this.isUser = false;
    this.resetForm();



    this.toastr.success('You sign out!', 'GoodBye');

  }
  resetForm(): void {
    this.inputUser = '';
    this.inputPass = '';
    this.userFname = '';
    this.userSname = '';
    this.userEmail = '';
    this.userPassword = '';
  }
  regCheck(): boolean {
    return this.regExpEmail.test(this.inputUser);

  }
  regCheckPass(): boolean {
    return this.regExpPass.test(this.inputPass);

  }
  regCheckUPass(): boolean {
    return this.regExpPass.test(this.userPassword);

  }
  regCheckUEmail(): boolean {
    return this.regExpEmail.test(this.userEmail);

  }
  regCheckFname(): boolean {
    return this.regExpFname.test(this.userFname);

  }
  regCheckSname(): boolean {
    return this.regExpSname.test(this.userSname);

  }


  private getLocalProducts(): void {
    if (localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket'));
    }

  }
  private getTotal(products: Array<IProd>): number {
    return products.reduce((total, prod) => total + (prod.price * prod.count), 0)
  }

  productCount(prod: any, status: boolean): void {
    if (status) {
      prod.count++;
    }
    else {
      if (prod.count > 1) {
        prod.count--;

        this.isdisabled = false;

      }
    }
    this.orderService.basket.next(this.basket);
    localStorage.setItem('basket', JSON.stringify(this.basket))
    this.calcDisc();
    // this.getDisc();

  }
  removeProd(prod: any) {
    if (confirm('Are you sure?')) {
      const index = this.basket.findIndex(product => product.id === prod.id);
      this.basket.splice(index, 1)
      this.totalPrice = this.getTotal(this.basket);
      this.orderService.basket.next(this.basket);
      localStorage.setItem('basket', JSON.stringify(this.basket));

    }


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
        }
      )
  }
}

