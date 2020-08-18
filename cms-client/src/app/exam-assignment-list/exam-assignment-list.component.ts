import { Component, OnInit } from '@angular/core';
import {ConfigurationService} from "../configuration.service";
import alertify from 'alertifyjs';


@Component({
  selector: 'app-exam-assignment-list',
  templateUrl: './exam-assignment-list.component.html',
  styleUrls: ['./exam-assignment-list.component.css']
})
export class ExamAssignmentListComponent implements OnInit {


  public assignments: any;
  public zeroAssignments: boolean;


  constructor(private config: ConfigurationService) {
    this.assignments = this.config.getExamsByStatus("INIT").subscribe(data => {
      this.assignments = data;
      if(this.assignments && this.assignments.length == 0) {
        this.zeroAssignments = true;
      }
    }, error => {
      alertify.error("Unable to retrieve exam assignments!");
    });


  }

  ngOnInit(): void {
  }

  deleteAssignment(assignmentId) {
    this.config.deleteAssignment(assignmentId).subscribe( data => {
      this.assignments = this.assignments.filter(config => config.id !== assignmentId);
      alertify.success("Exam assignment deleted");
    }, error1 => {
      alertify.error("Failed to delete assignment");
    });
  }

}
