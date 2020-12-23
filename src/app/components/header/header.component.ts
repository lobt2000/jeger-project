import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { DiscountService } from 'src/app/service/discount.service';
import { HeaderService } from 'src/app/service/header.service';
import { OrderService } from 'src/app/service/order.service';
import { IDiscount } from 'src/app/shared/interfaces/discounts.interface';
import { IProd } from 'src/app/shared/interfaces/prod.interface';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenu = true;
  backImg = "url('../../../assets/image/times-solid.svg')"
  transition = 'translate3d(0,0,0)';
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
  userEmail: string;
  userPassword: string;
  userFname: string;
  userSname: string;
  inputUser: string;
  inputPass: string;
  cardNumber: number = 19360;
  // isUserLog = true ;
  isUser = false;
  isBasket = false;
  transformO = 'translate3d(0,-150%,0)';
  colorO = 'transparent';
  positionO = 'unset';
  transformB = 'translate3d(0,-150%,0)';
  colorB = 'transparent';
  positionB = 'unset';
  totalPrice = 0;
  basket: any = [];
  discounts: Array<IDiscount> = [];
  discount: number = 0;
  checkDisc: boolean;
  isdisabled = false;
  constructor(private headService: HeaderService,
    private authService: AuthService,
    private orderService: OrderService,
    private discService: DiscountService,
  ) { }

  ngOnInit(): void {
    // this.checkUserLogin();
    this.checkLocalUser();
    this.getLocalProducts();
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
    // console.log(this.isSignIn);

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
    // console.log(this.isSignIn);

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
      this.getDisc();
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
  // private checkUserLogin(): void {

  //   this.authService.checkUser()

  //     this.authService.checkSign.subscribe((data) => {
  //     console.log(data);

  //     if (typeof data === 'string') {
  //       if (data == 'user') {
  //         this.admin = false;
  //         this.userSign = true;
  //         this.isUser = true;
  //         console.log(this.isUser);
  //         // this.toastr.success('Hello user!', 'Success');

  //       }
  //       else if (data == 'admin') {
  //         this.admin = true;
  //         this.userSign = true;
  //         this.isUser = true;
  //         console.log(data);
  //         // this.up = false
  //         // this.toastr.success('Hello admin!', 'Success');

  //       }
  //     }
  //     else {
  //       this.admin = data;
  //       this.userSign = data;
  //       this.isUser = data;

  //       // this.admin = data
  //       console.log(data);
  //       // this.toastr.error('You write invalid data!', 'Denied');

  //     }
  //     this.checkLocalUser();
  //   })
  // }
  private checkLocalUser(): void {

    if (localStorage.getItem('user')) {

      if (JSON.parse(localStorage.getItem('user')).role == 'user') {
        this.admin = false;
        this.userSign = true;
        this.isUser = true;
        // console.log("isUser", this.isUser);
        // this.toastr.success('Hello user!', 'Success');
      }
      else {
        this.admin = true;
        this.userSign = true;
        this.isUser = true;


        // this.up = true;
        // this.toastr.success('Hello admin!', 'Success');

      }

    }
    else {
      this.admin = false;
      this.userSign = false;
      this.isUser = false;

      // this.admin = false
      // this.toastr.error('You write invalid data!', 'Denied');
    }
  }


  signUP(): void {


    if (this.userEmail && this.userPassword && this.userSname && this.userFname) {
      this.cardNumber += 1;
      this.authService.signUp(this.userEmail, this.userPassword, this.userFname, this.userSname, this.cardNumber)
      this.checkLocalUser();
      this.authService.checkSign.subscribe((data) => {
        if (data == 'user') {
          this.admin = false;
          this.userSign = true;
          this.isUser = true;
          // this.toastr.success('You log success!', 'Success');

        }
        else {
          this.userSign = data
          this.admin = data
          this.isUser = data;

          // this.admin = data
          // this.toastr.error('You write invalid data!', 'Denied');

        }
      })
      this.authService.updateID(this.cardNumber).then(
        () => {
        }
      )
      this.resetForm();
    }
    else {
      this.userSign = false;
      this.isUser = false;

      this.resetForm();
      // this.toastr.error('You write invalid data!', 'Denied');
    }
  }
  signIN(): void {
    if (this.inputUser && this.inputPass) {
      this.authService.signIn(this.inputUser, this.inputPass)
      this.authService.checkSign.subscribe(
        data => {
          if (localStorage.getItem('user')) {
            // console.log(this.localUser);
            if (JSON.parse(localStorage.getItem('user')).role == 'admin') {
              this.admin = true
              this.userSign = true;
              this.isUser = true;

              this.resetForm()
              // this.toastr.success('You log as admin!', 'Hello admin');
            }
            else {
              this.admin = false;
              this.userSign = true;
              this.isUser = true;

              this.resetForm();
              // this.toastr.success('You log as user!', 'Hello user');
            }
          }
          else {
            this.admin = false;
            this.userSign = false;
            this.isUser = false;

            this.resetForm();
            // this.toastr.error('You write invalid data!', 'Denied');

          }
        }
      )


    }
    else {
      // this.toastr.error('You write invalid data!', 'Denied');
      this.resetForm();
    }
    this.checkLocalUser();
  }
  signOUT(): void {
    this.authService.signOut();
    this.userSign = false;
    this.admin = false;
    this.isUser = false;

    this.resetForm();
    // this.toastr.success('You sign out!', 'GoodBye');

  }
  resetForm(): void {
    this.inputUser = '';
    this.inputPass = '';
    this.userFname = '';
    this.userSname = '';
    this.userEmail = '';
    this.userPassword = '';
  }

  private getLocalProducts(): void {
    if (localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket'));
      this.totalPrice = this.getTotal(this.basket);
      // this.id = JSON.parse(localStorage.getItem('orderId'));
console.log(this.basket);

    }

  }
  private getTotal(products: Array<IProd>): number {
    return products.reduce((total, prod) => total + (prod.price * prod.count), 0)
  }

  productCount(prod: any, status: boolean): void {
    // this.orderService.getId()
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

      if (localStorage.getItem('user')) {
        for (let i = 0; i < this.discounts.length; i++) {
          for (let j = 0; j < this.basket.length; j++) {
            if (this.discounts[i].product == this.basket[j].mainTitle) {
              this.basket[j].disc = this.basket[j].price * this.basket[j].count - this.basket[j].price * this.basket[j].count * (this.discounts[i].discount / 100 + this.discounts[0].discount / 100 );
              this.discount += this.basket[j].price * this.basket[j].count - this.basket[j].price * this.basket[j].count * (this.discounts[i].discount / 100 + this.discounts[0].discount / 100 );
              this.checkDisc = true;
              break
            }
            else if (this.discounts[i].product == 'All') {
              // this.discount += this.basket[j].price * this.basket[j].count - this.basket[j].price * this.basket[j].count * (this.discounts[0].discount / 100);
              // this.checkDisc = true;
              console.log(this.discount);
              if (this.basket[j].discount) {

              }
              else{
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
      }
      else {
        this.discount = 0;
        this.totalPrice = this.discount;
        for (let i = 0; i < this.discounts.length; i++) {
          for (let j = 0; j < this.basket.length; j++) {
            
            if (this.discounts[i].product == this.basket[j].mainTitle) {
              this.basket[j].disc =  this.basket[j].price * this.basket[j].count - this.basket[j].price * this.basket[j].count * (this.discounts[i].discount / 100)

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
      }

    });
  }
}

