import {Component, Input, OnInit} from '@angular/core';
import {ExamManagerService} from '../exam-manager.service';
import {Router} from '@angular/router';
import { Exam } from 'src/app/model/exam';

@Component({
  selector: 'app-exam-card',
  templateUrl: './exam-card.component.html',
  styleUrls: ['./exam-card.component.scss']
})
export class ExamCardComponent implements OnInit {

  @Input() examreg: Exam;

  public currentDate: any;

  showReview: boolean = false;

  constructor(private examManager: ExamManagerService, private router: Router) { }

  ngOnInit() {
    this.currentDate = new Date().getTime();
  }

  startExam(){
    this.router.navigate(['exam', this.examreg.id ]);
    // this.examManager.takeExam(this.examreg.id).subscribe(data => {
    //   console.log(data);
    //
    // }, error1 => {
    //     console.log(error1);
    //   }
    // );
  }

}
