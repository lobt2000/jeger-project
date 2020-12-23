import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/service/product.service';
import { IBlogs } from 'src/app/shared/interfaces/blogs.interface';
import { map } from 'rxjs/operators';
import { IProd } from 'src/app/shared/interfaces/prod.interface';
import { Prod } from 'src/app/shared/classes/prod.model';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  uploadProgress: Observable<number>;
  mainImg: string;
  headerImg: string;
  descImg: string;
  products: Array<IProd> = [];
  mainTitle: string;
  mainText: string;
  urlName: string;
  prodsId: string;
  descTitle: string;
  descText: string;
  editStatus = false;
  sweet: string = '0';
  citrus: string = '0';
  bitter: string = '0';
  aromatic: string = '0';
  price: number;
  count: number = 1;
  disc = {}

  constructor(private storage: AngularFireStorage, private prodService: ProductService) { }

  ngOnInit(): void {
    this.getProd()
  }
  uploadFileMain(event): void {
    console.log(document.querySelectorAll('.formStyle'));
    
    const file = event.target.files[0];
    const filePath = `image/${file.name}`;
    const upload = this.storage.upload(filePath, file);
    this.uploadProgress = upload.percentageChanges();

    upload.then(image => {
      this.storage.ref(`image/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.mainImg = url;
      });
      console.log('Photo added!');

    });
  }
  uploadFileBot(event): void {
    const file = event.target.files[0];
    const filePath = `image/${file.name}`;
    const upload = this.storage.upload(filePath, file);
    this.uploadProgress = upload.percentageChanges();

    upload.then(image => {
      this.storage.ref(`image/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        console.log(url);

        this.headerImg = url
      });
      console.log('Photo added!');

    });
  }
  uploadFileDesc(event): void {
    const file = event.target.files[0];
    const filePath = `image/${file.name}`;
    const upload = this.storage.upload(filePath, file);
    this.uploadProgress = upload.percentageChanges();

    upload.then(image => {
      this.storage.ref(`image/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        console.log(url);

        this.descImg = url
      });
      console.log('Photo added!');

    });
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

    });

  }

  addProd(): void {
    if (this.mainText && this.mainTitle && this.descText && this.descTitle && this.mainImg && this.headerImg && this.urlName && this.price) {
      const newProd = new Prod('1',
        this.mainTitle,
        this.mainText,
        this.urlName,
        this.descTitle,
        this.descText,
        this.aromatic,
        this.sweet,
        this.bitter,
        this.citrus,
        this.mainImg,
        this.headerImg,
        this.descImg,
        this.price,
        this.disc,
        this.count
      )
      delete newProd.id;
      this.prodService.create(newProd)
      this.prodService.updProd.subscribe(
        data => {
          console.log(data);
          newProd.id = data
          this.prodService.update(data, newProd).then(
            () => {
              this.getProd()
            }
          )
        }
      )
      // this.toastr.success('Product add', 'Successed');

      this.resetForm()
    }
    else {
      this.resetForm()
    }

  }
  deleteProd(prod: IProd): void {

    this.prodService.delete(prod.id.toString())
      .then(() => {
console.log('sdfsd');

        // this.toastr.success('Product delete', 'Successed');
        this.getProd()
      })
      .catch(err => {
        // this.toastr.error('Something go wrong', 'Denied');
      });
  }
  editProd(prod: IProd): void {
    this.prodsId = prod.id;
    this.mainTitle = prod.mainTitle;
    this.mainText = prod.mainText;
    this.urlName = prod.urlName;
    this.descTitle = prod.descTitle;
    this.descText = prod.descText;
    this.aromatic = prod.aromatic;
    this.sweet = prod.sweet;
    this.bitter = prod.bitter;
    this.citrus = prod.citrus;
    this.mainImg = prod.mainImg;
    this.headerImg = prod.headerImg;
    this.descImg = prod.descImg;
    this.price = prod.price
    this.count = prod.count
    this.editStatus = true;

  }
  saveProd(): void {
    const saveP = new Prod(
      '1',
      this.mainTitle,
      this.mainText,
      this.urlName,
      this.descTitle,
      this.descText,
      this.aromatic,
      this.sweet,
      this.bitter,
      this.citrus,
      this.mainImg,
      this.headerImg,
      this.descImg,
      this.price,
      this.disc,
      this.count)
    saveP.id = this.prodsId;
    this.prodService.update(saveP.id, saveP)
      .then(() => {
        // this.toastr.success('Product update', 'Successed');
        this.getProd()
      })
      .catch(err => {
        // this.toastr.error('Something go wrong', 'Denied');
      });
    this.resetForm();
    this.editStatus = false;
  }
  resetForm() {
    this.mainText = '';
    this.mainTitle = '';
    this.descTitle = '';
    this.descText = '';
    this.headerImg = '';
    this.mainImg = '';
    this.descImg = '';
    this.urlName = '';
    this.sweet = '0';
    this.citrus = '0';
    this.bitter = '0';
    this.aromatic = '0';
    this.price = 0;
    this.count = 1;
  }
}
