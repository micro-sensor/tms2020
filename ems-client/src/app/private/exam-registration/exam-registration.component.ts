import { Component, OnInit } from '@angular/core';
import {ExamRegistration} from "../../model/exam-registration";
import {ExamManagerService} from "../exam-manager.service";
import {KeycloakService} from 'keycloak-angular';
import { Exam } from 'src/app/model/exam';
import alertify from 'alertifyjs';

@Component({
  selector: 'app-exam-registration',
  templateUrl: './exam-registration.component.html',
  styleUrls: ['./exam-registration.component.scss']
})
export class ExamRegistrationComponent implements OnInit {

  public currentDate: Date;

  examRegistrationlist: Exam[] = [];
  examsInProgress: Exam[] = [];
  examsReady: Exam[] = [];
  examsPast: Exam[] = [];
  upcomingExams: Exam[] = [];

  isLoading: boolean = true;

  username: any;
  userData: any;

  archiveMode: boolean = false;

  constructor(private examManager: ExamManagerService, private keycloak: KeycloakService) {
    this.currentDate = new Date();
    console.log(this.currentDate);

    this.isLoading = true;
    this.keycloak.loadUserProfile().then(keycloakData => {
      console.log(keycloakData);
      let obs = this.examManager.getExamRegistrationsByUsername(keycloakData.username);
      this.username = keycloakData.username;
      obs.subscribe( data => {
          this.isLoading = false;
          this.examRegistrationlist = data.filter(e => e.examinee === keycloakData.email).sort(this.examSorter);
          this.examRegistrationlist.forEach(item => {
            let dateFrom = item.examDateFrom.toString();
            item.examDateFrom = new Date(parseInt(dateFrom.substr(0,4)),parseInt(dateFrom.substr(5,7))-1,parseInt(dateFrom.substr(8)));
            let dateTo = item.examDateTo.toString();
            item.examDateTo = new Date(parseInt(dateTo.substr(0,4)),parseInt(dateTo.substr(5,7))-1,parseInt(dateTo.substr(8)));
          });

          this.examsInProgress = this.examRegistrationlist.filter(e => e.status === "PROGRESS").sort(this.examSorter);
          this.upcomingExams = this.examRegistrationlist.filter(e => new Date(e.examDateFrom) > this.currentDate).sort(this.examSorter);
          this.examsReady = this.examRegistrationlist.filter(e => e.status === "INIT" &&  new Date(e.examDateFrom ) < this.currentDate  && this.currentDate < new Date(e.examDateTo)).sort(this.examSorter);
          this.examsPast = this.examRegistrationlist.filter(e => e.status === "DONE").sort(this.examSorter);

          // this.examManager.getAllUsers().subscribe(data => {
          //   console.log(data);
          //   this.userData = data;
          //   this.userData = this.userData.find(x => x.username == this.username);
          //   let id = this.userData.id;
          //   this.examRegistrationlist = this.examRegistrationlist.filter( x => x.examinee == this.userData.id)
          //   console.log(id);
          // });

        },
        error => {
          alertify.error('Failed to retrieve exams!');
        });
    })
  }

  private examSorter(a: Exam, b: Exam): number {
    let aDate = new Date(a.examDate);
    let bDate = new Date(b.examDate);
    console.log(aDate);
    if (a.submissionDate && b.submissionDate) {
      aDate = new Date(a.submissionDate);
      bDate = new Date(b.submissionDate);
    }

    if (aDate > bDate){
      return -1;
    } else if (aDate < bDate){
      return 1;
    } else {
      return 0;
    }

  }

  ngOnInit() {

  }
}
