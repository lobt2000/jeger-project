import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { map } from 'rxjs/operators';
import { DiscountService } from 'src/app/service/discount.service';
import { ProductService } from 'src/app/service/product.service';
import { Discount } from 'src/app/shared/classes/discounts.model';
import { IDiscount } from 'src/app/shared/interfaces/discounts.interface';
import { IProd } from 'src/app/shared/interfaces/prod.interface';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {
  all: string = 'All';
  productName: string;
  products: Array<IProd> = [];
  discounts: Array<IDiscount> = [];
  disc: number = 0;
  discId: any;
  editStatus = false;
  check: boolean
  constructor(private prodService: ProductService, private discService: DiscountService) { }

  ngOnInit(): void {
    this.getProd();
    this.getDiscount();
  }

  getProd(): void {
    this.prodService.getAllProds().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.products = data;
      console.log(data);


    });

  }
  getDiscount(): void {
    this.discService.getAllDisc().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.discounts = data;

    });

  }

  checkdisc(): void {
    for (let i = 0; i < this.discounts.length; i++) {
      if (this.discounts[i].product == this.productName) {
        this.check = false;
        break;
      }
      else {
        this.check = true;
      }
    }
    this.addDisc(this.check);

  }
  checkSavedisc(): void {
    for (let i = 0; i < this.discounts.length; i++) {
      if (this.discounts[i].product == this.productName && this.discounts[i].discount == this.disc) {
        this.check = false;
        break;
      }
      else {
        this.check = true;
      }
    }

    this.saveDisc(this.check);
  }

  addDisc(status: boolean): void {
    console.log(this.productName);

    if (this.disc) {
      if (!status) {
        console.log('There is already a discount on this product');
        // this.toastr.error('There is already a discount on this product', 'Denied');
        this.resetForm()
      }
      else {

        const newDisc = {id:'1',
        product:  this.productName,
         discount:  this.disc,
      }
        delete newDisc.id;
        this.discService.create(newDisc)
        this.discService.updProd.subscribe(
          data => {
            console.log(data);
            newDisc.id = data
            this.discService.update(data, newDisc).then(

              () => {
                this.products.forEach(
                  element => {
                   if(element.mainTitle == newDisc.product ){
                    element.discount = newDisc
                    console.log(element);
                    
                     this.prodService.update(element.id, {...element})
                     this.getProd();
                   }
                  }
                )
                
                this.getDiscount();
                this.resetForm()

              }
            )
          }
        )
      }
    }
    else {
      this.resetForm()
    }

  }
  deleteDisc(disc: IDiscount): void {

    this.discService.delete(disc.id.toString())
      .then(() => {
        // this.toastr.success('Product delete', 'Successed');
        this.getDiscount()
      })
      .catch(err => {
        // this.toastr.error('Something go wrong', 'Denied');
      });
  }
  deleteOne(disc: IDiscount): void {

    this.discService.delete(disc.id.toString())
      .then(() => {
        this.products.forEach(
          element => {
           if(element.mainTitle == disc.product ){
            console.log(element);
            element.discount = {}
             this.prodService.update(element.id, {...element})
             this.getProd();
             this.getDiscount();
           }
          }
        )
        // this.toastr.success('Product delete', 'Successed');
      })
      .catch(err => {
        // this.toastr.error('Something go wrong', 'Denied');
      });
  }
  editDisc(disc: IDiscount, id:any): void {
    this.discId = disc.id;
    this.productName = disc.product;
    this.disc = disc.discount;
    this.editStatus = true;
    this.deleteOne(disc)
    
  }
  saveDisc(status: boolean): void {
    console.log('There is already a discount on this product');
    // this.toastr.error('There is already a discount on this product', 'Denied');
    if (!status) {
      this.resetForm();
    }
    else {
      const saveD = new Discount(
        '1',
        this.productName,
        this.disc)
      saveD.id = this.discId;
      this.discService.create(saveD)
      this.discService.updProd.subscribe(
        data => {
          console.log(data);
          saveD.id = data
          this.discService.update(data, saveD).then(
            () => {
              this.products.forEach(
                element => {
                 if(element.mainTitle == saveD.product ){
                  console.log(element);
                  element.discount = saveD
                   this.prodService.update(element.id, {...element})
                   this.getProd();
                 }
                }
              )
             

            }
          )
        }
      )
      this.resetForm();
      this.editStatus = false;
    }

  }
  resetForm() {
    this.productName = '';
    this.disc = 0;

  }

}
