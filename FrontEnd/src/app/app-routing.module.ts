import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSearchComponent } from './product-search/product-search.component';
import { HomeComponent } from './home/home.component';
import { Component } from '@angular/core/src/metadata/directives';
import { PreservativeSearchComponent } from './preservative-search/preservative-search.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'search/product',
    component: ProductSearchComponent
  },
  {
    path: 'search/preservative',
    component: PreservativeSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
