import { Component, OnInit } from '@angular/core';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public isAdmin: boolean = false;
  public userData: any;
  public active = false;

  constructor(private keycloak: KeycloakService) {
    this.isAdmin = false;
  }

  async ngOnInit() {
    let roles: string[] = await this.keycloak.getUserRoles();
    this.isAdmin = roles.includes('admin');
    this.keycloak.loadUserProfile(true).then(data => {
      this.userData = data;
    })
  }

  toggleActive(){
    this.active = !this.active;
  }

  signout(){
    this.keycloak.logout();
  }

}
