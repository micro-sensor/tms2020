import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfigurationService} from '../configuration.service';
import alertify from 'alertifyjs';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.scss']
})
export class ExamListComponent implements OnInit {

  @Input()
  public detail: boolean = false;

  @Input()
  public delete: boolean = true;

  @Input()
  public exams: any;

  @Output()
  public deleted = new EventEmitter<string>();


  @Input()
  public users: any;

  @Input()
  public configurations: any;

  @Input()
  public predicate: any;

  @Input()
  public type: string;

  //load configuration info
  constructor(private configurationService: ConfigurationService) { }

  ngOnInit() {
  }

  deleteAssignment(id: any){
    this.configurationService.deleteAssignment(id).subscribe( data => {
      alertify.success("Assignment deleted");
      this.deleted.emit("deleted");
    }, error1 => {
      alertify.error("Failed to delete assignment");
    });
  }

}
