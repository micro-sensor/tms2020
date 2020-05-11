import { Component, OnInit } from '@angular/core';
import {ConfigurationService} from '../configuration.service';
import alertify from 'alertifyjs';

@Component({
  selector: 'app-exam-results',
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.scss']
})
export class ExamResultsComponent implements OnInit {

  public assignments: any;
  public filteredAssignments: any;
  public configurations: any;
  public users: any;
  public dateTimeTo: Date;
  public dateTimeFrom: Date;
  public first: string = "";
  public last: string = "";
  public predicate: any = {
    'dateTimeTo': null,
    'dateTimeFrom': null,
    'firstName': "",
    'lastName': ""
  };

  constructor(private config: ConfigurationService) { }

  ngOnInit() {
    this.config.getAllAssignments().subscribe(data => {
      this.assignments = data;
      this.filteredAssignments = data;
      this.assignments.sort( (a,b) => {
        let aDate = new Date(a.examDate);
        let bDate = new Date(b.examDate);
        if (a.examDate == null){
          return -1;
        }
        if (aDate > bDate){
          return -1;
        } else if (aDate < bDate){
          return 1;
        } else {
          return 0;
        }
      });

    });
    this.config.getConfigurations().subscribe(data => {
      this.configurations = data;
    }, error => {
      alertify.error("Failed to retrieve configurations!");
    });
    this.config.getAllUsers().subscribe(data => {
      this.users = data;
    }, error => {
      alertify.error("Failed to retrieve users!");
    });
  }


  filter(){
    let predicate = {
      'dateTimeTo': this.dateTimeTo,
      'dateTimeFrom': this.dateTimeFrom,
      'firstName': this.first,
      'lastName': this.last
    };
    this.predicate = predicate;
  }

  onDeleted(event){
    this.config.getAllAssignments().subscribe(data => { this.assignments = data;});
  }

}
