import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import { initializer } from './utils/app-init';
import {AuthGuard} from './auth.guard';
import {HttpClientModule} from '@angular/common/http';
import {WlayoutComponent} from './wlayout/wlayout.component';
import {NavigationComponent} from './navigation/navigation.component';
import {ExamAssignmentComponent} from './exam-assignment/exam-assignment.component';
import {ConfWrapperComponent} from './conf-wrapper/conf-wrapper.component';
import {ConfWrapperEditComponent} from './conf-wrapper-edit/conf-wrapper-edit.component';
import {ConfListComponent} from './conf-list/conf-list.component';
import {ConfGroupComponent} from './conf-group/conf-group.component';
import {ConfCreatorComponent} from './conf-creator/conf-creator.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamDetailComponent } from './exam-detail/exam-detail.component';
import { ExamCardComponent } from './exam-card/exam-card.component';
import { ExamResultsComponent } from './exam-results/exam-results.component';
import { ConfigurationsComponent } from './configurations/configurations.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ExamAssignmentListComponent } from './exam-assignment-list/exam-assignment-list.component';
import { ExamAssignmentEditComponent } from './exam-assignment-edit/exam-assignment-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    WlayoutComponent,
    NavigationComponent,
    ExamAssignmentComponent,
    ConfWrapperComponent,
    ConfWrapperEditComponent,
    ConfListComponent,
    ConfGroupComponent,
    ConfCreatorComponent,
    ExamListComponent,
    ExamDetailComponent,
    ExamCardComponent,
    ExamResultsComponent,
    ConfigurationsComponent,
    ExamAssignmentListComponent,
    ExamAssignmentEditComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    KeycloakAngularModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    HttpClientModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [AuthGuard, {
    provide: APP_INITIALIZER,
    useFactory: initializer,
    multi: true,
    deps: [KeycloakService]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
