import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSearchComponent } from './product-search/product-search.component';
import { HomeComponent } from './home/home.component';
import { Component } from '@angular/core/src/metadata/directives';
import { PreservativeSearchComponent } from './preservative-search/preservative-search.component';
import { DiseaseSearchComponent } from './disease-search/disease-search.component';
import { ProductAddComponent } from './product-add/product-add.component';

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
  },
  {
    path: 'search/disease',
    component: DiseaseSearchComponent
  },
  {
    path: 'add/product',
    component: ProductAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
