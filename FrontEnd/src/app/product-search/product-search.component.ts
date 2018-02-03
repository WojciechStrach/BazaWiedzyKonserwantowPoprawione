import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ApiDataService } from '../api-data.service';
import { HttpModule } from '@angular/http';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {

  constructor(private apiDataService: ApiDataService) { }

  ngOnInit() {
   // console.log(this.dataService.cars);
  }

}
