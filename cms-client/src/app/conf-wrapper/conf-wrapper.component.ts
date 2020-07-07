import { Component, OnInit } from '@angular/core';
import {ConfigurationService} from '../configuration.service';
import {FormControl, FormGroup} from '@angular/forms';
import alertify from 'alertifyjs';

@Component({
  selector: 'app-conf-wrapper',
  templateUrl: './conf-wrapper.component.html',
  styleUrls: ['./conf-wrapper.component.scss']
})
export class ConfWrapperComponent implements OnInit {

  public configForm: FormGroup;
  public groups: any = new Array();
  public configInfo: any;
  public selectedGroup: any;

  constructor(private config: ConfigurationService) { }

  ngOnInit() {
    this.config.getConfigInfo().subscribe((data) => {
      this.configInfo = data;
    });
    this.configForm = this.createFormGroup();
    this.selectedGroup = null;
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

  onSubmit(){
    const result: any = Object.assign({}, this.configForm.value);
    console.log("this.groups before submit: ", this.groups);
    this.config.createConfig({
      name: result.name,
      description: result.description,
      groups: this.groups
    }).subscribe( (data) => {
      alertify.notify("Configuration created");
      this.configForm.reset();
      this.groups = [];
      this.selectedGroup = null;
    }, error => {
      alertify.error("Failed to create configuration!");
    })

  }

}
