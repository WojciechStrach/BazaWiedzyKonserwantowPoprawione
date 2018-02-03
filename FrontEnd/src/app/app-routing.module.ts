import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSearchComponent } from './product-search/product-search.component';
import { HomeComponent } from './home/home.component';
import { Component } from '@angular/core/src/metadata/directives';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'search/product',
    component: ProductSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
