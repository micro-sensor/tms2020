import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ConfigurationService} from '../configuration.service';

@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss']
})
export class ExamDetailComponent implements OnInit {

  public id: number;
  public assignments: any;
  public users: any;
  public configurations: any;
  public questions: any;

  constructor(private route: ActivatedRoute, private config: ConfigurationService) { }

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.id = params['id'];
      this.config.getAssignment(this.id).subscribe( data => {
        this.questions = data;
        this.questions = this.questions.questions;
        this.questions.map(n => {
          let choices = n.choices;
          let allMatechs = true;
          choices.forEach(ch => {
            if (ch.correct != ch.chosen) {
              allMatechs = false;
            }
          });
          if (allMatechs){
            n.questionCorrect = true;
          } else {
            n.questionCorrect = false;
          }
          return n;
        });
      });
      this.config.getAllAssignments().subscribe( data => {
        this.assignments = data;
      });
      this.config.getAllUsers().subscribe( data => {
        this.users = data;
      });
      this.config.getConfigurations().subscribe( data => {
        this.configurations = data;
      });
    }

  )
  }

}
