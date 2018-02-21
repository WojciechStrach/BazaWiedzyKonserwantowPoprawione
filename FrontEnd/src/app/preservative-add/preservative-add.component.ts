import { Component, OnInit } from '@angular/core';
import { PreservativeAddModel } from './preservative-add.model';
import { ApiDataService } from '../api-data.service';

@Component({
  selector: 'app-preservative-add',
  templateUrl: './preservative-add.component.html',
  styleUrls: ['./preservative-add.component.scss']
})
export class PreservativeAddComponent implements OnInit {

  protected preservativeAddModel: PreservativeAddModel;
  protected diseaseInputValue: String;

  constructor(private apiDataService: ApiDataService) { }

  ngOnInit() {
    this.preservativeAddModel = {
      token: '',
      add: {
        preservativeType: '',
        preservativeSign: '',
        preservativeDescription: '',
        preservativeCommonName: '',
        preservativeDiseases: []
      }
    };

    this.diseaseInputValue = '';
  }

  addDisease() {
    this.preservativeAddModel.add.preservativeDiseases.push(this.diseaseInputValue);
  }

  removeAssignedDisease(disease) {
    for (let i = 0; i < this.preservativeAddModel.add.preservativeDiseases.length; i++) {
      if (this.preservativeAddModel.add.preservativeDiseases[i] === disease) {
        this.preservativeAddModel.add.preservativeDiseases.splice(i, 1);
      }
    }
  }

  addPreservative() {
    this.apiDataService.addPreservative(this.preservativeAddModel).subscribe(data => {
      if (data === true) {

        document.getElementById('openSuccessModal').click();

      }
    }, err => {

      document.getElementById('openExceptionModal').click();
    }
    );
  }

}
