import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ProductAddModel } from './product-add/product-add.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiDataService {

  constructor(private http: HttpClient) { }

  //

  getAllPreservatives() {
    return this.http.get('http://localhost:3000/get/all_preservatives', httpOptions);
  }

  //

  searchProduct(search: {search: String}) {
    return this.http.post('http://localhost:3000/search/product', search, httpOptions);
  }
  searchProductHint(hint: {hint: String}) {
    return this.http.post('http://localhost:3000/search/product/hint', hint, httpOptions);
  }

  //

  searchPreservative(search: {search: String}) {
    return this.http.post('http://localhost:3000/search/preservative', search, httpOptions);
  }
  searchPreservativeHint(hint: {hint: String}) {
    return this.http.post('http://localhost:3000/search/preservative/hint', hint, httpOptions);
  }

  //

  searchDisease(search: {search: String}) {
    return this.http.post('http://localhost:3000/search/disease', search, httpOptions);
  }
  searchDiseaseHint(hint: {hint: String}) {
    return this.http.post('http://localhost:3000/search/disease/hint', hint, httpOptions);
  }

  //

  addProduct(addObject: ProductAddModel) {
    return this.http.post('http://localhost:3000/add/product', addObject, httpOptions);
  }
}
