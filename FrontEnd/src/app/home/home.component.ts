declare var System: any;
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  protected eList;

  constructor(private router: Router) { }

  ngOnInit() {
    System.import('../sources/listae.png').then(file => {
      this.eList = file;
    });
  }

}
