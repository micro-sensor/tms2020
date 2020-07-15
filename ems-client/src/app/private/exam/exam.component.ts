import { Component, OnInit } from '@angular/core';
import {ExamManagerService} from '../exam-manager.service';
import {Exam} from '../../model/exam';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, timer} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import { Question } from 'src/app/model/question';
import { QuestionSubmission } from 'src/app/model/question-submission';
import alertify from 'alertifyjs';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  // exam: Exam;
  // currentQuestion: number = 0;
  // currentQuestionText: string;
  // choices: any;
  // defaultChoice: any;

  public questions: Question[] = [];
  public markedQuestions: number[] = [];
  public qIndex: number;
  private examId: number;
  public exam: Exam;
  public diff: any;
  private textAnswer: string;

  isLoading: boolean = true;

  counter$: Observable<number>;
  count = 1800000;
  minute = 60000;


  constructor(private examManager: ExamManagerService, private route: ActivatedRoute, private router: Router) {
    this.isLoading = true;
    this.route.params.subscribe( params => {
      this.examManager.takeExam(params['id']).subscribe((data) => {
        this.questions = <Question[]>data;
        this.questions = this.questions.sort((q1, q2) => q1.id - q2.id);
        this.qIndex = 0;
        this.examId = params['id'];

        this.examManager.getExam(params['id']).subscribe( (data) => {
          this.isLoading = false;
          this.exam = data;
          this.counter$ = timer(0,60000).pipe(
            take(this.count),
            map(() => this.count = this.count - this.minute),
            tap( val => {
              let today: any = new Date();
              let deadline: any = new Date(this.exam.examDate);
              //let deadline: any = this.exam.examDate;
              deadline = new Date(deadline.getTime() + 5*60*60*1000);
              let diffMs: any = (deadline - today); // milliseconds between deadline and now
              // let diffDays = Math.floor(diffMs / 86400000); // days
              // let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
              let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
              this.diff = diffMins;
            })
          );
        }, error => {
          console.log(error);
          alertify.error('Failed to retrieve exam!');
          this.router.navigate(['/']);
        });
      }, error => {
          console.log(error);
          alertify.error('Failed to retrieve exam! It may have expired or been removed.');
        this.router.navigate(['/']);
      });
    });
  }

  choose(value: string) {

    this.questions[this.qIndex].choices[value].chosen = !this.questions[this.qIndex].choices[value].chosen;
  }

  chooseRadio(value: string){
    this.questions[this.qIndex].choices.forEach(e=>{
        e.chosen = false
    })
    this.questions[this.qIndex].choices[value].chosen = true;

  }

  ngOnInit() {
  }

  public next(): void {
    if (this.qIndex < this.questions.length -1){
      this.submitQuestion().subscribe(data => this.qIndex = this.qIndex + 1);
    }
  }

  public prev(): void {
    if (this.qIndex > 0) {
      this.submitQuestion().subscribe(data => this.qIndex -= 1);
    }
  }

  public jumpTo(index: number) {
    this.submitQuestion().subscribe(data => {
      if (index >= 0 && index < this.questions.length) {
        this.qIndex = index;
      }
    });
  }

  public toggleFlag() {
    this.questions[this.qIndex].flagged = !this.questions[this.qIndex].flagged;
  }

  public isFlagged() : boolean {
    return this.questions[this.qIndex].flagged;
  }

  public hasFlags() : boolean {
    return this.questions.filter(q => q.flagged).length > 0;
  }

  public submitExam(): void {
    this.examManager.submitExam(this.examId).subscribe( data => {
      this.router.navigate(['/']);
      alertify.success("Exam submitted!");
    }, error => {
      alertify.error("Failed to submit exam!");
    });
  }

  public submitQuestion() : Observable<Object> {
    let questionSubmission = new QuestionSubmission();
    questionSubmission.examId = this.examId;
    questionSubmission.questionId = this.questions[this.qIndex].id;
    questionSubmission.choiceEmsDtos = this.questions[this.qIndex].choices;
    questionSubmission.flagged = this.questions[this.qIndex].flagged;
    if (this.questions[this.qIndex].questionType=="TEXT"){
      questionSubmission.textAnswer = this.textAnswer;
    }
    return this.examManager.submitQuestion(questionSubmission);
  }

  /**
   * Submitting the exam & redirecting to corresponding results
   */
  public submit(){
    this.submitQuestion().subscribe( data => {
      console.log(data);
      alertify.confirm('Submit Exam', "Are you sure you want to submit the exam?",
        () => {
          this.submitExam();
        },
        function(){} // noop for cancel
      );
    }, error => {
      alertify.error("Failed to submit exam!");
    });
  }
}
