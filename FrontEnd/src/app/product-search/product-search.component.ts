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
    this.inputValue = '';
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

}
