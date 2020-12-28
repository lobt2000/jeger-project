import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  id = 'TV6VV6OblUW4DQslkA6G';
  number;
  localUser: any;
  private dbPath = '/users';
  checkSign: Subject<any> = new Subject<any>();
  profRef: AngularFirestoreCollection<any> = null;
  private dbPath1 = '/cardNumber';
  cardNumbRef: AngularFirestoreCollection<any> = null;
  constructor(private db: AngularFirestore,
    private auth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router) {
    this.profRef = this.db.collection(this.dbPath);
    this.cardNumbRef = this.db.collection(this.dbPath1);
  }


  signUp(email: string, password: string, userFname: string, userSname: string, cardNum: number): void {
    this.auth.createUserWithEmailAndPassword(email, password)

      .then(userResponse => {
        const user = {
          email: userResponse.user.email,
          password: password,
          role: 'user',
          firstName: userFname,
          secondName: userSname,
          cardNumber: cardNum,
          image: 'https://firebasestorage.googleapis.com/v0/b/admin-blog-f6b6a.appspot.com/o/images%2FPngItem_1468479.png?alt=media&token=ff01da5f-daf1-4479-803e-e811324e50b0',
        }

        this.db.collection('users').add(user)
          .then(collection => {
            collection.get()
              .then(user => {
                const myUser = {
                  id: user.id,
                  ...user.data() as any
                }
                localStorage.setItem('user', JSON.stringify(myUser))
                this.localUser = JSON.parse(localStorage.getItem('user'))
                if (this.localUser.role === 'user') {
                  this.checkSign.next('user');
                  this.router.navigateByUrl('profile');
                }
                else if (this.localUser.role === 'admin') {
                  this.router.navigateByUrl('admin');
                  this.checkSign.next(true);
                }
                else {
                  this.checkSign.next(false);
                  this.router.navigateByUrl('blog');

                }
              })
          })

      })

      .catch(
        err => {
          console.log(err);
          this.toastr.error('You write invalid password!', 'Denied');

        }
      )
  }

  signIn(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(userResponse => {
        this.db.collection('users').ref.where('email', '==', userResponse.user.email).onSnapshot(
          snap => {
            snap.forEach(userRef => {
              const myUser = {
                id: userRef.id,
                ...userRef.data() as any

              }
              localStorage.setItem('user', JSON.stringify(myUser))
              this.localUser = JSON.parse(localStorage.getItem('user'))
              if (this.localUser.role === 'admin') {
                this.router.navigateByUrl('admin');
                this.checkSign.next(true);
              }
              else if (this.localUser.role === 'user') {
                this.checkSign.next('user');
                this.router.navigateByUrl('profile');

              }
              else {
                this.checkSign.next(false);
                this.router.navigateByUrl('home');
              }
            })
          }
        )
      })
      .catch(
        () => {
          this.toastr.error('You write invalid password!', 'Denied');

        }

      )
  }
  checkUser(): void {
    if (localStorage.getItem('user')) {
      this.localUser = JSON.parse(localStorage.getItem('user'))
      if (this.localUser.role === 'user') {
        this.checkSign.next('user');

      }
      else if (this.localUser.role === 'admin') {
        this.checkSign.next('admin');
      }
      else {
        this.checkSign.next(false);

      }
    }
    else {
      this.checkSign.next(false);
    }

  }

  signOut(): void {
    this.auth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.router.navigateByUrl('home');
      })
  }



  updateID(data: any): Promise<void> {
    const ordId = {
      id: data
    }
    localStorage.setItem('cardId', JSON.stringify(data))
    return this.cardNumbRef.doc(this.id).update(ordId);
  }
  getUser(): Observable<any> {
    return JSON.parse(localStorage.getItem('user'));
  }
  update(id: string, data: any): Promise<void> {
    return this.profRef.doc(id).update({ ...data });
  }


  getId(): any {

    this.cardNumbRef.doc(this.id).get().subscribe(
      data => {
        this.number = data.data()

        localStorage.setItem('cardId', JSON.stringify(this.number.id))

      }
    )

  }
}
