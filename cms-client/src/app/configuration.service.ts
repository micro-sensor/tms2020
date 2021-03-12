import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {KeycloakService} from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {

  private CMS_URL: string = "https://tcs.ecs.baylor.edu/cms/";
  private EMS_URL: string = "https://tcs.ecs.baylor.edu/ems/";
  private UMS_URL: string = "https://tcs.ecs.baylor.edu/ums/";
  private QMS_URL: string = "https://tcs.ecs.baylor.edu/qms/language";
  private headers: any;

  constructor(private http: HttpClient, private keycloakService: KeycloakService) {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("token")
    });
  }

  public getConfigInfo() {

    // http.setRequestHeader("Authorization", "Bearer " + );
    return this.http.get(this.CMS_URL + "categoryInfo", { headers: this.headers });
  }

  public getAllUsers() {
    return this.http.get(this.UMS_URL + "userinfo/users", { headers: this.headers });
  }

  public getConfigurations() {
    return this.http.get(this.CMS_URL + "configuration", { headers: this.headers });
  }

  public getConfiguration(configId: number) {
    return this.http.get(this.CMS_URL + "configuration/" + configId, { headers: this.headers });
  }

  public deleteConfiguration(configId: number) {
    console.log("Hello from CMS->configService->deleteConfig");
    return this.http.delete(this.CMS_URL + "configuration/" + configId, { headers: this.headers });
  }

  createConfig(config: any) {
    return this.http.post(this.CMS_URL + "configuration", config, { headers: this.headers } );
  }

  updateConfig(configId: number, config: any) {
    return this.http.put(this.CMS_URL + "configuration/" + configId, config, { headers: this.headers } );
  }

  createExam(exam: any) {
    return this.http.post(this.EMS_URL + "exam", exam, { headers: this.headers } );
  }

  isEmailValid(email: string) {
    return this.http.get(this.CMS_URL + "exam/" + email, { headers: this.headers } );
  }

  getAssignment(id){
    return this.http.get(this.EMS_URL + "exam/review/" + id, { headers: this.headers });
  }

  getAllLanguages(){
    return this.http.get(this.QMS_URL, { headers: this.headers });
  }

  deleteAssignment(id){
    return this.http.delete(this.EMS_URL + "exam/" + id, { headers: this.headers });
  }

  getAllAssignmentsInit(){
    return this.http.get(this.EMS_URL + "exam", { headers: this.headers });
  }

  getAllAssignments(){
    return this.http.get(this.EMS_URL + "exam", { headers: this.headers });
  }

  getExamsByStatus(status){
    return this.http.get(this.EMS_URL + "exam/status/" + status, { headers: this.headers });
  }

  getQuestions(id){
    return this.http.delete(this.EMS_URL + "exam/" + id, { headers: this.headers });
  }


}
