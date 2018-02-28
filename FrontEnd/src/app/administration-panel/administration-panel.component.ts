import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../api-data.service';
import { Console } from '@angular/core/src/console';

@Component({
  selector: 'app-administration-panel',
  templateUrl: './administration-panel.component.html',
  styleUrls: ['./administration-panel.component.scss']
})
export class AdministrationPanelComponent implements OnInit {

  allProductsArray;
  allPreservativesArray;
  product: ProductEdit;
  preservative: PreservativeEdit;


  constructor(private apiDataService: ApiDataService) { }

  loadProducts() {
    this.apiDataService.getAllProducts().subscribe(data => {
      for (let i = 0; i < Object(data).length; i++) {
        const tempObject = {
          productName: String,
          productPcitureUrl: String
        };
        tempObject.productName = data[i].x.properties.Nazwa;
        tempObject.productPcitureUrl = data[i].x.properties.Url_obrazka;
        this.allProductsArray.push(tempObject);
      }
    }, err => {

    }
    );
  }

  loadPreservatives() {
    this.apiDataService.getAllPreservatives().subscribe(data => {
      for (let i = 0; i < Object(data).length; i++) {
        const preservativeTempObject = {
          preservativeSign: String,
          preservativeCommonName: String,
          preservativeDescription: String
        };
        preservativeTempObject.preservativeSign = data[i].x.properties.Oznaczenie;
        preservativeTempObject.preservativeCommonName = data[i].x.properties.Nazwa_zwyczajowa;
        preservativeTempObject.preservativeDescription = data[i].x.properties.Opis;
        this.allPreservativesArray.push(preservativeTempObject);
      }
    }, err => {

    }
    );

  }

  ngOnInit() {
    this.product = {
      edit: {
        oldName: '',
        newName: '',
        pictureUrl: ''
      }
    };
    this.preservative = {
      edit: {
        oldPreservativeSign: '',
        newPreservativeSign: '',
        preservativeCommonName: '',
        preservativeDescription: '',
      }
    };
    this.allProductsArray = [];
    this.allPreservativesArray = [];
    this.loadProducts();
    this.loadPreservatives();
  }

  editOrRemoveProduct(productObject) {
    this.product.edit.oldName = productObject.productName;
    this.product.edit.newName = productObject.productName;
    this.product.edit.pictureUrl = productObject.productPcitureUrl;
    document.getElementById('productModalStarter').click();
  }

  deleteProduct() {
    const productRemoveObject = {
      delete: this.product.edit.oldName
    };
    this.apiDataService.deleteProduct(productRemoveObject).subscribe(data => {

        this.allProductsArray = [];
        this.loadProducts();
        document.getElementById('modalCloser').click();



    }, err => {

      this.allProductsArray = [];
        this.loadProducts();
        document.getElementById('modalCloser').click();

    }
    );

  }

  editProduct() {
    this.apiDataService.editProduct(this.product).subscribe(data => {


        this.allProductsArray = [];
        this.loadProducts();
        document.getElementById('modalCloser').click();

    }, err => {

      this.allProductsArray = [];
        this.loadProducts();
        document.getElementById('modalCloser').click();
    }
    );

  }

  editOrRemovePreservative(preservativeObject) {
    this.preservative.edit.oldPreservativeSign = preservativeObject.preservativeSign;
    this.preservative.edit.newPreservativeSign = preservativeObject.preservativeSign;
    this.preservative.edit.preservativeCommonName = preservativeObject.preservativeCommonName;
    this.preservative.edit.preservativeDescription = preservativeObject.preservativeDescription;
    document.getElementById('preservativeModalStarter').click();
  }

  deletePreservative() {
    const preservativeRemoveObject = {
      delete: this.preservative.edit.oldPreservativeSign
    };
    this.apiDataService.deletePreservative(preservativeRemoveObject).subscribe(data => {

        this.allPreservativesArray = [];
        this.loadPreservatives();
        document.getElementById('preservativeModalCloser').click();



    }, err => {

      this.allPreservativesArray = [];
        this.loadPreservatives();
        document.getElementById('preservativeModalCloser').click();

    }
    );

  }

  editPreservative() {
    this.apiDataService.editPreservative(this.preservative).subscribe(data => {


      this.allPreservativesArray = [];
      this.loadPreservatives();
      document.getElementById('preservativeModalCloser').click();

    }, err => {

      this.allPreservativesArray = [];
        this.loadPreservatives();
        document.getElementById('preservativeModalCloser').click();
    }
    );

  }

}




export interface ProductEdit {

  edit: {
    oldName: String,
    newName: String,
    pictureUrl: String
  };

}

export interface PreservativeEdit {

  edit: {

    oldPreservativeSign: String,
    newPreservativeSign: String,
    preservativeCommonName: String,
    preservativeDescription: String

  };

}

