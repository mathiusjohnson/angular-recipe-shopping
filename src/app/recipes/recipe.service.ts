import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe('A test recipe', 'a test', 'https://www.vegrecipesofindia.com/wp-content/uploads/2013/11/instant-pot-chana-masala-recipe-3-280x280.jpg',
    [
      new Ingredient('Juice', 1),
      new Ingredient('Sauerkraut', 3)
    ]),
    new Recipe('A test recipe', 'a test', 'https://www.vegrecipesofindia.com/wp-content/uploads/2013/11/instant-pot-chana-masala-recipe-3-280x280.jpg',
    [
      new Ingredient('Broccoli', 5),
      new Ingredient('Carrots', 3)
    ])

  ];

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients)
  }
}
