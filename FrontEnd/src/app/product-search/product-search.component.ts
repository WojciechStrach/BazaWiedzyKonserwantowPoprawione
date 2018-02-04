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



constructor(private apiDataService: ApiDataService, private productmodel: ProductSearch) { }

  ngOnInit() {
    this.apiDataService.searchProduct({search: 'Pepsi Max'}).subscribe(
            data => {
               console.log(data);
               return true;
             },
             error => {
               console.error('Error');
             }
    );
  }

}
