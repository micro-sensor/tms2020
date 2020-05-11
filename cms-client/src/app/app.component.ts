import { Component } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import alertify from 'alertifyjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'base-app';

  userDetails: KeycloakProfile;
  router: Router

  constructor(router: Router, private keycloakService: KeycloakService) {
    this.router = router;
    this.keycloakService.getToken().then(token => {
      localStorage.setItem("token", token);
    });
  }

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();
      let roles: string[] = await this.keycloakService.getUserRoles();
      if(!roles.includes('admin')) {
        alertify.error("Access denied");
        this.router.navigate(['/denied']);
      }
    }
  }

  async doLogout() {
    await this.keycloakService.logout();
  }
}
