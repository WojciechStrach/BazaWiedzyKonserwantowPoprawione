import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ApiDataService } from '../api-data.service';
import { HttpModule } from '@angular/http';
import { ProductSearch } from './product-search.model';


@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {

  protected inputValue;
  protected nullDisplay;
  protected hintsTab;
  protected product: ProductSearch;

  constructor(private apiDataService: ApiDataService, private productmodel: ProductSearch) { }

  ngOnInit() {
    this.product = new ProductSearch();
    this.product.productPictureUrl = '';
    this.product.productName = '';
    this.product.productType = '';
    this.product.productOwner = '';
    this.product.diseases = [];
    this.product.preservatives = [];
    this.inputValue = '';
    this.hintsTab = [];
    this.nullDisplay = 'none';
  }

  hints(searchInputValue) {
    this.apiDataService.searchProductHint({hint: searchInputValue}).subscribe(
      data => {
        if (data === null) {

        } else {
          this.hintsTab = data['hints'];
          return true;
        }
       },
       error => {
         console.error('Error');
       }
    );
  }

  hintCompleter(hintText) {
    this.inputValue = hintText;
  }

  nullClose() {
    this.nullDisplay = 'none';
  }

  productSearch() {

    this.apiDataService.searchProduct({search: this.inputValue}).subscribe(
      data => {
        if (data === null) {
          this.nullDisplay = 'block';
        } else {
          this.product.productName = data['productName'];
          this.product.productPictureUrl = data['productPictureUrl'];
          this.product.preservatives = data['preservatives'];
          this.product.diseases = data['diseases'];
          this.product.productOwner = data['productOwner'];
          this.product.productType = data['productType'];
          return true;
        }
       },
       error => {
         console.error('Error');
       }
  );

  }

  preservativeDetails() {

  }

}
