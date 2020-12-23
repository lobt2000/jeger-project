import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DrinksService } from 'src/app/service/drinks.service';
import { IDrinks } from 'src/app/shared/interfaces/drinks.interface';

@Component({
  selector: 'app-drink-details',
  templateUrl: './drink-details.component.html',
  styleUrls: ['./drink-details.component.scss']
})
export class DrinkDetailsComponent implements OnInit {
drink;
  constructor(private drinkService: DrinksService,private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {
    this.getDrink()
  }
  private getDrink(): void {
    const name = this.activatedRoute.snapshot.paramMap.get('name');
    this.drinkService.getOne(name).onSnapshot(
      document => {
        document.forEach(prod => {
          const product = {
            id: prod.id,
            ...prod.data() as IDrinks
          };
          this.drink = product;
          console.log(this.drink.image);
          
        });
      }
    );
  }
}
