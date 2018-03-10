import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../api-data.service';
import { HttpModule } from '@angular/http';
import { ProductAddModel } from './product-add.model';
import { forEach } from '@angular/router/src/utils/collection';
import { error } from 'util';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {

  protected addModel: ProductAddModel;
  protected allPreservativesArray: String[];
  protected allPreservativesHintsArray;

  constructor(private apiDataService: ApiDataService) { }

  ngOnInit() {
    this.addModel = {
      token: '',
      add: {
        productType: '',
        productFamily: '',
        productName: {
            Name: '',
            UrlObrazka: '',
        },
        productOwner: '',
        productPreservatives: [],
      },
    };

    this.allPreservativesArray = [];
    this.allPreservativesHintsArray = [];

    this.apiDataService.getAllPreservatives().subscribe(data => {
      for (let i = 0; i < Object(data).length; i++) {
        this.allPreservativesArray.push(data[i].x.properties.Oznaczenie);
        const tempObj = {
          preservativeSign: data[i].x.properties.Oznaczenie,
          preservativeCommonName: data[i].x.properties.Nazwa_zwyczajowa
        };
        this.allPreservativesHintsArray.push(tempObj);
      }
    });

  }

  assignPreservative(preservative) {
    this.addModel.add.productPreservatives.push(preservative);

    for (let i = 0; i < this.allPreservativesArray.length; i++) {
      if (this.allPreservativesArray[i] === preservative) {
        this.allPreservativesArray.splice(i, 1);
      }
    }
  }

  removeAssignedPreservative(preservative) {
    this.allPreservativesArray.push(preservative);

    for (let i = 0; i < this.addModel.add.productPreservatives.length; i++) {
      if (this.addModel.add.productPreservatives[i] === preservative) {
        this.addModel.add.productPreservatives.splice(i, 1);
      }
    }
  }

  addProduct() {
    this.apiDataService.addProduct(this.addModel).subscribe(data => {
      if (data === true) {

        document.getElementById('openSuccessModal').click();

      }
    }, err => {

      document.getElementById('openExceptionModal').click();
    }
    );
  }

}
