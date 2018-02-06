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
  protected hintsPreservativesTab;

  constructor(private apiDataService: ApiDataService, private preservativeModel: PreservativeModel ) { }

  ngOnInit() {
    this.inputValue = '';
    this.hintsPreservativesTab = [];
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
          this.hintsPreservativesTab = data['hints'];
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
          this.preservative.preservativeCommonName = data['preservativeCommonName'];
          this.preservative.preservativeSign = data['preservativeSign'];
          this.preservative.preservativeDescribe = data['preservativeDescribe'];
          this.preservative.preservativeType = data['preservativeType'];
          this.preservative.preservativeDiseases = data['preservativeDiseases'];
          this.preservative.preservativeProducts = data['preservativeProducts'];
          return true;
        }
       },
       error => {
         console.error('Error');
       }
  );

  }

}
