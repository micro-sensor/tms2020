import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WlayoutComponent} from './wlayout/wlayout.component';
import {ExamRegistrationComponent} from './exam-registration/exam-registration.component';
import {ExamComponent} from './exam/exam.component';
import { ArchiveComponent } from './archive/archive.component';
import { ExamReviewComponent } from './exam-review/exam-review.component';

const routes: Routes = [
    { path: '', component: WlayoutComponent, children: [
            { path: '', component: ExamRegistrationComponent },
            { path: 'exam/:id', component: ExamComponent },
            { path: 'archive', component: ArchiveComponent },
            { path: 'review/:id', component: ExamReviewComponent }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
