import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { HeaderService } from 'src/app/service/header.service';


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
  transformO = 'translate3d(0,-150%,0)';
  colorO = 'transparent';
  positionO = 'unset';
  constructor(private headService: HeaderService, private authService: AuthService) { }

  ngOnInit(): void {
    // this.checkUserLogin();
    this.checkLocalUser();
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
    console.log(this.isSignIn);

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
    console.log(this.isSignIn);

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
      console.log(localStorage.getItem('user'));
      console.log(JSON.parse(localStorage.getItem('user')).role);
      
      if (JSON.parse(localStorage.getItem('user')).role == 'user') {
        console.log('fdsfsdfsd');
        
        this.admin = false;
        this.userSign = true;
        this.isUser = true;
        console.log("isUser", this.isUser);
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
      console.log("isUser", this.isUser);

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
        console.log(data);

        if (data == 'user') {
          this.admin = false;
          this.userSign = true;
          this.isUser = true;

          console.log(data);
          // this.toastr.success('You log success!', 'Success');

        }
        else {
          this.userSign = data
          this.admin = data
          this.isUser = data;

          // this.admin = data
          console.log(data);
          // this.toastr.error('You write invalid data!', 'Denied');

        }
      })
      this.authService.updateID(this.cardNumber).then(
        () => {
          console.log('dsadas');

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
        data =>{
          if (localStorage.getItem('user')) {
            // console.log(this.localUser);
            console.log(localStorage.getItem('user'));
    
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
            console.log(this.isUser);
    
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


}

