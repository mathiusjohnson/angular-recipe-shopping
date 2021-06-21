import { Recipe } from "./recipe.model";

export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe('A test recipe', 'a test', 'https://www.vegrecipesofindia.com/wp-content/uploads/2013/11/instant-pot-chana-masala-recipe-3-280x280.jpg'),
    new Recipe('A test recipe', 'a test', 'https://www.vegrecipesofindia.com/wp-content/uploads/2013/11/instant-pot-chana-masala-recipe-3-280x280.jpg')

  ];

  getRecipes() {
    return this.recipes.slice();
  }
}
