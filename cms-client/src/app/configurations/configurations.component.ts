import { Component, OnInit } from '@angular/core';
import {ConfigurationService} from '../configuration.service';
import alertify from 'alertifyjs';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {

  public configurations: any;
  public configInfo: any;
  public languages: any;

  constructor(private config: ConfigurationService) {
    this.configurations = this.config.getConfigurations().subscribe(data => {
      this.configurations = data;
      this.config.getConfigInfo().subscribe(data => {this.configInfo = data;});
      this.config.getAllLanguages().subscribe( data => {this.languages = data;})
    }, error => {
      alertify.error("Unable to retrieve configurations!");
    });
  }

  ngOnInit() {
  }

}
