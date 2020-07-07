import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-conf-group',
  templateUrl: './conf-group.component.html',
  styleUrls: ['./conf-group.component.scss']
})
export class ConfGroupComponent implements OnInit {

  @Input() groups: any;

  @Output() editGroup: EventEmitter<any> = new EventEmitter();
  @Output() removeGroup: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  edit(group) {
    console.log("edit group: ", group);
    this.editGroup.emit(group);
  }

  remove(groupId) {
    this.removeGroup.emit(groupId);
  }

}
