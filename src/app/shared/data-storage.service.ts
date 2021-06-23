import { Injectable } from "@angular/core";
import { root } from "rxjs/internal-compatibility";
import { HttpClient } from '@angular/common/http';
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { map, tap } from "rxjs/operators";

@Injectable({providedIn: root})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipe() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://ng-course-recipe-book-11905-default-rtdb.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>('https://ng-course-recipe-book-11905-default-rtdb.firebaseio.com/recipes.json')
      .pipe(map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          }
        })
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes)
      })
    )
  }
}
