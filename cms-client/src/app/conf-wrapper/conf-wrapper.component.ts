import { Component, OnInit } from '@angular/core';
import {ConfigurationService} from '../configuration.service';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-conf-wrapper',
  templateUrl: './conf-wrapper.component.html',
  styleUrls: ['./conf-wrapper.component.scss']
})
export class ConfWrapperComponent implements OnInit {

  public configForm: FormGroup;
  public groups: any = new Array();
  public configInfo: any;

  constructor(private config: ConfigurationService) { }

  ngOnInit() {
    this.config.getConfigInfo().subscribe((data) => {
      this.configInfo = data;
    });
    this.configForm = this.createFormGroup();
  }


  passGroup(group){
    this.groups.push(group);
  }

  createFormGroup() {
    return new FormGroup({
      name: new FormControl(),
      description: new FormControl()
    });
  }

  onSubmit(){
    const result: any = Object.assign({}, this.configForm.value);
    this.config.createConfig({
      name: result.name,
      description: result.description,
      groups: this.groups
    }).subscribe( (data) => {
      alert("Configuration created");
      this.configForm.reset();
      this.groups = [];
    })

  }

}
