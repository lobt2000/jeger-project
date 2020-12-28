import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { DrinksService } from 'src/app/service/drinks.service';
import { IDrinks } from 'src/app/shared/interfaces/drinks.interface';
import AOS from 'aos';

@Component({
  selector: 'app-drink',
  templateUrl: './drink.component.html',
  styleUrls: ['./drink.component.scss']
})
export class DrinkComponent implements OnInit {
  drinks: Array<IDrinks>
  constructor(private drinkService: DrinksService) { }

  ngOnInit(): void {
    this.getDrinks();
    AOS.init();
    window.scroll({
      top: 0,
      behavior: 'smooth'
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

}
