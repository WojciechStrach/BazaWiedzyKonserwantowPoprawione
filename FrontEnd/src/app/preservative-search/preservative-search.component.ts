import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ApiDataService } from '../api-data.service';
import { HttpModule } from '@angular/http';
import { PreservativeModel } from './preservative-search.model';

@Component({
  selector: 'app-preservative-search',
  templateUrl: './preservative-search.component.html',
  styleUrls: ['./preservative-search.component.scss']
})
export class PreservativeSearchComponent implements OnInit {

  protected inputValue;
  protected preservative: PreservativeModel;
  protected hintsTab;

  constructor(private apiDataService: ApiDataService, private preservativeModel: PreservativeModel ) { }

  ngOnInit() {
    this.inputValue = '';
    this.hintsTab = [];
    this.preservative = new PreservativeModel;
    this.preservative.preservativeCommonName = '';
    this.preservative.preservativeDescribe = '';
    this.preservative.preservativeSign = '';
    this.preservative.preservativeType = '';
    this.preservative.preservativeDiseases = [];
    this.preservative.preservativeProducts = [];
  }

  hints(searchInputValue) {
    this.apiDataService.searchPreservativeHint({hint: searchInputValue}).subscribe(
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

  preservativeSearch() {

    this.apiDataService.searchPreservative({search: this.inputValue}).subscribe(
      data => {
        if (data === null) {
          document.getElementById('openModalButton').click();
        } else {

          return true;
        }
       },
       error => {
         console.error('Error');
       }
  );

  }

}
