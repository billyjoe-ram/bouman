import { Component, OnInit} from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  
  ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Eggs', 6),
    new Ingredient('Flour', 6)
  ];
  
  constructor() { }

  ngOnInit(): void {
  }

  onIngredientAdded(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
  }

  onIngredientDeleted(ingredient: Ingredient) {
    console.log(ingredient);
    
    console.log(this.ingredients);
    
  }

}
