import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';


import { AppComponent } from './app.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { ApiDataService } from './api-data.service';
import { ProductSearch } from './product-search/product-search.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ProductSearchComponent,
  ],
  imports: [
    HttpClientModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    AppRoutingModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [ApiDataService, HttpModule, HttpClientModule, ProductSearch],
  bootstrap: [AppComponent]
})
export class AppModule { }
