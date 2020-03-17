import { Component, OnInit } from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import { environment } from '../../../environments/environment';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public isAdmin: boolean = false;
  public userData: KeycloakProfile;
  public active = false;
  public environment = environment;
  public name = "";

  constructor(private keycloak: KeycloakService) {
    this.isAdmin = false;
  }

  // async ngOnInit() {
  //   let roles: string[] = await this.keycloak.getUserRoles();
  //   console.log(roles);
  //   roles.forEach(r => {
  //     if (r == "admin"){
  //       console.log("true");
  //       this.isAdmin = true;
  //     }
  //   });

  //   this.keycloak.loadUserProfile(true).then(data => {
  //     this.userData = data;
  //   })
  // }

  ngOnInit() {
    this.keycloak.loadUserProfile(true).then(data => {
      this.userData = data;
      this.name = data.firstName + " " + data.lastName;
    });

    let roles: string[] = this.keycloak.getUserRoles();
    console.log(roles);
    roles.forEach(r => {
      if (r == "admin"){
        console.log("true");
        this.isAdmin = true;
      }
    });
  }

  toggleActive(){
    this.active = !this.active;
  }

  signOut(){
    this.keycloak.logout();
  }

}
