import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiDataService {

  constructor(private http: HttpClient) { }

  searchProduct(search: {search: String}) {
    return this.http.post('http://localhost:3000/search/product', search, httpOptions);
  }

}
