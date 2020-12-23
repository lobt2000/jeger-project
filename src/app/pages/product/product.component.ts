import { Component, HostListener, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ProductService } from 'src/app/service/product.service';
import { IProd } from 'src/app/shared/interfaces/prod.interface';
import AOS from 'aos'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
products: Array<IProd>
  constructor(private prodService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
    AOS.init();
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    let scroll = window.scrollY;
    console.log(scroll);
    
  }
  getProducts(){
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


 
}
