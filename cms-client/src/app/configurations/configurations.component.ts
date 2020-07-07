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
  public zeroConfigurations: boolean;

  constructor(private config: ConfigurationService) {
    this.configurations = this.config.getConfigurations().subscribe(data => {
      this.configurations = data;
      this.config.getConfigInfo().subscribe(data => {this.configInfo = data;});
      this.config.getAllLanguages().subscribe( data => {this.languages = data;})
      if(this.configurations && this.configurations.length == 0) {
        this.zeroConfigurations = true;
      }
    }, error => {
      alertify.error("Unable to retrieve configurations!");
    });
  }

  ngOnInit() {
    this.zeroConfigurations = false;
  }

  printConfig(config) {
    console.log("config: ", config);
  }

  deleteConfig(configurationId) {
    this.config.deleteConfiguration(configurationId).subscribe( data => {
      this.configurations = this.configurations.filter(config => config.id !== configurationId);
      alertify.success("Configuration deleted");
    }, error1 => {
      alertify.error("Failed to delete configuration");
    });
  }

}
