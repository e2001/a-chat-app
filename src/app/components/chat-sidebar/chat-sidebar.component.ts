import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';

@Component({
  selector: 'chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.less']
})
export class ChatSidebarComponent implements OnInit {

  @Input()
  roomUserName: string;
  @Input()
  roomName: string;
  @Input()
  users: string[];

  @Output() leaveRoomClicked = new EventEmitter();

  constructor() {
  }

  ngOnInit() {

  }

}
