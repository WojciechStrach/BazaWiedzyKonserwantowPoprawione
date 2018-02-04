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

  private nullDisplay;
  private hintsTab;
  private product: ProductSearch;

  constructor(private apiDataService: ApiDataService, private productmodel: ProductSearch) { }

  ngOnInit() {
    this.hintsTab = [];
    this.nullDisplay = 'none';
    this.apiDataService.searchProduct({search: 'Pepsi'}).subscribe(
            data => {
              if (data === null) {
                this.nullDisplay = 'block';
              } else {
                console.log(data);
                return true;
              }
             },
             error => {
               console.error('Error');
             }
    );
  }

  hints(searchInputValue) {
    console.log(searchInputValue);
  }

  nullClose() {
    this.nullDisplay = 'none';
  }

}
