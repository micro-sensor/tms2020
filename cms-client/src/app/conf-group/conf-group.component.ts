import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-conf-group',
  templateUrl: './conf-group.component.html',
  styleUrls: ['./conf-group.component.scss']
})
export class ConfGroupComponent implements OnInit {

  @Input() groups: any;

  constructor() { }

  ngOnInit() {
  }

}
