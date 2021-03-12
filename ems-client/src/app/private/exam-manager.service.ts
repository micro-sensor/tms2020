import { Injectable } from '@angular/core';
import {Question} from '../model/question';
import {Choice} from '../model/choice';
import { environment } from '../../environments/environment'
import {ExamRegistration} from '../model/exam-registration';
import {Exam} from '../model/exam';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { ExamReview } from '../model/exam-review';
import { ExamSubmission } from '../model/exam-submission';

@Injectable({
  providedIn: 'root'
})
export class ExamManagerService {

  resultExam: Exam;

  examRegistrations: ExamRegistration[];

  questions: any;

  private BASE_URL: string = "https://tcs.ecs.baylor.edu/ems";
  private CMS_URL: string = "https://tcs.ecs.baylor.edu/cms";
  private EMS_URL: string = this.BASE_URL + "/exam";
  private TAKE_URL: string = this.BASE_URL + "/exam/take/";
  private CHOICE_URL: string = this.BASE_URL + "/choice";
  private SUBMIT_URL: string = this.BASE_URL + "/exam/submit/";
  private EXAM_URL: string = this.BASE_URL + "/exam/get/";
  private REVIEW_URL: string = this.BASE_URL + "/exam/review/";
  private headers: any;

  constructor(private router: Router, private http: HttpClient) {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("token")
    });
  }

  public getExam(examId: any): Observable<Exam>{
    return this.http.get<Exam>(this.EXAM_URL + examId, { headers: this.headers });
  }

  public submitExam(examId: number){
    return this.http.get(this.SUBMIT_URL + examId, { headers: this.headers });
  }

  public submitQuestion(obj: any): Observable<Object> {
    return this.http.post(this.CHOICE_URL, obj, { headers: this.headers });
  }

  public startExam(id: number): void {
    this.router.navigate(['app/exam', id ]);
  }

  public takeExam(id: number){
    return this.http.get(this.TAKE_URL + id, { headers: this.headers });
  }

  submitResultExam(exam: Exam){
    this.resultExam = exam;
  }

  // getExam(examRegistrationId: number): any{
  //   this.examRegistrations = this.getExamRegistrations();
  //   console.log(this.examRegistrations);
  //   let exam: Exam;
  //   this.examRegistrations.forEach(function (examReg) {
  //     if (examReg.id == examRegistrationId){
  //       console.log(examReg);
  //       exam = examReg.exam;
  //     }
  //   });
  //   return exam;
  // }

  public getExamRegistrations(): any {
    return this.http.get(this.EMS_URL);
  }

  public getExamRegistrationsByUsername(username: string){

    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("token")
    });
    return this.http.get<Exam[]>(this.EMS_URL , { headers: this.headers });
  }

  public getAllUsers() {
    return this.http.get(this.CMS_URL + "exam/users", { headers: this.headers });
  }

  //+ "/getByUsername/" + username

  public getExamReview(id: number): Observable<ExamReview> {
    return this.http.get<ExamReview>(this.REVIEW_URL + id, { headers: this.headers });
  }
}
