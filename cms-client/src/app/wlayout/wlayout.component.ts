import { Component, OnInit } from '@angular/core';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-wlayout',
  templateUrl: './wlayout.component.html',
  styleUrls: ['./wlayout.component.scss']
})
export class WlayoutComponent implements OnInit {

  public isAdmin: boolean = false;

  constructor(private keycloak: KeycloakService) {
    this.isAdmin = false;
  }

  async ngOnInit() {
    let roles: string[] = await this.keycloak.getUserRoles();
    this.isAdmin = roles.includes('admin');
  }

}
