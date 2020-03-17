import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { ExamRegistrationComponent } from './exam-registration/exam-registration.component';
import { ExamComponent } from './exam/exam.component';
import { WlayoutComponent } from './wlayout/wlayout.component';
import { ExamCardComponent } from './exam-card/exam-card.component';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { NavigationComponent } from './navigation/navigation.component';
import { ArchiveComponent } from './archive/archive.component';
import { ExamReviewComponent } from './exam-review/exam-review.component';
import { ExamNavigationComponent } from './exam-navigation/exam-navigation.component';
import { ExamArchiveComponent } from './exam-archive/exam-archive.component';

@NgModule({
  declarations: [ExamRegistrationComponent, ExamComponent, WlayoutComponent, ExamCardComponent, NavigationComponent, ArchiveComponent, ExamReviewComponent, ExamNavigationComponent, ExamArchiveComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PrivateRoutingModule
  ]
})
export class PrivateModule { }
