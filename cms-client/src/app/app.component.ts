import { Component } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'base-app';

  userDetails: KeycloakProfile;

  constructor(private keycloakService: KeycloakService) {
    this.keycloakService.getToken().then(token => {
      localStorage.setItem("token", token);
    });
  }

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();

    }
  }

  async doLogout() {
    await this.keycloakService.logout();
  }
}
