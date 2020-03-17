import { Component, OnInit, Input } from '@angular/core';
import { Exam } from 'src/app/model/exam';

@Component({
  selector: 'app-exam-archive',
  templateUrl: './exam-archive.component.html',
  styleUrls: ['./exam-archive.component.scss']
})
export class ExamArchiveComponent implements OnInit {

  @Input() exams: Exam[] = [];
  originalExams: Exam[] = [];
  filteredExams: Exam[] = [];

  config = "";

  constructor() {
    
  }

  ngOnInit() {
    
  }

  getFilteredExams(config: string): Exam[] {
    let filteredExams = this.exams;
    if (config !== "") {
      filteredExams.filter(e => e.configurationName === config);
    }

    return filteredExams;
  }

  getAllConfigs() : String[] {
    let allConfigs: String[] = [];
    if (this.exams.length > this.originalExams.length) {
      this.exams.forEach(e => {
        if (!allConfigs.includes(e.configurationName)) {
          allConfigs.push(e.configurationName);
        }
      });
    } else {
      this.originalExams.forEach(e => {
        if (!allConfigs.includes(e.configurationName)) {
          allConfigs.push(e.configurationName);
        }
      });
    }
    
    return allConfigs;
  }

  updateConfig(config: string) {
    if (this.originalExams.length === 0) {
      this.originalExams = this.exams;
    }

    if (config !== "") {
      this.exams = this.originalExams.filter(e => e.configurationName === config);
    } else {
      this.exams = this.originalExams;
    }
  }

}
