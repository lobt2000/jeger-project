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
  stepsImg: string;
  stepsOfCook: string;
  isIngred = false;
  ingredImg: string;
  ingred: string;
  ingredients: Array<any> = [];
  isStep = false;
  steps:Array<any> = [];
  uploadProgress: Observable<number>;
  drinksImage: string;
  drinks: Array<IDrinks> = [];
  drinksName: string;
  drinksUrlName: string;
  drinksId: string;
  editStatus = false;
  transformI = 'translate3d(0,-150%,0)';
  colorI = "transparent";
  positionI = 'calc(-100%)';
  transformS = 'translate3d(0,-150%,0)';
  colorS = "transparent";
  positionS = 'calc(-100%)';
  ingredId: any;
  stepId: any;
  editIngredStatus = false;
  editStepStatus = false;
  taste: string;
  constructor(private storage: AngularFireStorage,
    private drinkService: DrinksService) { }

  ngOnInit(): void {
    
    this.getDrinks();
  }
createIngredient():void{
  this.isIngred = !this.isIngred;
  if (this.isIngred) {
    this.transformI = 'translate3d(0,0%,0)';
    this.colorI = "rgba(0, 0, 0, .7)";
    this.positionI = 'calc(0%)';
  }
  else {
    this.transformI = 'translate3d(0,-150%,0)';
    this.colorI = "transparent";
    this.positionI = 'calc(0%)';
    if (window.innerWidth < 696) {
      setTimeout(() => {
        this.positionI = 'calc(-100%)';
        this.ingredImg = '';
        this.ingred = '';
      }, 1000);
    }
    else {
      setTimeout(() => {
        this.positionI = 'calc(-100%)';
        this.ingredImg = '';
        this.ingred = '';
      }, 1000);
    }


  }


}
createSteps():void{
  this.isStep = !this.isStep;
  if (this.isStep) {
    this.transformS = 'translate3d(0,0%,0)';
    this.colorS = "rgba(0, 0, 0, .7)";
    this.positionS = 'calc(0%)';
  }
  else {
    this.transformS = 'translate3d(0,-150%,0)';
    this.colorS = "transparent";
    this.positionS = 'calc(0%)';
    if (window.innerWidth < 696) {
      setTimeout(() => {
        this.positionS = 'calc(-100%)';
this.stepsImg = '';
this.stepsOfCook = '';
      }, 1000);
    }
    else {
      setTimeout(() => {
        this.positionS = 'calc(-100%)';
        this.stepsImg = '';
this.stepsOfCook = '';
      }, 1000);
    }


  }

}
addIngred():void{
  const ingred = {
    ingredient: this.ingred,
    image: this.ingredImg
  }
this.ingredients.push(ingred);

}
addSteps():void{
  const step = {
    step: this.stepsOfCook,
    image: this.stepsImg
  }
this.steps.push(step);

}
editIngred(ingred : any, id: any):void{
 this.createIngredient()
 this.ingredId = id;
     this.ingred = ingred.ingredient;
    this.ingredImg = ingred.image;
    this.editIngredStatus = true
}
editStep(ste : any, id: any):void{
 this.createSteps();
 this.stepId = id;
    this.stepsOfCook = ste.step;
    this.stepsImg = ste.image;
    this.editStepStatus = true
}

deleteIngred(ingred: any):void{
  this.ingredients.splice(ingred, 1)
}
deleteStep(step: any):void{
  this.steps.splice(step, 1)
}
saveStep():void{
  this.steps[this.stepId].step = this.stepsOfCook; 
  this.steps[this.stepId].image = this.stepsImg; 
  this.editStepStatus = false;
  this.stepsOfCook = '';
  this.stepsImg = '';
}
saveIngred():void{
  this.ingredients[this.ingredId].ingredient = this.ingred; 
  this.ingredients[this.ingredId].image = this.ingredImg; 
  this.editIngredStatus = false;
  this.ingred = '';
  this.ingredImg = '';
}

uploadFile(event): void {
  const file = event.target.files[0];
  const filePath = `image/${file.name}`;
  const upload = this.storage.upload(filePath, file);
  this.uploadProgress = upload.percentageChanges();

  upload.then(image => {
    this.storage.ref(`image/${image.metadata.name}`).getDownloadURL().subscribe(url => {
      this.drinksImage = url;
    });
    console.log('Photo added!');

  });
}
uploadFileIngred(event): void {
  const file = event.target.files[0];
  const filePath = `image/${file.name}`;
  const upload = this.storage.upload(filePath, file);
  this.uploadProgress = upload.percentageChanges();

  upload.then(image => {
    this.storage.ref(`image/${image.metadata.name}`).getDownloadURL().subscribe(url => {
      console.log(url);
      
      this.ingredImg = url      
    });
    console.log('Photo added!');

  });
}
uploadFileStep(event): void {
  const file = event.target.files[0];
  const filePath = `image/${file.name}`;
  const upload = this.storage.upload(filePath, file);
  this.uploadProgress = upload.percentageChanges();

  upload.then(image => {
    this.storage.ref(`image/${image.metadata.name}`).getDownloadURL().subscribe(url => {
      this.stepsImg = url      
    });
    console.log('Photo added!');

  });
}


getDrinks(): void {
  this.drinkService.getAllDrinks().snapshotChanges().pipe(
    map(changes =>
      changes.map(c =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
      )
    )
  ).subscribe(data => {
    this.drinks = data;
  });

}

addDrink(): void {
  if (this.drinksName && this.drinksUrlName && this.ingredients  && this.steps) {
    const newDrink = new Drinks('1',
      this.drinksName,
      this.drinksUrlName,
      this.ingredients,
      this.steps,
      this.taste,
      this.drinksImage)
    delete newDrink.id;
    this.drinkService.create(newDrink)
   this.drinkService.updProd.subscribe(
     data => {
       console.log(data);
       newDrink.id = data
      this.drinkService.update(data, newDrink).then(
        () => {
          this.getDrinks()
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
deleteDrink(drink: IDrinks): void {

  this.drinkService.delete(drink.id.toString())
    .then(() => {
      // this.toastr.success('Product delete', 'Successed');
      this.getDrinks()
    })
    .catch(err => {
      // this.toastr.error('Something go wrong', 'Denied');
    });
}
editDrink(drink: IDrinks): void {
  this.drinksId = drink.id;
this.drinksName = drink.name;
this.drinksUrlName = drink.urlName;
this.ingredients = drink.ingredients;
this.steps = drink.stepOfCook;
this.drinksImage = drink.image;
this.taste = drink.taste;
  this.editStatus = true;

}
saveDrink(): void {
  const saveD = new Drinks('1', this.drinksName, this.drinksUrlName, this.ingredients, this.steps, this.taste,  this.drinksImage)
  saveD.id = this.drinksId;
  this.drinkService.update(saveD.id.toString(), saveD)
    .then(() => {
      // this.toastr.success('Product update', 'Successed');
      this.getDrinks()
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
  this.ingred = '';
  this.stepsOfCook = '';
  this.ingredImg = '';
  this.stepsImg = '';
  // this.success = false;
  // this.procent = true;
}
}
