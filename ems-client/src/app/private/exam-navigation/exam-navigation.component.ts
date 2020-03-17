import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Question } from 'src/app/model/question';

@Component({
  selector: 'app-exam-navigation',
  templateUrl: './exam-navigation.component.html',
  styleUrls: ['./exam-navigation.component.scss']
})
export class ExamNavigationComponent implements OnInit {
  @Input() questionList: Question[];
  @Input() markedQuestions: number[];
  @Input() currentQIndex: number;
  @Output() qIndexUpdater = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  jumpTo(index: number) {
    console.log("emitting " + index);
    this.qIndexUpdater.emit(index);
  }

  hasAnswers(q: Question) : boolean {
    return q.choices.filter(c => c.chosen).length > 0;
  }

}
