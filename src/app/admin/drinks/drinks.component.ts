import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { DrinksService } from 'src/app/service/drinks.service';
import { map } from 'rxjs/operators';
import { IDrinks } from 'src/app/shared/interfaces/drinks.interface';
import { Drinks } from 'src/app/shared/classes/drinks.model';
@Component({
  selector: 'app-drinks',
  templateUrl: './drinks.component.html',
  styleUrls: ['./drinks.component.scss']
})
export class DrinksComponent implements OnInit {
  counts: number;
  ingredients: Array<any> = [];
  countStep:number;
  steps:Array<any> = [];
  uploadProgress: Observable<number>;
  drinksImage: string;
  ingred0: string;
  ingred1: string;
  ingred2: string;
  ingred3: string;
  drinks: Array<IDrinks> = [];
  drinksName: string;
  drinksUrlName: string;
  drinksId: string;
  editStatus = false;
  constructor(private storage: AngularFireStorage,
    private drinkService: DrinksService) { }

  ngOnInit(): void {
    console.log(this.ingredients );
  }
createIngredient():void{
  if(+this.counts){
    for(let i = 0; i< this.counts; i++){
      const ingred = {
        ingredient: '',
        image: ''
      }
      this.ingredients.push(ingred)
    }
    console.log(this.ingredients );
  }
  else{
    console.log('loh');
    
  }


}
createSteps():void{
  if(+this.countStep){
    for(let i = 0; i< this.countStep; i++){
      const step = {
        step: '',
        image: ''
      }
      this.steps.push(step)
    }
    console.log(this.steps );
  }
  else{
    console.log('loh');
    
  }


}
checkIngred(el:any, id: number):void{
this.ingredients[id].ingredient = el;
console.log(this.ingredients);

}
checkSteps(el:any, id: number):void{
this.steps[id].step = el;
console.log(this.steps);


}

uploadFile(event): void {
  const file = event.target.files[0];
  const filePath = `images/${file.name}`;
  const upload = this.storage.upload(filePath, file);
  this.uploadProgress = upload.percentageChanges();

  upload.then(image => {
    this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
      this.drinksImage = url;
    });
    console.log('Photo added!');

  });
}
uploadFileIngred(event, id): void {
  const file = event.target.files[0];
  const filePath = `images/${file.name}`;
  const upload = this.storage.upload(filePath, file);
  this.uploadProgress = upload.percentageChanges();

  upload.then(image => {
    this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
      this.ingredients[id].image = url      
    });
    console.log('Photo added!');

  });
}
uploadFileStep(event, id): void {
  const file = event.target.files[0];
  const filePath = `images/${file.name}`;
  const upload = this.storage.upload(filePath, file);
  this.uploadProgress = upload.percentageChanges();

  upload.then(image => {
    this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
      this.steps[id].image = url      
    });
    console.log('Photo added!');

  });
}


getProducts(): void {
  this.drinkService.getAllProd().snapshotChanges().pipe(
    map(changes =>
      changes.map(c =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
      )
    )
  ).subscribe(data => {
    this.drinks = data;
  });

}

addProduct(): void {
  if (this.drinksName && this.drinksUrlName && this.ingredients  && this.steps) {
    const newProd = new Drinks('1',
      this.drinksName,
      this.drinksUrlName,
      this.ingredients,
      this.steps,
      this.drinksImage)
    delete newProd.id;
    this.drinkService.create(newProd)
   this.drinkService.updProd.subscribe(
     data => {
       console.log(data);
       newProd.id = data
      this.drinkService.update(data, newProd).then(
        () => {
          this.getProducts()
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
deleteProd(prod: IDrinks): void {

  this.drinkService.delete(prod.id.toString())
    .then(() => {
      // this.toastr.success('Product delete', 'Successed');
      this.getProducts()
    })
    .catch(err => {
      // this.toastr.error('Something go wrong', 'Denied');
    });
}
editProd(drink: IDrinks): void {
  this.drinksId = drink.id;
this.drinksName = drink.name;
this.drinksUrlName = drink.urlName;
this.ingredients = drink.ingredients;
this.steps = drink.stepOfCook;
this.drinksImage = drink.image;

  this.editStatus = true;

}
saveProd(): void {
  const saveD = new Drinks('1', this.drinksName, this.drinksUrlName, this.ingredients, this.steps, this.drinksImage)
  saveD.id = this.drinksId;

  this.drinkService.update(saveD.id.toString(), saveD)
    .then(() => {
      // this.toastr.success('Product update', 'Successed');
      this.getProducts()
    })
    .catch(err => {
      // this.toastr.error('Something go wrong', 'Denied');
    });
  this.resetForm();
  this.editStatus = false;
}
resetForm() {
  this.drinksName = '';
  this.drinksUrlName = '';
  this.ingredients = [];
  this.steps = [];
  this.drinksImage = '';
  // this.success = false;
  // this.procent = true;
}
}
