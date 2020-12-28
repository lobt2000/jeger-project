import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/service/auth.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profUser;
  userImage: string = 'No data';
  orders;
  isEdit = false;
  isOrder = false;
  regExpEmail = /^[a-z0-9\-\.]{1,}@gmail\.com|net\.us|org\.ua$/i;
  regExpPhone = /^[0-9]{6,10}$/;
  regExpFname = /^[a-z]{2,}$/i;
  regExpSname = /^[a-z]{2,}$/i;
  constructor(private profService: AuthService,
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.getProfile();
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });
  }

  getProfile(): void {

    this.profUser = JSON.parse(localStorage.getItem('user'))
    this.orderService.getUser(this.profUser.id).subscribe(
      data => {
        this.profUser = data.data();
        if (this.profUser.orders) {
          this.isOrder = true;
        }
        else {
          this.isOrder = false;
        }
      }
    )



  }
  regCheckPhone(): boolean {
    return this.regExpPhone.test(this.profUser.phone);

  }
  regCheckEmail(): boolean {
    return this.regExpEmail.test(this.profUser.email);

  }
  regCheckFname(): boolean {
    return this.regExpFname.test(this.profUser.firstName);

  }
  regCheckSname(): boolean {
    return this.regExpSname.test(this.profUser.secondname);

  }
  edit(): void {
    this.isEdit = !this.isEdit
  }
  save(): void {
    if (this.profUser.email.length > 0) {
      this.profService.update(this.profUser.id, this.profUser).then(
        () => {
          this.updateLocal(this.profUser)
        }
      )
    }

  }
  private updateLocal(data): void {
    const update = {
      ...this.profUser,
      ...data
    }
    localStorage.setItem('user', JSON.stringify(update))
    this.edit();
  }
  orderMore(product: any): void {
    product.forEach(element => {
      this.orderService.addBasket(element)

    });

  }
  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);


    task.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.profUser.image = url;


      });
    });
  }

}
