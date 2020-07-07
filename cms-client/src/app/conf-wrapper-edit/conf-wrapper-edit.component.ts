import { Component, OnInit } from '@angular/core';
import {ConfigurationService} from '../configuration.service';
import {FormControl, FormGroup} from '@angular/forms';
import alertify from 'alertifyjs';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-conf-wrapper-edit',
  templateUrl: './conf-wrapper-edit.component.html',
  styleUrls: ['./conf-wrapper-edit.component.scss']
})
export class ConfWrapperEditComponent implements OnInit {

  public configurationId: number;
  public configuration: any;
  private languages: any;
  public configForm: FormGroup;
  public groups: any = new Array();
  public configInfo: any;
  public selectedGroup: any;

  constructor(private route: ActivatedRoute, private configService: ConfigurationService) { }

  ngOnInit() {
    this.configForm = this.createFormGroup();
    this.selectedGroup = null;
    this.route.params.subscribe( params => {
      this.configurationId = params['id'];
      this.configService.getConfigInfo().subscribe((data) => {
        this.configInfo = data;
      });
      this.configService.getAllLanguages().subscribe( data => {
        // console.log("getAllLanguages data:", data);
        this.languages = data;
      })
      this.configService.getConfiguration(this.configurationId).subscribe((data) => {
        this.configuration = data;
        // console.log("getConfiguration data:", data);
        this.groups = this.configuration.groups;
        this.groups = this.groups.map( obj => {
          obj = { ...obj, isNew: false };
          if( 'languageId' in obj) {
            if (obj.languageId == null) {
              obj = {...obj, language: null};
            } else {
              const languageName = this.languages.find(lang => lang.id == obj.languageId);
              obj = {...obj, language: languageName.name};
            }
          }
          return obj;
        });
        this.configForm.patchValue({
          name: this.configuration.name,
          description: this.configuration.description,
          groups: this.groups,
        });
      }, error => {
        alertify.error("Couldn't find configuration with id=" + this.configurationId);
      });

    });
  }

  passGroup(group){
    this.groups.push(group);
    this.selectedGroup = null;
  }

  selectGroup(group) {
    this.groups = this.groups.filter(gr => gr.id !== group.id);
    this.selectedGroup = group;
  }

  deleteGroup(groupId) {
    this.groups = this.groups.filter(gr => gr.id !== groupId);
  }

  createFormGroup() {
    return new FormGroup({
      name: new FormControl(),
      description: new FormControl()
    });
  }

  reset() {
    this.ngOnInit();
  }

  onSubmit(){
    // TODO: for newly created groups, set some kind of flag. When it's config EDIT/UPDATE, don't pass group id?
    const result: any = Object.assign({}, this.configForm.value);
    console.log("this.groups before update: ", this.groups);
    this.configService.updateConfig(this.configurationId,{
      name: result.name,
      description: result.description,
      groups: this.groups
    }).subscribe( (data) => {
      alertify.notify("Configuration updated");
      this.configForm.reset();
      this.groups = [];
      this.selectedGroup = null;
      this.reset();
    }, error => {
      alertify.error("Failed to update configuration!");
    });

  }

}
