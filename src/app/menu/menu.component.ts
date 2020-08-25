import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from "../shared/dish";
import { DishService } from "../services/dish.service";
import { flyInOut, expand } from "../animations/app.animation";
import { animation } from '@angular/animations';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  host: {
   '[@flyInOut]': 'true',
   'style': 'display: block;'
   },
  animations: [
     flyInOut(),
     expand()
  ]
})


export class MenuComponent implements OnInit {
    errMess: string;
     dishes: Dish[];
     //selectedDish = DISHES[0];

     // selectedDish: Dish;

  constructor(private dishService: DishService,
     @Inject('BaseURL') private BaseURL) { }

  ngOnInit(): void {
       this.dishService.getDishes()
       .subscribe(dishes => this.dishes = dishes,
          errmess => this.errMess = <any>errmess);

  }
//   onSelect(dish:Dish)
//   {
//        this.selectedDish = dish;
//   }

}
