import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import alertify from 'alertifyjs';
import {ConfigurationService} from "../configuration.service";

@Component({
  selector: 'app-conf-creator',
  templateUrl: './conf-creator.component.html',
  styleUrls: ['./conf-creator.component.scss']
})
export class ConfCreatorComponent implements OnInit, OnChanges {

  @Input() configInfo;
  @Input() selectedGroup;

  @Output() group: EventEmitter<any> = new EventEmitter();

  public groupForm: FormGroup;

  public showLevel : boolean;
  public showLanguage : boolean;
  public showCount : boolean;
  public selectedQuestionCountDtos: any;
  public selectedLevels: any;
  public selectedLanguages: any;
  public selectedCount: any;
  private static_id: number;
  private languages: any;

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    this.initVariables();
  }

  constructor(private configService: ConfigurationService, private cdRef:ChangeDetectorRef) {
    this.configService.getAllLanguages().subscribe( data => {this.languages = data;})
  }

  ngOnInit() {
    this.groupForm = this.createFormGroup();
    this.static_id = 0;
    this.initVariables();
    // this.subscribeToChanges();
    // console.log("this.languages: " ,this.languages);
    // console.log("configInfo:", this.configInfo);
  }

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  initVariables(){
    if(this.selectedGroup!=null) {
      this.showLevel = true;
      this.showLanguage = true;
      this.showCount = true;
      this.groupForm.reset();
      this.groupForm.controls["category"].patchValue(this.selectedGroup.category);
      const selectedConfigInfo = this.configInfo.find(dto => dto.id == this.selectedGroup.category);
      console.log("selectedConfigInfo: ", selectedConfigInfo);
      this.categorySelected(this.configInfo.find(dto => dto.id == this.selectedGroup.category));
      this.groupForm.controls["level"].patchValue(this.selectedGroup.level);
      const selectedLevel = {id: this.selectedGroup.level, name: this.selectedGroup.level};
      this.levelSelected({id: this.selectedGroup.level, name: this.selectedGroup.level});
      // const languageName = this.selectedGroup.language ? this.selectedGroup.language : this.languages.find(lang => {if(lang.id == this.selectedGroup.languageId) {return lang.name;}});
      const languageName = this.selectedGroup.language;
      this.groupForm.controls["language"].patchValue(languageName);
      // this.languageSelected();
      this.groupForm.controls["count"].patchValue(this.selectedGroup.count);
    }
    else {
      this.showLevel = false;
      this.showLanguage = false;
      this.showCount = false;
    }
    this.selectedQuestionCountDtos = null;
    this.selectedLevels = new Array();
    this.selectedLanguages = new Array();
    this.selectedCount = new Array();
  }

  subscribeToChanges() {
    this.groupForm.controls["category"].valueChanges.subscribe(event => {console.log("category changed"); this.categorySelected(event);});
    this.groupForm.controls["level"].valueChanges.subscribe(event => {console.log("level changed"); this.levelSelected(event);});
    this.groupForm.controls["language"].valueChanges.subscribe(event => {console.log("language changed"); this.languageSelected(event);});
  }

  createFormGroup() {
    return new FormGroup({
      category: new FormControl(),
      level: new FormControl(),
      language: new FormControl(),
      count: new FormControl(),
    });
  }

  categorySelected(event: any){
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
    // console.log("categorySelected event: ", event);
    // console.log("categorySelected event.questionCountDtos: ", event.questionCountDtos);
    // console.log("this.selectedLevels: ", this.selectedLevels);
  }

  levelSelected(event: any){
    // console.log("levelSelected event: ", event);
    this.selectedLanguages = this.selectedQuestionCountDtos.filter( dto => dto.level == event.id);
    this.groupForm.controls["language"].patchValue(null);
    this.groupForm.controls["count"].patchValue(null);
    this.showLanguage = true;
  }

  languageSelected(event: any){
    // console.log("languageSelected event: ", event);
    this.selectedCount = new Array();
    let count = this.selectedLanguages.find( dto => dto.language == event.language);
    for (let i = 1; i <= count.count; i++){
      this.selectedCount.push({id: i, name: i});
    }
    this.groupForm.controls["count"].patchValue(null);
    this.showCount = true;
  }

  onSubmit(){
    // TODO: for newly created groups, set some kind of flag. When it's config EDIT/UPDATE, don't pass id?
    const group_id = this.static_id;
    this.static_id = this.static_id+1;
    const result: any = Object.assign({id: group_id, isNew: true}, this.groupForm.value);
    this.group.emit(result);
    alertify.notify("Group added");
    this.groupForm.reset();
    this.initVariables();
  }

  isEmptyOrSpaces(str) {
    return str === null || str.match(/^\s*$/) !== null;
  }

}
