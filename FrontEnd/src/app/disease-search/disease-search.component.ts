import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ApiDataService } from '../api-data.service';
import { HttpModule } from '@angular/http';
import { DiseaseModel } from './disease-search.model';

@Component({
  selector: 'app-disease-search',
  templateUrl: './disease-search.component.html',
  styleUrls: ['./disease-search.component.scss']
})
export class DiseaseSearchComponent implements OnInit {

  protected inputValue;
  protected disease: DiseaseModel;
  protected hintsPreservativesTab;

  constructor(private apiDataService: ApiDataService) { }

  ngOnInit() {
    this.inputValue = '';
    this.hintsPreservativesTab = [];
    this.disease.diseaseName = '';
    this.disease.diseasePreservatives = [];
  }

  hints(searchInputValue) {
    this.apiDataService.searchDiseaseHint({hint: searchInputValue}).subscribe(
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

    this.apiDataService.searchDisease({search: this.inputValue}).subscribe(
      data => {
        if (data === null) {
          document.getElementById('openModalButton').click();
        } else {
          this.disease.diseaseName = data['diseaseName'];
          this.disease.diseasePreservatives = data['diseasePreservatives'];
          return true;
        }
       },
       error => {
         console.error('Error');
       }
  );

  }

}
