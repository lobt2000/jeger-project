import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timeStamp } from 'console';
import { map } from 'rxjs/operators';
import { DiscountService } from 'src/app/service/discount.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';
import { IDiscount } from 'src/app/shared/interfaces/discounts.interface';
import { IProd } from 'src/app/shared/interfaces/prod.interface';
import AOS from 'aos';

@Component({
  selector: 'app-prod-details',
  templateUrl: './prod-details.component.html',
  styleUrls: ['./prod-details.component.scss']
})
export class ProdDetailsComponent implements OnInit {
  product;
  discounts: Array<IDiscount> = [];
  discount: number;
  checkDisc = false;
  inputC: number = 1;
  constructor(private prodService: ProductService,
    private activatedRoute: ActivatedRoute,
    private discService: DiscountService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    AOS.init();
    this.getProd();
    window.scrollTo(0, 0);

  }
  getProd(): void {
    const name = this.activatedRoute.snapshot.paramMap.get('name');
    this.prodService.getOne(name).onSnapshot(
      document => {
        document.forEach(prod => {
          const product = {
            id: prod.id,
            ...prod.data() as IProd
          };
          this.product = product;
          this.getDisc();
          this.style();


        });
      }
    );


  }
  style() {
    document.querySelector('.prod__header--text').innerHTML = this.product.mainText

    if (this.product.urlName == 'Manifest') {
      document.getElementById('prod').style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%,rgba(0, 0, 0, 0.8) 20%,rgba(0, 0, 0, .9) 50%,rgba(0, 0, 0, 1) 100%)';

    }
  }

  inputCount(prod: IProd): void {
    // console.log(this.inputC);
    if(this.inputC > 0){
      prod.count = this.inputC;
    }
    else{
      this.inputC = 1
      prod.count = this.inputC;
    }
    
  }
  getDisc() {

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

          if (this.discounts[i].product == this.product.mainTitle) {
            this.discount = this.discounts[i].discount / 100 + this.discounts[0].discount / 100;
            this.checkDisc = true;
            break
          }
          else if (this.discounts[i].product == "All") {
            this.discount = this.discounts[0].discount / 100;
            this.checkDisc = true

          }
        }
      }
      else {
        for (let i = 0; i < this.discounts.length; i++) {
          if (this.discounts[i].product == this.product.mainTitle) {
            this.discount = this.discounts[i].discount / 100;
            this.checkDisc = true;
            break
          }
          else {
            this.discount = 0;
            this.checkDisc = false;
          }
        }
      }

    });
  }


  prodCount(prod: any, status: boolean): void {
console.log('jhghjg');

    if (status) {
      prod.count++;
    }
    else {
      if (prod.count > 1) {
        prod.count--;
      }
    }
  }

  addToBasket(prod: IProd): void {
    this.orderService.addBasket(prod)
    prod.count = 1;
  }

 

}
