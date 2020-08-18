import { Component, OnInit } from '@angular/core';
import {ConfigurationService} from "../configuration.service";
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import alertify from 'alertifyjs';
import {ActivatedRoute} from "@angular/router";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-exam-assignment-edit',
  templateUrl: './exam-assignment-edit.component.html',
  styleUrls: ['./exam-assignment-edit.component.css']
})
export class ExamAssignmentEditComponent implements OnInit {

  public assignmentId: number;

  public reviewForm: FormGroup;
  public configurations: any;
  public id: any;
  public exams: any;
  public users: any;
  public examInfo: any;
  public predicate: any = {
    'dateTimeTo': null,
    'dateTimeFrom': null,
    'firstName': "",
    'lastName': ""
  };
  public fromDate: any;
  public toDate: any;
  public currentExaminee: any;
  public currentConfig: any;

  datePipe: DatePipe = new DatePipe('en-US');

  isUsersLoading: boolean = true;
  isConfigurationsLoading: boolean = true;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private configuration: ConfigurationService) {

    this.reviewForm = this.createFormGroup();

  }

  ngOnInit(): void {

    this.route.params.subscribe( params => {
      this.assignmentId = params['id'];


      this.configuration.getConfigurations().subscribe(data => {
        this.configurations = data;
        this.isConfigurationsLoading = false;

        this.configuration.getAssignment(this.assignmentId).subscribe((data) => {

          this.examInfo = data;
          this.fromDate = this.datePipe.transform(this.examInfo.examDateFrom, 'yyyy-MM-dd');
          this.toDate = this.datePipe.transform(this.examInfo.examDateTo, 'yyyy-MM-dd');
          this.currentExaminee = this.examInfo.examinee;
          this.currentConfig = this.configurations.filter(item => item.name==this.examInfo.configurationName)[0];

        });
      });

      this.configuration.getAllUsers().subscribe(data => {
        this.users = data;
        this.isUsersLoading = false;
      });



    })

  }

  createFormGroup() {
    return new FormGroup({
      examinee: new FormControl(),
      configurationId: new FormControl(),
      examDateFrom: new FormControl(),
      examDateTo: new FormControl()
    });
  }

  onSubmit() {
    // Make sure to create a deep copy of the form-model
    const result: any = Object.assign({}, this.reviewForm.value);

    result.configurationId = result.configurationId.id;
    result.id = this.assignmentId;
    console.log(result);
    // result.examinee = this.id;

    this.configuration.createExam(result).subscribe((data) => {
      alertify.success("Exam assigned!");
      this.reviewForm.reset();
      this.configuration.getAllAssignmentsInit().subscribe(data => {  this.exams = data;})
    }, error1 => {
      alertify.error("Failed to assign exam!");
    });

  }

  onDeleted(event){
    this.configuration.getAllAssignmentsInit().subscribe(data => { this.exams = data;});
  }



}
