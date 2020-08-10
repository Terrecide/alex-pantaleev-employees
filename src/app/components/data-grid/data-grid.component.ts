import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { EmployeePair } from '../../models/employeePair.model';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit {

  constructor(private dataService: DataService) { }

  endResults: EmployeePair[] | EmployeePair;

  ngOnInit() {
    this.dataService.passDataSubject.subscribe(data => {
      this.endResults = data;
      console.log(this.endResults);
    })
  }

}
