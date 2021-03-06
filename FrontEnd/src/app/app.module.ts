import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { ApiDataService } from './api-data.service';
import { ProductSearch } from './product-search/product-search.model';
import { PreservativeModel } from './preservative-search/preservative-search.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { PreservativeSearchComponent } from './preservative-search/preservative-search.component';
import { DiseaseSearchComponent } from './disease-search/disease-search.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { PreservativeAddComponent } from './preservative-add/preservative-add.component';
import { AdministrationPanelComponent } from './administration-panel/administration-panel.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ProductSearchComponent,
    FooterComponent,
    PreservativeSearchComponent,
    DiseaseSearchComponent,
    ProductAddComponent,
    PreservativeAddComponent,
    AdministrationPanelComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    AppRoutingModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [ApiDataService, HttpModule, HttpClientModule, ProductSearch, PreservativeModel],
  bootstrap: [AppComponent]
})
export class AppModule { }
