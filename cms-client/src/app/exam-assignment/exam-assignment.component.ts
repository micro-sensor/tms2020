import {Component, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ConfigurationService} from '../configuration.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import alertify from 'alertifyjs';

@Component({
  selector: 'app-exam-assignment',
  templateUrl: './exam-assignment.component.html',
  styleUrls: ['./exam-assignment.component.scss']
})
export class ExamAssignmentComponent implements OnInit {

  public reviewForm: FormGroup;
  public configurations: any;
  public id: any;
  public exams: any;
  public users: any;
  public predicate: any = {
    'dateTimeTo': null,
    'dateTimeFrom': null,
    'firstName': "",
    'lastName': ""
  };

  isUsersLoading: boolean = true;
  isConfigurationsLoading: boolean = true;

  constructor(private formBuilder: FormBuilder, private configuration: ConfigurationService) {
    this.reviewForm = this.createFormGroup();
    // this.configuration.getConfigurations().subscribe((data) => {
    //   this.configurations = data;
    // });
    // this.reviewForm.valueChanges.pipe(
    //   debounceTime(1000),
    //   distinctUntilChanged()
    // ).subscribe(data => {
    //   this.configuration.isEmailValid(data.examinee).subscribe( data2 => {
    //     let email: ExamDto = <ExamDto>data2;
    //     this.id = data.examinee;
    //     console.log(data.examinee);
    //   })
    // });
  }

  ngOnInit() {
    this.configuration.getAllAssignmentsInit().subscribe(data => { this.exams = data;})
    this.configuration.getConfigurations().subscribe(data => {
      this.configurations = data;
      this.isConfigurationsLoading = false;
    });
    this.configuration.getAllUsers().subscribe(data => {
      this.users = data;
      this.isUsersLoading = false;
    });
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

export interface ExamDto{
  email?: string;
}
