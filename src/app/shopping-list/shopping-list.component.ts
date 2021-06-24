import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients: Ingredient[]}>;
  private subscription: Subscription;

  constructor(
    private slServce: ShoppingListService,
    private store: Store<{shoppingList: {ingredients: Ingredient[]}}>
  ) { }

  ngOnInit() {
    console.log('ingredients: ', this.ingredients);

    this.ingredients = this.store.select('shoppingList')
  }

  onEditItem(index: number) {
    this.slServce.startedEditing.next(index);
  }

  ngOnDestroy(): void {
  }
}
