import { Component, OnInit, Input } from '@angular/core';
import { ExamManagerService } from '../exam-manager.service';
import { ExamReview } from 'src/app/model/exam-review';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exam-review',
  templateUrl: './exam-review.component.html',
  styleUrls: ['./exam-review.component.scss']
})
export class ExamReviewComponent implements OnInit {

  private _examId: number;
  @Input() set examId(value: number) {
    this._examId = value;
    this.getReview(this._examId);
  }
  examReview: ExamReview;

  constructor(private examManager: ExamManagerService, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  getReview(id: number) {
    if (id === -1) {
      this.examReview = new ExamReview();
      this.examReview.questions = [];
      return;
    }
    this.examManager.getExamReview(id).subscribe(er => {
      this.examReview = er;
    });
  }

}
