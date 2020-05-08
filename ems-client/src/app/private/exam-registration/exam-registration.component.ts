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

  examRegistrationlist: Exam[] = [];
  examsInProgress: Exam[] = [];
  examsReady: Exam[] = [];
  examsPast: Exam[] = [];

  username: any;
  userData: any;

  archiveMode: boolean = false;

  constructor(private examManager: ExamManagerService, private keycloak: KeycloakService) {
    console.log(this.keycloak.getUsername());
    this.keycloak.loadUserProfile().then(keycloakData => {
      console.log(keycloakData);
      let obs = this.examManager.getExamRegistrationsByUsername(keycloakData.username);
      this.username = keycloakData.username;
      obs.subscribe( data => {
        this.examRegistrationlist = data.filter(e => e.examinee === keycloakData.email).sort(this.examSorter);
        this.examsInProgress = this.examRegistrationlist.filter(e => e.status === "PROGRESS").sort(this.examSorter);
        this.examsReady = this.examRegistrationlist.filter(e => e.status === "INIT").sort(this.examSorter);
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
