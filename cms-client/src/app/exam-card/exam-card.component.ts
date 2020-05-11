import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import alertify from 'alertifyjs';

@Component({
  selector: 'app-exam-card',
  templateUrl: './exam-card.component.html',
  styleUrls: ['./exam-card.component.scss']
})
export class ExamCardComponent implements OnInit {

  @Input()
  public exam;

  @Input()
  public users;

  @Input()
  public configurations;

  @Input()
  public detail;

  @Input()
  public show: boolean = true;

  @Input()
  public type: string = "";

  @Output()
  toBeDelete: EventEmitter<any> = new EventEmitter();

  @Input('predicate')
  set setPredicate(predicate: any){
    this.show = true;
    if (predicate != undefined){
      let user = this.users.find(x => x.email == this.exam.examinee);
      if (predicate.firstName != "") {
        if (!user.firstName.includes(predicate.firstName)) {
          this.show = false;
        }
      }

      if (predicate.lastName != "") {
        if (!user.lastName.includes(predicate.lastName)) {
          this.show = false;
        }
      }

      let examDate = new Date(this.exam.examDate);
      if (predicate.dateTimeFrom != null){
        if (predicate.dateTimeFrom >= examDate){
          this.show = false;
        }
      }

      if (predicate.dateTimeTo != null){
        if (predicate.dateTimeTo <= examDate){
          this.show = false;
        }
      }
    }
  }

  constructor() { }

  ngOnInit() {
  }

  deleteAssignment(id){
    alertify.confirm('Delete Category', "Do you really want to delete this assignment?",
      () => {
        this.toBeDelete.emit(id);
      },
      function(){} // noop for cancel
    );
  }

}
