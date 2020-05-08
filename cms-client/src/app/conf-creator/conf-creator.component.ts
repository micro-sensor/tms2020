import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import alertify from 'alertifyjs';

@Component({
  selector: 'app-conf-creator',
  templateUrl: './conf-creator.component.html',
  styleUrls: ['./conf-creator.component.scss']
})
export class ConfCreatorComponent implements OnInit {

  @Input() configInfo;

  @Output() group: EventEmitter<any> = new EventEmitter();

  public groupForm: FormGroup;

  public showLevel : boolean;
  public showLanguage : boolean;
  public showCount : boolean;
  public selectedQuestionCountDtos: any;
  public selectedLevels: any;
  public selectedLanguages: any;
  public selectedCount: any;


  constructor() { }

  ngOnInit() {
    this.groupForm = this.createFormGroup();
    this.initVariables();
  }

  initVariables(){
    this.showLevel = false;
    this.showLanguage = false;
    this.showCount = false;
    this.selectedQuestionCountDtos = null;
    this.selectedLevels = new Array();
    this.selectedLanguages = new Array();
    this.selectedCount = new Array();
  }

  createFormGroup() {
    return new FormGroup({
      category: new FormControl(),
      level: new FormControl(),
      language: new FormControl(),
      count: new FormControl(),
    });
  }

  groupSelected(event: any){
    this.selectedQuestionCountDtos = event.questionCountDtos;
    let levels = new Array();
    this.selectedQuestionCountDtos.forEach(function (q) {
      levels.push(q.level);
    });
    let filteredLevels = levels.filter((x, i, a) => x && a.indexOf(x) === i);
    this.selectedLevels = new Array();
    filteredLevels.map(n => {
      console.log(n);
      this.selectedLevels.push({id: n, name: n});
    })
    this.showLevel = true;
    this.groupForm.controls["level"].patchValue(null);
    this.groupForm.controls["language"].patchValue(null);
    this.groupForm.controls["count"].patchValue(null);
  }

  levelSelected(event: any){
    this.selectedLanguages = this.selectedQuestionCountDtos.filter( dto => dto.level == event.id);
    this.groupForm.controls["language"].patchValue(null);
    this.groupForm.controls["count"].patchValue(null);
    this.showLanguage = true;
  }

  languageSelected(event: any){
    this.selectedCount = new Array();
    let count = this.selectedLanguages.find( dto => dto.language == event.language);
    for (let i = 1; i <= count.count; i++){
      this.selectedCount.push({id: i, name: i});
    }
    this.groupForm.controls["count"].patchValue(null);
    this.showCount = true;
  }

  onSubmit(){
    const result: any = Object.assign({}, this.groupForm.value);
    this.group.emit(result);
    alertify.notify("Group added");
    this.groupForm.reset();
    this.initVariables();
  }

  isEmptyOrSpaces(str) {
    return str === null || str.match(/^\s*$/) !== null;
  }

}
